# Чат поддержки — план интеграции

Выбранный вариант: **Telegram-бот**.

---

## Как это работает

```
Пользователь (браузер)
      │
      │  POST /api/support/message  { text, session_id }
      ▼
Бэкенд (FastAPI)
      │
      │  Bot API → sendMessage(chat_id оператора, text)
      ▼
Telegram-чат поддержки
      │
      │  Оператор печатает ответ в Telegram
      │
      ▼  webhook: POST /api/support/webhook  (от Telegram)
Бэкенд (FastAPI)
      │
      │  пушит ответ в браузер (WebSocket / polling)
      ▼
Пользователь видит ответ в чате
```

---

## Что нужно сделать

### 1. Telegram
- Создать бота через @BotFather → получить `BOT_TOKEN`
- Узнать `OPERATOR_CHAT_ID` — Telegram ID чата/группы поддержки
  (можно через @userinfobot или временный echo-хендлер)

### 2. Бэкенд (`backend/`)

Добавить в `main.py` три эндпоинта:

| Метод | Путь | Что делает |
|-------|------|------------|
| `POST` | `/api/support/message` | Принимает сообщение от пользователя, пересылает оператору в Telegram |
| `GET`  | `/api/support/messages` | Возвращает историю сообщений для конкретной сессии (`?session_id=...&since=<ts>`) |
| `POST` | `/api/support/webhook` | Принимает ответы оператора от Telegram (webhook), сохраняет в БД |

В БД (`clickvpn.db`) добавить таблицу `support_messages`:
```sql
CREATE TABLE support_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL,       -- уникальный ID сессии пользователя
    from_       TEXT NOT NULL,       -- 'user' или 'support'
    text        TEXT NOT NULL,
    ts          INTEGER NOT NULL     -- Unix timestamp (ms)
);
```

Пример работы `telegram_link.py` уже есть в проекте — можно взять оттуда паттерн вызова Bot API.

### 3. Фронтенд (`frontend/src/components/SupportChat.tsx`)

Заменить заглушку `sendMessage()` на реальные запросы:

- `sendMessage()` → `POST /api/support/message`
- Каждые 3–5 секунд → `GET /api/support/messages?session_id=...&since=<last_ts>`
  (polling; можно позже заменить на WebSocket для real-time)
- `session_id` генерировать один раз и хранить в `localStorage`

### 4. Webhook

Зарегистрировать webhook у Telegram, чтобы ответы оператора приходили на бэкенд:
```
POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook
Body: { "url": "https://yourdomain.com/api/support/webhook" }
```

---

## Переменные окружения

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_OPERATOR_CHAT_ID=...
```

---

## Текущее состояние

- [x] UI чата готов (`frontend/src/components/SupportChat.tsx`)
- [x] Состояние сохраняется в `localStorage`
- [ ] Бэкенд-эндпоинты `/api/support/*`
- [ ] Таблица `support_messages` в БД
- [ ] Telegram-бот создан и токен получен
- [ ] Webhook зарегистрирован
- [ ] Polling / WebSocket на фронте
