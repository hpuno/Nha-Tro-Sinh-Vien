const db = require("../config/database");

module.exports.LOAI_PHONG = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS LOAI_PHONG (
  LP_ID INT AUTO_INCREMENT PRIMARY KEY,
  LP_TEN VARCHAR(255) NOT NULL,
  LP_MOTA LONGTEXT,
  LP_TRANGTHAI VARCHAR(50) DEFAULT "active")
  `;
  try {
    await db.query(q);
    console.log("Tao bang LOAI_PHONG thanh cong");
  } catch (error) {
    console.log("Tao bang LOAI_PHONG that bai");
  }
};
