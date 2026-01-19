const messagesBox = document.getElementById("messages");
const socket = new WebSocket("ws://localhost:3000");
const token = sessionStorage.getItem("token");
if (!token) { window.location.href = "index.html"; }

let messages = [];

socket.addEventListener("open", () => {
    socket.send(JSON.stringify({
        type: "get_messages",
        token: token
    }));

});

socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    console.log(msg);
    if (msg.type === "get_messages") {
        messages = msg.data;

        renderMessages(messages);
        return;
    }
    messages.push(msg);
    renderMessages(messages);
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

// Логаут
function logout() {
    window.location.href = "index.html";
}
