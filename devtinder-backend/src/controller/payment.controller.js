const paymentModel = require("../models/payment.model.js");
const userModel = require("../models/user.model.js");
const { membershipAmount } = require("../utils/constants.js");
const razorpayInstance = require("../utils/razorpay.js");
const { validateWebhookSignature } = require("razorpay");

const createPayment = async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const { membershipType } = req.body;
    var options = {
      amount: membershipAmount[membershipType] * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName,
        lastName,
        membershipType,
        emailId,
      },
    };
    const order = await razorpayInstance.orders.create(options);

    const payment = new paymentModel({
      userId: req.user._id,
      orderId: order.id,
      notes: order.notes,
      currency: order.currency,
      amount: order.amount,
      status: order.status,
      receipt: order.receipt,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const validateWebhook = async (req, res) => {
  try {
    console.log("REached beginnign of validate webhook");

    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("REached beginnign of validate webhook 2");

    const isValidWebhook = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    console.log("REached beginnign of validate webhook 3");

    if (!isValidWebhook)
      return res.status(400).json({ msg: "Invalid webhook signature" });

    console.log("REached beginnign of validate webhook 4");

    const paymentDetails = req.body.payload.payment.entity;

    console.log("REached beginnign of validate webhook 5");

    const payment = await paymentModel.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    console.log("REached beginnign of validate webhook 6");

    const user = await userModel.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    console.log("REached beginnign of validate webhook 7");

    await user.save();

    console.log("REached end of validate webhook");

    res.status(200).json({ msg: "Webhook valiated successfully" });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const verifyPremium = async (req, res) => {
  const user = req.user.toJSON();
  console.log("User", user);
  if (user.isPremium) return res.json({ ...user });
  else return res.json({ ...user });
};

module.exports = { createPayment, validateWebhook, verifyPremium };
