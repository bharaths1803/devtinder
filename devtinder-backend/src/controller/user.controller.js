const connectionModel = require("../models/connection.model");
const userModel = require("../models/user.model");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const getConnections = async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await connectionModel
      .find({
        $or: [
          { fromUserId: user._id, status: "accepted" },
          { toUserId: user._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((req) => {
      if (req.fromUserId._id.toString() === user._id.toString())
        return req.toUserId;
      else return req.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const getRequestsReceived = async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await connectionModel
      .find({ toUserId: user._id, status: "interested" })
      .populate("fromUserId", USER_SAFE_DATA);

    res.json({ data: connectionRequests });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const getUsersFeed = async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await connectionModel
      .find({
        $or: [{ fromUserId: user._id }, { toUserId: user._id }],
      })
      .select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    let { page = 1, limit = 10 } = req.query;
    limit = Math.min(10, limit);
    const skip = (page - 1) * limit;

    const users = await userModel
      .find({
        $and: [
          { _id: { $ne: user._id } },
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
        ],
      })
      .select(USER_SAFE_DATA)
      .limit(limit)
      .skip(skip);

    res.json({ data: users });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = { getConnections, getRequestsReceived, getUsersFeed };
