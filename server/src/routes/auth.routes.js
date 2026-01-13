const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
console.log("AUTH ROUTES LOADED");
module.exports = router;