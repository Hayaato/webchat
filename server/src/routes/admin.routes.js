const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const auth = require("../middlewares/auth");
router.post('/login', ctrl.login)
router.get('/auth', auth , ctrl.auth)

module.exports = router;