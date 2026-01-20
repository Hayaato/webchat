const service = require("../services/auth.service");

async function login(req, res) {
    try {
        const token = await service.login(req.body.login, req.body.password);
        res.status(200).json({ token: token });
    } catch {
        res.sendStatus(400);
    }
}

async function register(req, res) {
    try {
        const result = await service.register(req.body.login, req.body.password);
        if(result){
            res.sendStatus(200)
        }
        else{
            res.sendStatus(400);
        }
    } catch (e) {
        res.sendStatus(400);
    }
}

function user(req, res) {
    res.json(req.user)
}

module.exports = {login, register, user};