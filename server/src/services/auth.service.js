const chatRepo = require("../repositories/chat.repo");
const jwt = require("jsonwebtoken");
const color = require('../utils/color');
const JWT_SECRET = process.env.JWT_SECRET
const set = require("../utils/blacklist");
const auth = require("../utils/grpc/authClient")

async function login(login, password) {
    try {
        if (set.Blacklist.has(login)) return false;
        const result = await auth.login(login, password);

        const userColor = await chatRepo.getColor(login)
        if (!userColor) {
            await chatRepo.saveColor(login, color.randomHexColor())
        }
        return result;
    }
    catch(err) {
        if (err.code === 16) {}
        throw new Error("500: Сдох бэкенд на Go");
    }
}
async function register(login, password) {
    try
    {
        const result = await auth.register(login, password);
        return result.status === 200;
    }
    catch (err){
        throw err;
    }
}
async function refresh_service(refreshToken) {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    if (decoded.type !== "refresh") {
        throw new Error("Refresh token is not valid");
    }
    return jwt.sign(
        {login: decoded.refresh},
        JWT_SECRET,
        {expiresIn: "15m"}
    )
}

module.exports = {login, register, refresh_service};