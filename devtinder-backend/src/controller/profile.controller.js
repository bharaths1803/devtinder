const { validateEditProfileData } = require("../utils/validations");

const viewProfile = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const editProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error("Failed to update!");
    const user = req.user;

    Object.keys(req.body).forEach((k) => (user[k] = req.body[k]));

    const savedUser = await user.save();

    res.send({
      data: savedUser,
      message: `${user.firstName}, your profile updated successfully!`,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  viewProfile,
  editProfile,
};
