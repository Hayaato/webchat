const repo = require("../repositories/chat.repo");

async function message(user, text) {
    const color = await repo.getColor(user);
    const messageObj = {user, text, color};
    const ok = await repo.addMessage(user, text, color);
    if (!ok) throw new Error("Could not add a message");
    return messageObj;
}
async function getData(user) {
    const messages = await repo.getData();
    return messages.map(msg => JSON.parse(msg));
}
module.exports = {message, getData};