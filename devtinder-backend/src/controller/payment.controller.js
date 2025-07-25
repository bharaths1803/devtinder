const paymentModel = require("../models/payment.model.js");
const userModel = require("../models/user.model.js");
const { membershipAmount } = require("../utils/constants.js");
const razorpayInstance = require("../utils/razorpay.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

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
    const isValidWebhook = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isValidWebhook)
      return res.status(400).json({ msg: "Invalid webhook signature" });

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await paymentModel.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await userModel.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    await user.save();

    console.log("REached end of validate webhook");

    res.status(200).json({ msg: "Webhook valiated successfully" });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports = { createPayment, validateWebhook };
