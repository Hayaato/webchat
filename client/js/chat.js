const messagesBox = document.getElementById("messages");
const socket = new WebSocket("ws://localhost:3000");
const token = sessionStorage.getItem("token");
const span = document.getElementById("chat-title");
if (!token) { window.location.href = "index.html"; }
getUser(token)
let messages = [];

async function getUser(token){
    const result = await fetch("/auth/user", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    const data = await result.json();
    span.textContent = `Мини-чат — Пользователь: ${data}`;
}

socket.addEventListener("open", () => {
    socket.send(JSON.stringify({
        type: "get_messages",
        token: token
    }));

});

socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
        case "get_messages":
            messages = msg.data;
            renderMessages(messages);
            break;
        case "message":
            messages.push(msg);
            renderMessages(messages);
            break;
        case 'clear':
            messages = [];
            document.getElementById('messages').innerHTML = '';
            break;
    }
});

// Функция для отображения сообщений
function renderMessages(msgArray) {
    messagesBox.innerHTML = "";
    msgArray.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message";
        div.innerHTML = `<span class="user-name">${msg.user}:</span> ${msg.text}`;
        div.querySelector(".user-name").style.color = msg.color;
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


function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin:token");
    window.location.href = "index.html";
}

