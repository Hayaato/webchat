const redisClient = require("../database/redis");

async function addMessage(user, text) {
    try {
        const message = {user: user, text: text};

        await redisClient.rPush("chat", JSON.stringify(message));
        return true;
    }
    catch{
        return false;
    }
}
async function getData() {
    const messages = await redisClient.lRange('chat', 0, -1);
    console.log(messages);
    return messages;
}
module.exports = {addMessage, getData};