const repo = require("../repositories/chat.repo");
const uuid = require("../utils/msgIdGenerator");
async function message(user, text) {
    const color = await repo.getColor(user);
    const id = uuid.generateId()
    const messageObj = {user, text, color, id};
    const ok = await repo.addMessage(user, text, color, id);
    if (!ok) throw new Error("Could not add a message");
    return messageObj;
}
async function getData() {
    const messages = await repo.getData();
    return messages.map(msg => JSON.parse(msg));
}
module.exports = {message, getData};