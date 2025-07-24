const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware");
const {
  viewProfile,
  editProfile,
} = require("../controller/profile.controller");

console.log("✅ Loading profile.route.js");

const router = express.Router();

router.get("/view", userAuth, viewProfile);
router.patch("/edit", userAuth, editProfile);

module.exports = router;
