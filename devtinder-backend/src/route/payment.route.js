const { Router } = require("express");
const {
  createPayment,
  validateWebhook,
  verifyPremium,
} = require("../controller/payment.controller");
const { userAuth } = require("../middlewares/auth.middleware");

console.log("✅ Loading payment.route.js");

const router = Router();

router.post("/create", userAuth, createPayment);
router.post("/webhook", validateWebhook);
router.get("/verify", userAuth, verifyPremium);

module.exports = router;
