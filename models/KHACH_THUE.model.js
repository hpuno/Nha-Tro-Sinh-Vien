const db = require("../config/database");

module.exports.KHACH_THUE = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS KHACH_THUE (
  KT_ID INT AUTO_INCREMENT PRIMARY KEY,
  KT_TEN VARCHAR(255) NOT NULL,
  KT_PHAI VARCHAR(50),
  KT_MATKHAU VARCHAR(255) NOT NULL,
  KT_TOKEN VARCHAR(255) UNIQUE,
  KT_SDT VARCHAR(10) UNIQUE,
  KT_CCCD VARCHAR(12) UNIQUE,
  KT_DIACHI VARCHAR(255), 
  KT_EMAIL VARCHAR(255) UNIQUE,
  KT_TRANGTHAI VARCHAR(50) DEFAULT "active",
  KT_ANH LONGTEXT,
  KT_NGAYTAO DATE,
  KT_OTP VARCHAR(6)
  )
  `;
  try {
    await db.query(q);
    console.log("Tao bang KHACH_THUE thanh cong");
  } catch (error) {
    console.log("Tao bang KHACH_THUE that bai");
  }
};
