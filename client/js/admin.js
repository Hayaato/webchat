function toggleAdmin() {
    document.getElementById('adminAuth').classList.remove('hidden');
}

function closeAdminAuth() {
    document.getElementById('adminAuth').classList.add('hidden');
}

async function openAdmin() {
    const password = document.getElementById("password").value.trim();
    if (!password){
        closeAdminAuth();
    }
    const res = await fetch("/admin/auth", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({password})
    })
    if(res.status === 200){
        document.getElementById('adminAuth').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
    }
    else{
        closeAdminAuth()
    }
}
