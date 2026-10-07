const mongoose = require("mongoose");
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("connect success");
  } catch (error) {
    console.log(error);
    console.log("connect error");
  }
};
