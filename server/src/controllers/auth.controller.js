const service = require("../services/auth.service");

async function login(req, res) {
    try {
        const token = await service.login(req.body.login, req.body.password);
        res.status(200).json({ token: token.token ,refresh_token: token.refresh_token });
    } catch(err) {
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
async function refresh(req, res) {
    try {
        const header = req.headers.authorization;
        if (!header) return res.sendStatus(401);

        const token = header.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const newToken = await service.refresh_service(token);

        res.status(200).json({ token: newToken });
    }
    catch(err) {
        res.sendStatus(400);
    }
}

module.exports = {login, register, user, refresh};