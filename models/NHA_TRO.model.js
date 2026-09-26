const db = require("../config/database");

module.exports.NHA_TRO = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS NHA_TRO (
  NT_ID INT AUTO_INCREMENT PRIMARY KEY,
  NT_TEN VARCHAR(255) NOT NULL, 
  NT_DIACHI VARCHAR(255) NOT NULL,
  NT_MOTA LONGTEXT,
  NT_ANH LONGTEXT,
  NT_NGAYTAO DATE,
  NT_TRANGTHAI VARCHAR(50) DEFAULT "active")
  `;
  try {
    await db.query(q);
    console.log("Tao bang NHA_TRO thanh cong");
  } catch (error) {
    console.log("Tao bang NHA_TRO that bai");
  }
};
