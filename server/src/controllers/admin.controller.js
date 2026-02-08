const service = require("../services/admin.service");

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
module.exports = {setAdminPassword, login, auth};