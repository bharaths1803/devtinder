const chatModel = require("../models/chat.model");

const fetchMessages = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const userId = req.user._id;
    let chat = await chatModel
      .findOne({
        participant: { $all: [userId, toUserId] },
      })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });

    if (!chat)
      chat = new chatModel({
        participant: [userId, toUserId],
        messages: [],
      });

    res.json(chat);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

module.exports = { fetchMessages };
