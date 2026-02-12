const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const auth = require("../middlewares/auth");
router.post('/login', ctrl.login)
router.get('/auth', auth , ctrl.auth)
router.delete('/clear', auth, ctrl.clear)
router.delete('/kick/:user', auth, ctrl.kick)
router.post('/ban', auth, ctrl.ban)

module.exports = router;