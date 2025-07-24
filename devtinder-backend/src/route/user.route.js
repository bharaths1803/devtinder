const express = require("express");
const {
  getRequestsReceived,
  getConnections,
  getUsersFeed,
} = require("../controller/user.controller.js");
const { userAuth } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/connections", userAuth, getConnections);
router.get("/requests/received", userAuth, getRequestsReceived);
router.get("/feed", userAuth, getUsersFeed);

module.exports = router;
