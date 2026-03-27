const service = require("../services/chat.service");

async function message(text, user){
    try{
        const result = await service.message(user, text);
        return ({user: result.user, text: result.text, color: result.color, id: result.id});
    }
    catch (e) {
        console.error("CONTROLLER ERROR:", e);
        return { error: e.message };
    }

}
async function getData(){
    try {
        return  messages = await service.getData();
    }
    catch (e) {
        console.error("CONTROLLER ERROR:", e);
        return { error: e.message };
    }
}

module.exports = {message, getData};