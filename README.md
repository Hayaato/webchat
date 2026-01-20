# WebChat — Real‑Time Web Chat Application

WebChat — это простой, но структурированный веб‑чат с авторизацией, WebSocket'ами и разделённой архитектурой клиент/сервер. Клиент написан на ванильных HTML/CSS/JS, сервер на Node.js + Express + Redis + WS.

---

## 🚀 Возможности

* Регистрация и авторизация
* JWT токены
* WebSocket чат в реальном времени
* Разделение на страницы (index, register, chat)
* Redis для хранения активных соединений
* MVC + Repository + Service архитектура
* Лёгкий старт, просто расширять

---

## 📂 Структура проекта

```
webchat/
 ├── client/
 │   ├── css/
 │   ├── js/
 │   ├── chat.html
 │   ├── index.html
 │   └── register.html
 ├── server/
 │   ├── src/
 │   │   ├── config/
 │   │   ├── controllers/
 │   │   ├── database/
 │   │   ├── middlewares/
 │   │   ├── repositories/
 │   │   ├── routes/
 │   │   ├── services/
 │   │   └── utils/
 │   ├── .env
 │   └── server.js
 ├── .gitignore
 ├── package.json
 └── README.md
```

---

## 🧱 Технологии

* Node.js
* Express
* Redis
* WebSocket (ws)
* JWT
* MVC + Repository + Service
* Vanilla JS (client)

---

## 🔧 Установка и запуск

### 1. Клонировать

```sh
git clone https://github.com/user/webchat.git
cd webchat
```

### 2. Настроить `server/.env`

```
PORT=3000
JWT_SECRET=example_secret
REDIS_URL=redis://localhost:6379
```

### 3. Установить зависимости

```sh
cd server
npm install
```

### 4. Запуск сервера

```sh
npm start
```

### 5. Запуск клиента

Открыть в браузере:

```
client/index.html
```

---

## 🌐 Логика работы

1. Пользователь логинится → получает JWT
2. Клиент открывает WebSocket
3. Сервер хранит подключения в Redis
4. Сообщения рассылаются всем онлайн

---

## 📎 Возможные улучшения

* Docker
* История сообщений (DB)
* WebRTC
* Шифрование
* Refresh tokens
* Deploy
* UI прокачка

---

# 🌍 English Version

## WebChat — Real‑Time Web Chat Application

WebChat is a structured real‑time chat app with authentication, WebSockets and clean client/server separation.

---

## 🚀 Features

* Auth + registration
* JWT token authentication
* Real-time messaging with WebSockets
* Clean vanilla HTML/JS client
* Redis tracking active sessions
* MVC + Repository + Service
* Easy to extend

---

## 📂 Project Structure

```
client/   ← frontend
server/   ← backend
```

---

## 🔧 Installation

### Clone

```sh
git clone https://github.com/user/webchat.git
cd webchat
```

### ENV

```
PORT=3000
JWT_SECRET=example_secret
REDIS_URL=redis://localhost:6379
```

### Install dependencies

```sh
cd server
npm install
```

### Run backend

```sh
npm start
```

### Open client

```
client/index.html
```

---

## 🌐 How it works

1. Login → JWT
2. Client opens WebSocket
3. Server manages sockets via Redis
4. Broadcast messages to all

---

## 📎 Improvements

* Docker support
* DB for history
* WebRTC
* Encryption
* Refresh tokens
* Deployment
* UI improvements

---

## 📜 License

MIT
