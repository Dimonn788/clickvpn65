# Инструкция по запуску ClickVPN на Windows

## Что понадобится

- Windows 10 / 11
- Python 3.11+ — [скачать с python.org](https://www.python.org/downloads/)
- Node.js 20+ — [скачать с nodejs.org](https://nodejs.org/)

> При установке Python обязательно поставить галочку **"Add Python to PATH"**.

---

## Шаг 1 — Установить Python и Node.js

1. Скачать Python с [python.org](https://www.python.org/downloads/) и установить.  
   На первом экране обязательно поставить галочку **Add python.exe to PATH**.

2. Скачать Node.js с [nodejs.org](https://nodejs.org/) и установить (версия LTS).

Проверить в PowerShell:
```powershell
python --version    # должно быть 3.11+
node --version      # должно быть 20+
```

---

## Шаг 2 — Разместить проект

Скопировать папку `site\` на сервер любым способом (FTP, архив, git).  
Допустим, она окажется по пути `C:\clickvpn\site`.

---

## Шаг 3 — Собрать фронтенд

Открыть PowerShell и выполнить:

```powershell
cd C:\clickvpn\site\frontend
npm install
npm run build
```

После этого в папке `backend\static\` появятся файлы сайта. Папка `frontend\` больше не нужна.

---

## Шаг 4 — Установить зависимости бэкенда

```powershell
cd C:\clickvpn\site\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

---

## Шаг 5 — Создать файл с настройками

Создать файл `C:\clickvpn\site\backend\.env` (обычный текстовый файл, расширение `.env`).  
Можно создать через Блокнот: Файл → Сохранить как → в поле имени написать `.env`, тип файла — "Все файлы".

Содержимое:

```env
# Обязательно — случайная строка, можно любую
SESSION_SECRET=замените-на-случайную-строку-из-30-символов

# Remnawave (VPN-панель)
REMNAWAVE_API_URL=https://ваш-remnawave.домен
REMNAWAVE_API_TOKEN=токен-из-панели-remnawave
REMNAWAVE_SQUAD_UUID=uuid-сквада-если-есть

# Platega (приём платежей картой и СБП)
PLATEGA_MERCHANT_ID=ваш-merchant-id
PLATEGA_SECRET=ваш-secret

# Heleket (приём криптовалюты, необязательно)
HELEKET_MERCHANT_ID=
HELEKET_API_KEY=

# Resend (отправка email-ссылок для входа)
RESEND_API_KEY=re_...

# Адрес сайта (без слеша в конце)
PUBLIC_URL=https://ваш-домен.ru

# Куда вернуть после оплаты
PAYMENT_RETURN_URL=https://ваш-домен.ru/dashboard
PAYMENT_FAILED_URL=https://ваш-домен.ru/dashboard

# В продакшне всегда true
SESSION_HTTPS_ONLY=true
```

---

## Шаг 6 — Запустить сервер

### Вручную (для проверки)

```powershell
cd C:\clickvpn\site\backend
.venv\Scripts\activate

# Загрузить переменные из .env
foreach ($line in Get-Content .env) {
    if ($line -notmatch '^\s*#' -and $line -match '=') {
        $parts = $line -split '=', 2
        [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), 'Process')
    }
}

uvicorn main:app --host 0.0.0.0 --port 8000
```

Сайт будет доступен на `http://localhost:8000`.

---

### Автозапуск через NSSM (рекомендуется)

NSSM — утилита, которая превращает любую программу в Windows-службу.

1. Скачать NSSM с [nssm.cc](https://nssm.cc/download) и распаковать.  
   Поместить `nssm.exe` в `C:\clickvpn\nssm.exe` (или любую другую папку).

2. Открыть PowerShell от **администратора** и выполнить:

```powershell
C:\clickvpn\nssm.exe install clickvpn
```

Откроется окно настройки. Заполнить:

| Поле | Значение |
|------|----------|
| Path | `C:\clickvpn\site\backend\.venv\Scripts\uvicorn.exe` |
| Startup directory | `C:\clickvpn\site\backend` |
| Arguments | `main:app --host 0.0.0.0 --port 8000` |

3. Перейти на вкладку **Environment** и добавить все переменные из `.env` в формате `КЛЮЧ=ЗНАЧЕНИЕ`, каждая на новой строке.

4. Нажать **Install service**, затем запустить:

```powershell
C:\clickvpn\nssm.exe start clickvpn
```

Проверить статус:
```powershell
C:\clickvpn\nssm.exe status clickvpn
```

---

## Шаг 7 — Настроить обратный прокси (если нужен домен + HTTPS)

На Windows для этого удобно использовать **Caddy** — он автоматически получает SSL-сертификат.

1. Скачать Caddy с [caddyserver.com](https://caddyserver.com/download) (файл `caddy.exe`).  
   Поместить в `C:\clickvpn\caddy.exe`.

2. Создать файл `C:\clickvpn\Caddyfile` с содержимым:

```
ваш-домен.ru {
    reverse_proxy localhost:8000
}
```

3. Запустить Caddy (от администратора):

```powershell
cd C:\clickvpn
.\caddy.exe run
```

Или зарегистрировать Caddy как службу через тот же NSSM (Path = `caddy.exe`, Arguments = `run --config C:\clickvpn\Caddyfile`).

После этого сайт доступен по `https://ваш-домен.ru`.

---

## Обновление сайта

```powershell
# Пересобрать фронтенд
cd C:\clickvpn\site\frontend
npm run build

# Перезапустить бэкенд
C:\clickvpn\nssm.exe restart clickvpn
```

---

## Частые проблемы

**Сайт не открывается** — проверить, запущена ли служба:
```powershell
C:\clickvpn\nssm.exe status clickvpn
```

**`python` не найден** — переустановить Python с галочкой "Add to PATH", или попробовать `py` вместо `python`.

**`.venv\Scripts\activate` выдаёт ошибку "cannot be loaded"** — выполнить один раз:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**Письма не приходят** — убедитесь, что в `.env` заполнен `RESEND_API_KEY`. Без него режим разработки: ссылка для входа появляется прямо на странице авторизации.

**Платежи не работают** — проверить `PLATEGA_MERCHANT_ID` и `PLATEGA_SECRET` в `.env`.

**VPN-ключ не появляется** — проверить `REMNAWAVE_API_URL` и `REMNAWAVE_API_TOKEN`.
