const auth = document.getElementById('auth')
const chat = document.getElementById('chat')
const loginBtn = document.getElementById('loginBtn')
const usernameInput = document.getElementById('username')
const chatUser = document.getElementById('chatUser')
const messages = document.getElementById('messages')
const messageInput = document.getElementById('messageInput')
const sendBtn = document.getElementById('sendBtn')

let username = ''

loginBtn.onclick = () => {
    const value = usernameInput.value.trim()
    if (!value) return
    username = value
    auth.classList.add('hidden')
    chat.classList.remove('hidden')
    chatUser.textContent = `Вы вошли как ${username}`
}

sendBtn.onclick = sendMessage
messageInput.onkeydown = e => {
    if (e.key === 'Enter') sendMessage()
}

function sendMessage() {
    const text = messageInput.value.trim()
    if (!text) return

    const div = document.createElement('div')
    div.className = 'message'
    div.innerHTML = `<span>${username}</span><br>${text}`

    messages.appendChild(div)
    messages.scrollTop = messages.scrollHeight
    messageInput.value = ''
}
