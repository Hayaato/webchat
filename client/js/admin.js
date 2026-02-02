function toggleAdmin() {
    document.getElementById('adminAuth').classList.remove('hidden');
}

function closeAdminAuth() {
    document.getElementById('adminAuth').classList.add('hidden');
}

function openAdmin() {
    document.getElementById('adminAuth').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
}
