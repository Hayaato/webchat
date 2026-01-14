const repo = require("../repositories/chat.repo");
const {getMessage} = require("../repositories/chat.repo");

async function message(user, text) {
    const messageObj = { user, text};
    const ok = await repo.addMessage(user, text);
    if (!ok) throw new Error("Could not add a message");
    return messageObj;
}
function randomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
module.exports = {message};