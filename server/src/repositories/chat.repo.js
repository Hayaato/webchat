const redisClient = require("../database/redis");
const MAX_MSG = require("../../server");
async function saveColor(user, color){
    try{
        await redisClient.hSet(`room:color`, user, color);
    }
    catch(err){
        throw err;
    }
}

async function getColor(user){
    try {
        return await redisClient.hGet(`room:color`, user);
    }
    catch(err){
        throw err;
    }
}

async function addMessage(user, text, color, id) {
    try {
        const MAX_MSG = 100

        const message = {user: user, text: text, color: color, id: id};
        await redisClient.multi()
            .rPush("room:chat", JSON.stringify(message))
            .lTrim("room:chat", -MAX_MSG, -1)
            .exec();
        return true;
    }
    catch (err) {
        console.error("REDIS ERROR:", err);
        return false;
    }
}
async function getData() {
    return await redisClient.lRange('room:chat', 0, -1);
}
module.exports = {addMessage, getData, getColor, saveColor};