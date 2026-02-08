const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
router.post('/auth', ctrl.login)

module.exports = router;