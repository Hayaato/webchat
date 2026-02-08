repo = require("../repositories/admin.repo")
const bcrypt = require("bcrypt")

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
        return await bcrypt.compare(password, hash)
    }
    catch(e){
        throw e;
    }
}
module.exports = {setAdminHash, getAdminHash};
