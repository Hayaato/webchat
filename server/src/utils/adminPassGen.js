const ctrl = require("../controllers/admin.controller.js")

async function password(generic) {
    const AdminPass = Math.random().toString(36).slice(2, 2 + generic)
    await ctrl.setAdminPassword(AdminPass)
    console.log("Admin: " + AdminPass)
}
module.exports = {password};