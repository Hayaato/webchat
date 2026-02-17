const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const set = require('../utils/blacklist')
function auth(req, res, next){
    try{
        const header = req.headers.authorization;
        if (!header) return res.sendStatus(401);
        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        req.user = decoded.login;
        if(set.Blacklist.has(req.user)) return res.sendStatus(401);
        next();
    }
    catch{
        return res.sendStatus(401)
    }
}

module.exports = auth;