const mongoose = require("mongoose");
const generaOtp = require("../helper/generalOTP.helper");
const otpSchema = new mongoose.Schema({
  email: String,
  code: {
    type: String,
    default: () => generaOtp.generateOtpCode(6),
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

const OTP = mongoose.model("OTP", otpSchema, "OTP");
module.exports = OTP;
