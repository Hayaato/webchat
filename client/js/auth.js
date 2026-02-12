async function register() {
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");
    error.textContent = "";
    if (!login && !password) {
        error.textContent = "Все поля должны быть заполнены!";
        return;
    }
    const result = await fetch("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({login, password}),
    });
    switch (result.status) {
        case 200:
            window.location.href = "index.html";
            break;
        case 400:
            error.textContent = "Логин уже занят, попробуйте другой!";
            break;
        default:
            error.textContent = "Неизвестная ошибка, попробуйте позже!";
    }
}

async function login() {
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");
    if (!login && !password) {
        error.textContent = "Все поля должны быть заполнены!";
        return;
    }
    error.textContent = "";

    const result = await fetch("/auth/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({login, password}),
    })
    switch (result.status) {
        case 200:
            const data = await result.json();
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("refresh_token", data.refresh_token);
            window.location.href = "chat.html";
            break;
        case 400:
            error.textContent = "Введите корректные данные!"
            break;
        case 401:
            error.textContent = "Вы забанены, попробуйте позже!"
            break;
        default:
            error.textContent = "Неизвестная ошибка, попробуйте позже!"
    }
}
