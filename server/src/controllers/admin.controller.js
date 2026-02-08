const service = require("../services/admin.service");

async function setAdminPassword(password) {
    try {
        return await service.setAdminHash(password);
    }
    catch (error) {
        throw error;
    }
}
async function login(req, res) {
    try{
        console.log(req.body.password);
        if(await service.getAdminHash(req.body.password)){
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (error) {
        throw error;
    }
}

module.exports = {setAdminPassword, login};