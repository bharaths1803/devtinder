const { Router } = require("express");
const { createPayment } = require("../controller/payment.controller");
const { userAuth } = require("../middlewares/auth.middleware");

console.log("✅ Loading payment.route.js");

const router = Router();

router.post("/create", userAuth, createPayment);

module.exports = router;
