const { Router } = require("express");
const { signup, login, logout } = require("../controller/auth.controller.js");


console.log("✅ Loading auth.route.js");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
