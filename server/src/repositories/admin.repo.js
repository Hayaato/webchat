const redisClient = require("../database/redis");

async function saveHashPassword(hash){
    try{
        await redisClient.hSet(`room:admin`,'admin' , hash);
    }
    catch(err){
        return err
    }
}
async function getHashPass(){
    try{
        return await redisClient.hGet(`room:admin`,'admin');
    }
    catch(err){
        return err
    }
}

async function clearRedisChat(){
    try {
        await redisClient.del('room:chat')
    }
    catch(err){
        return err
    }
}

async function deleteMessageById(msgId) {
    const list = await redisClient.lRange('room:chat', 0, -1);

    for (const item of list) {
        const msg = JSON.parse(item);
        if (msg.id === msgId) {
            await redisClient.lRem('room:chat', 1, item);
            return true;
        }
    }
    return false;
}
module.exports = {saveHashPassword, getHashPass, clearRedisChat, deleteMessageById};