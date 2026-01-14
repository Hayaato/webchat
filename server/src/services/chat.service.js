const repo = require("../repositories/chat.repo");
const {getMessage} = require("../repositories/chat.repo");

async function message(user, text) {
    const messageObj = { user, text };
    const ok = await repo.addMessage(user, text);
    if (!ok) throw new Error("Could not add a message");
    return messageObj;
}
module.exports = {message};