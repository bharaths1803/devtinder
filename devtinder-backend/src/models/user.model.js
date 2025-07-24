const { sign } = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(val) {
        if (!validator.isEmail(val))
          throw new Error("Invalid email address: " + val);
      },
    },
    password: {
      type: String,
      required: true,
      validate(val) {
        if (!validator.isStrongPassword(val))
          throw new Error("Enter a strong password: " + val);
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://i.pinimg.com/originals/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.webp",
      validate(val) {
        if (!validator.isURL(val)) throw new Error("Invalid URL: " + val);
      },
    },
    about: {
      type: String,
      default: "Hi, I'm a dev looking for another dev.",
    },
  },
  { timestamps: true }
);

userSchema.methods.signJwt = async function () {
  const user = this;
  const token = await sign(
    { _id: user._id },
    "ldLSRrtC1bVgr/2/1rDZP4Q1GPWiyvaXJNHB8ZQc3hc=",
    {
      expiresIn: "7d",
    }
  );
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  return isCorrectPassword;
};

module.exports = mongoose.model("User", userSchema);
