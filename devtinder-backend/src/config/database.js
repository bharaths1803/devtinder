const { default: mongoose } = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Successful connection to db");
};

module.exports = {
  connectDb,
};
