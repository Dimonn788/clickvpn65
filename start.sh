#!/bin/bash

SITE_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON="/home/dimon/Загрузки/lovable-project-62923c4d/oldsite/forallall-main/.venv/bin/python3"
NODE_BIN="$HOME/.nvm/versions/node/v20.20.2/bin"

# --- Бэкенд ---
echo "Запускаю бэкенд на http://localhost:8000 ..."
cd "$SITE_DIR/backend"
SESSION_SECRET="${SESSION_SECRET:-dev-local-secret-key}" \
CORS_ALLOW_ORIGINS="http://localhost:8080" \
"$PYTHON" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# --- Фронтенд ---
echo "Запускаю фронтенд на http://localhost:8080 ..."
cd "$SITE_DIR/frontend"
export PATH="$NODE_BIN:$PATH"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Сайт: http://localhost:8080"
echo "API:  http://localhost:8000"
echo ""
echo "Для остановки нажми Ctrl+C"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
