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
module.exports = {saveHashPassword, getHashPass}