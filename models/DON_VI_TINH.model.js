const db = require("../config/database");

module.exports.DON_VI_TINH = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS DON_VI_TINH (
    DVT_ID INT AUTO_INCREMENT PRIMARY KEY,
    DVT_TEN VARCHAR(255) NOT NULL
    )
    `;
  try {
    await db.query(q);
    console.log("Tao bang DON_VI_TINH thanh cong");
  } catch (error) {
    console.log("Tao bang DON_VI_TINH that bai");
  }
};
