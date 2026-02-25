const redisClient = require("../database/redis");

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
        const message = {user: user, text: text, color: color, id: id};

        await redisClient.rPush("room:chat", JSON.stringify(message));
        return true;
    }
    catch{
        return false;
    }
}
async function getData() {
    return await redisClient.lRange('room:chat', 0, -1);
}
module.exports = {addMessage, getData, getColor, saveColor};