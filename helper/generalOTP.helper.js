module.exports.generateOtpCode = (length) => {
  const characters = "0123456789";
  let results = "";
  for (let i = 0; i < length; i++)
    results += characters.charAt(Math.floor(Math.random() * characters.length));
  return results;
};
