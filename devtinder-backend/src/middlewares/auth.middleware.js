const { verify } = require("jsonwebtoken");
const userModel = require("../models/user.model");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Unauthorised!");

    const decoded = await verify(
      token,
      "ldLSRrtC1bVgr/2/1rDZP4Q1GPWiyvaXJNHB8ZQc3hc="
    );
    const { _id } = decoded;

    const user = await userModel.findById(_id);
    if (!user) res.status(404).send("User not found!");

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
