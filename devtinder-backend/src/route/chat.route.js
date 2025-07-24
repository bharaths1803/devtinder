const { Router } = require("express");
const { fetchMessages } = require("../controller/chat.controller.js");
const { userAuth } = require("../middlewares/auth.middleware.js");

console.log("✅ Loading chat.route.js");


const router = Router();

router.get("/dm", userAuth, fetchMessages);

module.exports = router;
