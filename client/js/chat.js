const messagesBox = document.getElementById("messages");
const socket = new WebSocket(
    (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

let token = sessionStorage.getItem("token");
const refresh_token = sessionStorage.getItem("refresh_token");
const span = document.getElementById("chat-title");

let messages = [];
const MAX_MESSAGES = 100;

if (!token && !refresh_token) {
    window.location.href = "index.html";
}

getUser(token);

async function getUser(token) {
    const result = await fetch("/auth/user", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (result.status === 401) {
        await refresh();
        return;
    }

    if (result.ok) {
        const data = await result.json();
        span.textContent = `Мини-чат — Пользователь: ${data}`;
    }
}

function createMessage(msg) {
    const div = document.createElement("div");
    div.className = "message";
    div.dataset.id = msg.id;

    const user = document.createElement("span");
    user.className = "user-name";
    user.textContent = msg.user + ": ";
    user.style.color = msg.color;

    const text = document.createElement("span");
    text.textContent = msg.text;

    div.appendChild(user);
    div.appendChild(text);

    if (sessionStorage.getItem("admin:token")) {
        const btn = document.createElement("button");
        btn.textContent = "Удалить";
        btn.className = "delete-btn";

        btn.onclick = async () => {
            const res = await fetch("/admin/delete_msg", {
                method: "PUT",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("admin:token")
                },
                body: JSON.stringify({ id: msg.id })
            });

            if (res.ok) {
                removeMessage(msg.id);
            }
        };

        div.appendChild(btn);
    }

    return div;
}

function addMessage(msg) {
    const el = createMessage(msg);

    messages.push(msg);
    messagesBox.appendChild(el);

    if (messages.length > MAX_MESSAGES) {
        messages.shift();

        const first = messagesBox.firstChild;
        if (first) messagesBox.removeChild(first);
    }

    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function removeMessage(id) {
    messages = messages.filter(m => m.id !== id);

    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) el.remove();
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
            messages = msg.data.slice(-MAX_MESSAGES);

            messagesBox.innerHTML = "";

            messages.forEach(m => {
                messagesBox.appendChild(createMessage(m));
            });

            messagesBox.scrollTop = messagesBox.scrollHeight;
            break;

        case "message":
            addMessage(msg);
            break;

        case "clear":
            messages = [];
            messagesBox.innerHTML = "";
            break;

        case "deleteMessage":
            removeMessage(msg.id);
            break;

        case "disconnect":
            logout();
            break;
    }
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (!text) return;

    socket.send(JSON.stringify({
        token: token,
        text: text
    }));

    input.value = "";
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

async function refresh() {
    const response = await fetch("/auth/refresh", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + refresh_token
        }
    });

    if (response.status === 401) {
        logout();
        return;
    }

    const data = await response.json();

    sessionStorage.setItem("token", data.token);
    token = data.token;

    await getUser(token);

    socket.send(JSON.stringify({
        type: "get_messages",
        token: token
    }));
}