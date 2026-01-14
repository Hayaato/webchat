const service = require("../services/chat.service");

async function message(req, res){
    try{
        const user = req.user
        const text = req.body.text;
        const result = await service.message(user, text);
        res.json({user: result.user, text: result.text});
    }
    catch (e) {
        console.error("CONTROLLER ERROR:", e);
        res.status(400).json({ error: e.message });
    }

}

module.exports = {message};