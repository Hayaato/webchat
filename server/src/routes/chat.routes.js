const router = require("express").Router();
const ctrl = require("../controllers/chat.controller");
const auth = require("../middlewares/auth");

router.post("/message", auth ,ctrl.message);
router.post("/getData", auth, ctrl.getData)

module.exports = router;