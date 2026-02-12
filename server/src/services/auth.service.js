const repo = require('../repositories/auth.repo');
const chatRepo = require("../repositories/chat.repo");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const color = require('../utils/color');
const JWT_SECRET = process.env.JWT_SECRET
const set = require("../utils/blacklist");

async function login(login, password) {
    const result = await repo.findByLogin(login);
    if (!result.rows.length) throw new Error();

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error();
    if(set.Blacklist.has(login)) return false;
    const userColor = await chatRepo.getColor(user.login)
    if (!userColor){
        await chatRepo.saveColor(user.login, color.randomHexColor())
    }
    return {token: jwt.sign(
        { login: user.login},
        JWT_SECRET,
        { expiresIn: "1d" }
    ),
        refresh_token:jwt.sign(
            {refresh: user.login,
            type: "refresh"},
            JWT_SECRET,
            { expiresIn: "7d" }
        )
    };
}
async function register(login, password) {
    const result = await repo.findByLogin(login);
    if(result.rows.length > 0) throw new Error("User already exists");

    const hash = await bcrypt.hash(password, 12);

    await repo.createUser(login, hash);
    return true;
}
async function refresh_service(refreshToken) {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    if (decoded.type !== "refresh") {
        throw new Error("Refresh token is not valid");
    }
    return jwt.sign(
        {login: decoded.refresh},
        JWT_SECRET,
        {expiresIn: "1d"}
    )
}

module.exports = {login, register, refresh_service};