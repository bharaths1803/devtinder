const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (
    !firstName ||
    !lastName ||
    firstName.length < 3 ||
    firstName.length > 50 ||
    lastName.length < 3 ||
    lastName.length > 50
  ) {
    throw new Error("Invalid Firstname or Lastname");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Inavlid email");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isValidEditProfileData = Object.keys(req.body).every((val) =>
    allowedEditFields.includes(val)
  );

  return isValidEditProfileData;
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
};
