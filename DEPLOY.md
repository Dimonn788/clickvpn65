# Инструкция по запуску ClickVPN

## Что понадобится на сервере

- Ubuntu 22.04 или новее
- Python 3.11+
- Node.js 20+
- 512 МБ RAM минимум

---

## Шаг 1 — Установка зависимостей на сервер

```bash
# Обновить пакеты
sudo apt update && sudo apt upgrade -y

# Установить Python
sudo apt install -y python3.11 python3.11-venv python3-pip

# Установить Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
```

Проверить версии:
```bash
python3 --version   # должно быть 3.11+
node --version      # должно быть 20+
```

---

## Шаг 2 — Загрузить проект на сервер

Скопировать папку `site/` на сервер любым удобным способом (FTP, scp, git).
Допустим, она окажется по пути `/home/user/site`.

---

## Шаг 3 — Собрать фронтенд

Это нужно сделать **один раз** (и повторять при каждом обновлении сайта).

```bash
cd /home/user/site/frontend
npm install
npm run build
```

После этого в папке `backend/static/` появятся файлы сайта. Сама папка `frontend/` больше не нужна.

---

## Шаг 4 — Установить зависимости бэкенда

```bash
cd /home/user/site/backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Шаг 5 — Создать файл с настройками

Создать файл `/home/user/site/backend/.env` со следующим содержимым:

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

```bash
cd /home/user/site/backend
source .venv/bin/activate
source .env  # если хотите загрузить переменные вручную, или см. ниже
```

Либо запустить с переменными сразу:

```bash
cd /home/user/site/backend
export $(cat .env | grep -v '#' | xargs)
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

Сайт будет доступен на `http://IP-сервера:8000`.

---

### Автозапуск через systemd (рекомендуется)

Создать файл сервиса:

```bash
sudo nano /etc/systemd/system/clickvpn.service
```

Вставить:

```ini
[Unit]
Description=ClickVPN Backend
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=/home/user/site/backend
EnvironmentFile=/home/user/site/backend/.env
ExecStart=/home/user/site/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

> Заменить `user` на имя вашего пользователя на сервере.

Активировать:

```bash
sudo systemctl daemon-reload
sudo systemctl enable clickvpn
sudo systemctl start clickvpn
```

Проверить статус:
```bash
sudo systemctl status clickvpn
```

---

## Шаг 7 — Настроить Nginx (если нужен домен + HTTPS)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Создать конфиг:
```bash
sudo nano /etc/nginx/sites-available/clickvpn
```

Вставить:
```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Включить и получить SSL:
```bash
sudo ln -s /etc/nginx/sites-available/clickvpn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d ваш-домен.ru
```

После этого сайт доступен по `https://ваш-домен.ru`.

---

## Обновление сайта

Когда нужно обновить код:

```bash
# Пересобрать фронтенд
cd /home/user/site/frontend
npm run build

# Перезапустить бэкенд
sudo systemctl restart clickvpn
```

---

## Частые проблемы

**Сайт не открывается** — проверить, запущен ли сервис:
```bash
sudo systemctl status clickvpn
sudo journalctl -u clickvpn -n 50
```

**Письма не приходят** — убедитесь, что в `.env` заполнен `RESEND_API_KEY`. Без него режим разработки: ссылка для входа появляется прямо на странице авторизации.

**Платежи не работают** — проверить `PLATEGA_MERCHANT_ID` и `PLATEGA_SECRET` в `.env`.

**VPN-ключ не появляется** — проверить `REMNAWAVE_API_URL` и `REMNAWAVE_API_TOKEN`.
