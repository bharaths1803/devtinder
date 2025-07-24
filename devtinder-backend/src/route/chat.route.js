const { Router } = require("express");
const { fetchMessages } = require("../controller/chat.controller.js");
const { userAuth } = require("../middlewares/auth.middleware.js");

const router = Router();

router.get("/:toUserId", userAuth, fetchMessages);

module.exports = router;
