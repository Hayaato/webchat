const messagesBox = document.getElementById("messages");
const socket = new WebSocket("ws://localhost:3000");
const token = sessionStorage.getItem("token");
if (!token) { window.location.href = "index.html"; }

let messages = [];

socket.addEventListener("open", () => {
    console.log("WebSocket подключен");
});

socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    messages.push(msg);
    renderMessages(messages);
});

// Функция для отображения сообщений
function renderMessages(msgArray) {
    messagesBox.innerHTML = "";
    msgArray.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message";
        div.innerHTML = `<span>${msg.user}:</span> ${msg.text}`;
        messagesBox.appendChild(div);
    });
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Отправка сообщения
function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (!text) return;
    const msg = { token: token,text: text };
    socket.send(JSON.stringify(msg));
    input.value = "";
}

// Логаут
function logout() {
    window.location.href = "index.html";
}
