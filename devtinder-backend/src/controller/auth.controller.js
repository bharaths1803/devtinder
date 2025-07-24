const userModel = require("../models/user.model.js");
const { validateSignupData } = require("../utils/validations");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const token = await savedUser.signJwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 1000 * 8),
    });

    res.json({
      message: "User added successfully!",
      data: savedUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await userModel.findOne({ emailId });
    if (!user) return res.status(404).send("User not found!");

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) return res.status(401).send("Invalid Credentials!");

    const token = await user.signJwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 1000 * 8),
    });

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully!");
};

module.exports = {
  signup,
  login,
  logout,
};
