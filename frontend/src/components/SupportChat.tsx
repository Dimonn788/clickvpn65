import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";

const SHOW_SUPPORT_CHAT = false;

interface Message {
  id: string;
  text: string;
  from: "user" | "support";
  ts: number;
}

const STORAGE_KEY_OPEN = "support_chat_open";
const STORAGE_KEY_MSGS = "support_chat_messages";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function SupportChat() {
  if (!SHOW_SUPPORT_CHAT) return null;

  const [isOpen, setIsOpen] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEY_OPEN, false),
  );
  const [messages, setMessages] = useState<Message[]>(() =>
    loadFromStorage<Message[]>(STORAGE_KEY_MSGS, []),
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OPEN, JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  // TODO: интеграция через Telegram-бота
  //
  // Выбранный способ: пользователь пишет сообщение → оно уходит на бэкенд (POST /api/support/message),
  // бэкенд пересылает текст в Telegram-чат поддержки через Bot API (sendMessage к оператору).
  // Оператор отвечает прямо в Telegram. Ответ возвращается пользователю одним из способов:
  //   - WebSocket: бэкенд держит соединение, при ответе оператора пушит сообщение в браузер (real-time)
  //   - Polling: фронт каждые N секунд спрашивает GET /api/support/messages?since=<ts>
  //
  // У нас уже есть telegram_link.py — там можно взять пример работы с Bot API.
  // Нужно будет:
  //   1. Создать Telegram-бота (@BotFather) и получить токен
  //   2. Добавить эндпоинты /api/support/* в backend/main.py
  //   3. Хранить сессии чатов (chat_id пользователя ↔ Telegram chat_id оператора) в БД
  //   4. Настроить webhook от Telegram → бэкенд, чтобы ловить ответы оператора
  //
  // Пока что sendMessage — заглушка с локальным автоответом.
  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `${Date.now()}-u`,
      text,
      from: "user",
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Заглушка: имитация ответа поддержки
    setTimeout(() => {
      const reply: Message = {
        id: `${Date.now()}-s`,
        text: "Спасибо за обращение! Мы свяжемся с вами в ближайшее время.",
        from: "support",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Панель чата */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 z-50 flex h-[420px] w-80 flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-2xl sm:right-6"
          style={{ backdropFilter: "blur(12px)" }}
        >
          {/* Шапка */}
          <div className="flex items-center justify-between border-b border-border/50 bg-surface-elevated px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface-elevated" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Поддержка</p>
                <p className="text-xs text-muted-foreground">Онлайн</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-border/30 hover:text-foreground"
              aria-label="Свернуть чат"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">
                    Задайте вопрос — мы поможем!
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-border/30 text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Ввод */}
          <div className="border-t border-border/50 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите сообщение..."
                className="flex-1 rounded-xl border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40 hover:opacity-90"
                aria-label="Отправить"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Кнопка-триггер */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:opacity-90 sm:right-6"
        aria-label={isOpen ? "Закрыть чат" : "Открыть чат поддержки"}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
