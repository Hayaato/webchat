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
module.exports = {addMessage}