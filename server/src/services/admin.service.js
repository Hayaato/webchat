repo = require("../repositories/admin.repo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function setAdminHash(password) {
    try{
        const hash = await bcrypt.hash(password, 12);
        await repo.saveHashPassword(hash);
        return password;
    }
    catch(e){
        throw e;
    }
}
async function getAdminHash(password) {
    try {
        const hash = await repo.getHashPass()
        if(!await bcrypt.compare(password, hash)){return false}
        return jwt.sign(
            { admin: hash},
            JWT_SECRET,
            { expiresIn: "1d" }
        )
    }
    catch(e){
        throw e;
    }
}
module.exports = {setAdminHash, getAdminHash};
