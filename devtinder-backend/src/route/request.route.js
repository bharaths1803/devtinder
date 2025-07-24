const express = require("express");
const {
  sendRequest,
  reviewRequest,
} = require("../controller/request.controller");
const { userAuth } = require("../middlewares/auth.middleware");

console.log("✅ Loading request.route.js");


const router = express.Router();

router.post("/send", userAuth, sendRequest);
router.post("/review", userAuth, reviewRequest);

module.exports = router;
