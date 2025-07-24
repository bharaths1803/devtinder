const connectionModel = require("../models/connection.model");
const userModel = require("../models/user.model");
const { sendEmail } = require("../utils/email");

const sendRequest = async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const allowedRequestStatuses = ["ignored", "interested"];
    if (!allowedRequestStatuses.includes(status))
      throw new Error("Invalid status type: " + status);

    const fromUserId = req.user._id;

    const existingConnectionRequest = await connectionModel.findOne({
      fromUserId,
      toUserId,
    });

    if (existingConnectionRequest)
      throw new Error("Can not make connection request twice");

    const toUser = await userModel.findById(toUserId);
    if (!toUser) return res.status(404).send("User not found!");

    const request = new connectionModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await request.save();

    if (status === "interested")
      await sendEmail({
        to: toUser.emailId,
        subject: "A new friend request from " + req.user.firstName,
        html: `<h1>${req.user.firstName} is interested in ${toUser.firstName}</h1>`,
      });

    res.json({
      data,
      message: `${req.user.firstName} ${
        status === "interested" ? "is interested in " : "ignored"
      } ${toUser.firstName}`,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const reviewRequest = async (req, res) => {
  try {
    const { status, requestId } = req.params;

    const allowedRequestStatuses = ["accepted", "rejected"];
    if (!allowedRequestStatuses.includes(status))
      throw new Error("Invalid status type: " + status);
    const connectionRequest = await connectionModel.findOne({
      _id: requestId,
      status: "interested",
    });
    if (!connectionRequest)
      return res.status(404).send("Connection not found!");
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({ message: "Connection request: " + status, data });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  sendRequest,
  reviewRequest,
};
