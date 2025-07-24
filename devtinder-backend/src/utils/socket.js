const socket = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../models/chat.model");

const getRoomId = (userId, toUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, toUserId].sort().join("$"))
    .digest("hex");
};

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
      const roomId = getRoomId(userId, toUserId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, toUserId, newMessage }) => {
        const roomId = getRoomId(userId, toUserId);

        let chat = await chatModel.findOne({
          participant: { $all: [userId, toUserId] },
        });

        if (!chat)
          chat = new chatModel({
            participant: [userId, toUserId],
            messages: [],
          });

        chat.messages.push({ senderId: userId, text: newMessage });

        await chat.save();

        io.to(roomId).emit("messageRecieved", {
          firstName,
          lastName,
          text: newMessage,
          fromUserId: userId,
        });
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initialiseSocket;
