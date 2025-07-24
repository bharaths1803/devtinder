const { Router } = require("express");
const { createPayment } = require("../controller/payment.controller");
const { userAuth } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/create", userAuth, createPayment);

module.exports = router;
