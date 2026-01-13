const service = require("../services/auth.service");
const router = require("../routes/auth.routes");

async function login(req, res) {
    try {
        console.log("Contr")
        const token = await service.login(req.body.login, req.body.password);
        res.status(200).json({token: token})
    } catch {
        res.status(400);
    }
}

async function register(req, res) {
    try {
        const result = await service.register(req.body.login, req.body.password);
        if(result){
            res.status(200)
        }
        else{
            res.status(400);
        }
    } catch (e) {
        res.status(400);
    }

}
module.exports = {login, register};