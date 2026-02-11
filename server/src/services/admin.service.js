repo = require("../repositories/admin.repo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { broadcast } = require("../utils/websocket/ws");
const { disconnectUser } = require("../utils/websocket/ws");
async function setAdminHash(password) {
    try{
        const hash = await bcrypt.hash(password, 12);
        await repo.saveHashPassword(hash);
        return password;
    }
    catch(e){
        throw e;
    }
}
async function getAdminHash(password) {
    try {
        const hash = await repo.getHashPass()
        if(!await bcrypt.compare(password, hash)){return false}
        return jwt.sign(
            { admin: hash},
            JWT_SECRET,
            { expiresIn: "1d" }
        )
    }
    catch(e){
        throw e;
    }
}
async function clearChat(){
    try{
        await repo.clearRedisChat()
        broadcast({ type: "clear" });
    }
    catch(e){
        throw e;
    }
}
async function kick_user(user){
    try{
        return disconnectUser(user);
    }
    catch(e){
        throw e;
    }
}

module.exports = {setAdminHash, getAdminHash, clearChat, kick_user};
