const service = require("../services/admin.service");
const set = require("../utils/blacklist");

async function setAdminPassword(password) {
    try {
        return await service.setAdminHash(password);
    }
    catch (error) {
        throw error;
    }
}
async function login(req, res) {
    try{
        const token = await service.getAdminHash(req.body.password)
        if(!token){return res.sendStatus(401)}
        else{return res.status(200).json({token});}
    }
    catch (error) {
        res.sendStatus(500);
        throw error;
    }
}
async function auth(req, res) {
    try {
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
    }
}
async function clear(req, res) {
    try {
        await service.clearChat()
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
async function kick(req, res) {
    try{
        const user = decodeURIComponent(req.params.user);
        if(await service.kick_user(user)){res.sendStatus(200);}
        else{res.sendStatus(400);}
    }
    catch (error) {
        res.sendStatus(500);
    }
}
async function ban(req, res) {
    try {
        console.log(req.body)
        const duration = Number(req.body.duration);
        const user = req.body.user;
        if(set.Blacklist.has(user)){res.sendStatus(403);return}
        if(await service.ban_user(user, duration)){res.sendStatus(200);return}
        res.sendStatus(400)
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports = {setAdminPassword, login, auth, clear, kick, ban};