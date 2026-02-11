async function toggleAdmin() {
    const adminPanel = document.getElementById('adminPanel');
    const adminAuth = document.getElementById('adminAuth');

    if (!adminPanel.classList.contains('hidden')) {
        adminPanel.classList.add('hidden');
        return;
    }

    const token = sessionStorage.getItem('admin:token');
    if (token) {
        const response = await fetch("/admin/auth", {
            method: "GET",
            cache: "no-store",
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            adminAuth.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            return;
        }

        sessionStorage.removeItem('admin:token');
    }

    adminAuth.classList.remove('hidden');
}

function closeAdminAuth() {
    document.getElementById('adminAuth').classList.add('hidden');
}

async function openAdmin() {
    const password = document.getElementById("password").value.trim();
    if (!password) return;

    const res = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem("admin:token", token);
        document.getElementById('adminAuth').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
    }
}
async function kick_user(){
    const token = sessionStorage.getItem('admin:token');
    const user = document.getElementById('inputField').value.trim();
    if (!user) {
        alert('Введите пользователя!')
        return
    }
    const res = await fetch(`/admin/kick/${encodeURIComponent(user)}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
    })
    switch (res.status){
        case 200:
            alert("Пользователь успешно кикнут!")
            break;
        case 401:
            alert("Вы не авторизированы!")
            break;
        case 400:
            alert("Введите корректного пользователя!")
            break;
        default:
            alert("Неизвестаня ошибка!")
            break;
    }
}
async function clearChat(){
    const token = sessionStorage.getItem('admin:token');
    const res = await fetch("/admin/clear", {
        method: "DELETE",
        cache: "no-store",
        headers: { Authorization: "Bearer " + token},
    })
    switch (res.status){
        case 200:
            alert("Чат очищен")
            break;
        case 401:
            alert("Вы не авторизированы!")
            break;
        default:
            alert("Неизвестаня ошибка!")
            break;
    }
}