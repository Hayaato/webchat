const authModal = document.getElementById("auth-modal");
const chatBox = document.getElementById("chat-box");

const authTitle = document.getElementById("auth-title");
const authBtn = document.getElementById("auth-btn");
const switchAuth = document.getElementById("switch-auth");

let mode = "login";

// можешь заменить потом на реальный backend
async function apiLogin(login, pass) {
    return true;
}
async function apiRegister(login, pass) {
    const result = await fetch("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, pass })
    });
    return result.status === 200;
}
async function apiLogout() {
    return true;
}

switchAuth.onclick = () => {
    if (mode === "login") {
        mode = "register";
        authTitle.textContent = "Create Account";
        authBtn.textContent = "Register";
        switchAuth.textContent = "Back to login";
    } else {
        mode = "login";
        authTitle.textContent = "Login";
        authBtn.textContent = "Login";
        switchAuth.textContent = "Create account";
    }
};

authBtn.onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    if (!email || !pass) return;

    if (mode === "login") {
        await apiLogin(email, pass);
    } else {
        const result = await apiRegister(email, pass);
        if(result) {
            mode = "login";
            authTitle.textContent = "Login";
            authBtn.textContent = "Login";
            switchAuth.textContent = "Create account";
        }
    }

    authModal.classList.add("hidden");
    chatBox.classList.remove("hidden");
    connectSocket();
};

document.getElementById("logout-btn").onclick = async () => {
    await apiLogout();
    chatBox.classList.add("hidden");
    authModal.classList.remove("hidden");
    socket?.close();
};

// ==== CHAT ====

const chatMessages = document.getElementById("chat-messages");
let socket;

function connectSocket() {
    socket = new WebSocket("ws://localhost:3000/ws");
    socket.onmessage = e => {
        const msg = JSON.parse(e.data);
        appendMsg(msg.user + ": " + msg.text);
    };
}

function appendMsg(text) {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById("msg-send").onclick = () => {
    const input = document.getElementById("msg-input");
    if (!input.value.trim()) return;
    socket.send(JSON.stringify({ text: input.value }));
    input.value = "";
};
