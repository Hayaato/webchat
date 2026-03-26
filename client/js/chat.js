const messagesBox = document.getElementById("messages");
const socket = new WebSocket(
    (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);
let token = sessionStorage.getItem("token");
const refresh_token = sessionStorage.getItem("refresh_token");
const span = document.getElementById("chat-title");
if (!token && !refresh_token) {window.location.href = "index.html";}
getUser(token);
let messages = [];

async function getUser(token){
    const result = await fetch("/auth/user", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    switch(result.status) {
        case 401:
            await refresh()
            break;
        case 400:
            console.log("Error")
            break;
        default:
            const data = await result.json();
            span.textContent = `Мини-чат — Пользователь: ${data}`;
            break;
    }
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
            messagesBox.innerHTML = '';
            break;
        case 'disconnect':
            logout();
            break;
        case 'deleteMessage':
            const msgId = msg.id;
            messages = messages.filter(m => m.id !== msgId);
            renderMessages(messages);
            break;
    }
});

// Функция для отображения сообщений
function renderMessages(msgArray) {
    messagesBox.innerHTML = "";
    msgArray.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message";
        div.id = `${msg.id}`;
        div.innerHTML = `<span class="user-name">${msg.user}:</span> ${msg.text}`;
        div.querySelector(".user-name").style.color = msg.color;

        if (sessionStorage.getItem("admin:token")) {
            if (!div.querySelector(".delete-btn")) {
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Удалить";
                deleteBtn.className = "delete-btn";
                deleteBtn.onclick = async () => {
                    const res = await fetch("/admin/delete_msg", {
                        method: "PUT",
                        cache: "no-store",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + sessionStorage.getItem("admin:token")
                        },
                        body: JSON.stringify({ id: div.id })
                    });
                    if (res.status === 200) {
                        div.remove();
                    }
                };
                div.appendChild(deleteBtn);
            }
        }

        messagesBox.appendChild(div);
    });
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (!text) return;
    const msg = { token: token, text: text };
    socket.send(JSON.stringify(msg));
    input.value = "";
}


function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("admin:token");
    window.location.href = "index.html";
}

async function refresh(){
    const response = await fetch('/auth/refresh', {
        method: "GET",
        headers: { "Authorization": "Bearer " + refresh_token }
    })
    if(response.status === 401){logout();return}
    const data = await response.json();
    sessionStorage.setItem("token", data.token);
    token = data.token;
    await getUser(token);
    socket.send(JSON.stringify({
        type: "get_messages",
        token: token
    }));
}