import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { toUserId } = useParams();
  const user = useSelector((state) => state.user);
  const userId = user._id;
  const firstName = user.firstName;
  const lastName = user.lastName;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName,
      lastName,
      userId,
      toUserId,
      newMessage,
    });
    setNewMessage("");
  };

  const fetchMessages = async () => {
    const res = await axios.get(BASE_URL + "/chat/" + toUserId, {
      withCredentials: true,
    });
    const chatMessages = res.data.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
        fromUserId: senderId?._id,
      };
    });

    setMessages(chatMessages);
  };

  useEffect(() => {
    if (!userId || !firstName) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName, userId, toUserId });

    socket.on(
      "messageRecieved",
      ({ firstName, lastName, text, fromUserId }) => {
        setMessages((messages) => [
          ...messages,
          { firstName, lastName, text, fromUserId },
        ]);
      }
    );
    return () => socket.disconnect();
  }, [userId, toUserId]);

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="h-[70vh] border border-gray-600 my-5 flex flex-col mx-2">
      <h1 className="p-5 border-b border-gray-600 text-center text-2xl">
        Chat
      </h1>
      <div className="p-5 flex-1 overflow-auto">
        {messages.map((message, idx) => (
          <div
            className={`chat ${
              message.fromUserId === userId ? "chat-end" : "chat-start"
            }`}
            key={idx}
          >
            <div className="chat-header">
              {message.firstName + " " + message.lastName}
            </div>
            <div className="chat-bubble">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2 max-w-full">
        <input
          type="text"
          className="border border-gray-500 text-white p-2 rounded flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
