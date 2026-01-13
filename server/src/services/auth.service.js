const repo = require('../repositories/auth.repo');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

async function login(login, password) {
    const result = await repo.findByLogin(login);
    if (!result.rows.length) throw new Error();

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error();

    return jwt.sign({userId: user.id}, JWT_SECRET, { expiresIn: '7d' });
}
async function register(register, password) {
    console.log("Servc")
    const result = await repo.findByLogin(register);

    if(result.rows.length > 0) throw new Error();
    const hash = await bcrypt.hash(password, 12);
    await repo.createUser(login, hash);
    return true;
}
module.exports = {login, register};