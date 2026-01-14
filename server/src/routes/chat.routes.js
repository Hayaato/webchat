const router = require("express").Router();
const ctrl = require("../controllers/chat.controller");
const auth = require("../middlewares/auth");

router.post("/message", auth ,ctrl.message);

module.exports = router;