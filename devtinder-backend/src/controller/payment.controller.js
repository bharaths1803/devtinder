const paymentModel = require("../models/payment.model.js");
const { membershipAmount } = require("../utils/constants.js");
const razorpayInstance = require("../utils/razorpay.js");

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

module.exports = { createPayment };
