require("dotenv").config();
require("./utils/node-cron.js");
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const cors = require("cors");
const { connectDb } = require("./config/database");

const authRouter = require("./route/auth.route.js");
const profileRouter = require("./route/profile.route.js");
const requestRouter = require("./route/request.route.js");
const userRouter = require("./route/user.route.js");
const chatRouter = require("./route/chat.route.js");
const paymentRouter = require("./route/payment.route.js");

const initialiseSocket = require("./utils/socket.js");

const app = express();

const server = http.createServer(app);
initialiseSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/payment", paymentRouter);

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join((__dirname, "../devtinder-ui/dist"))));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../devtinder-ui", "dist", "index.html"));
  });
}


connectDb()
  .then(() => {
    server.listen(7777, () => {
      console.log("Listneing on port 7777");
    });
  })
  .catch((err) => console.log("Error connecting db", err));
