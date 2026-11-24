# Kessya Date

Одностраничное приглашение на свидание с отправкой ответов в Telegram через Vercel Functions.

## Файлы
- `index.html` — страницы и структура сайта
- `style.css` — оформление
- `script.js` — выборы, анимация и отправка ответов
- `api/submit.js` — безопасная серверная отправка в Telegram

## Развёртывание
1. Загрузите содержимое архива в корень GitHub-репозитория.
2. Импортируйте репозиторий в Vercel.
3. В Vercel → Settings → Environment Variables добавьте:
   - `TELEGRAM_BOT_TOKEN` — токен от BotFather
   - `TELEGRAM_CHAT_ID` — ваш Telegram ID
4. Нажмите Redeploy после добавления переменных.
5. Откройте Telegram-бота и нажмите Start, иначе бот не сможет написать вам первым.

## Изменить предложения «Сам решай»
Откройте `script.js` и отредактируйте объект `proposals` в начале файла.

## Важно
Не помещайте токен Telegram в HTML, JavaScript или GitHub. Он должен храниться только в переменных окружения Vercel.
