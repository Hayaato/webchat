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
