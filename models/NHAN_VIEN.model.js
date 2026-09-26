const db = require("../config/database");

module.exports.NHAN_VIEN = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS NHAN_VIEN (
  NV_ID INT AUTO_INCREMENT PRIMARY KEY,
  NV_TEN VARCHAR(255) NOT NULL,
  NV_MATKHAU VARCHAR(255) NOT NULL,
  NV_TOKEN VARCHAR(255) UNIQUE,
  NV_CCCD VARCHAR(12) UNIQUE,
  NV_DIACHI LONGTEXT,
  NV_SDT VARCHAR(10) UNIQUE,
  NV_EMAIL VARCHAR(255) UNIQUE,
  NV_MASO_THUE VARCHAR(255),
  NV_ANH LONGTEXT,
  NV_TRANGTHAI VARCHAR(50) DEFAULT "active",
  NV_NGAYTAO DATE)
  `;
  try {
    await db.query(q);
    console.log("Tao ban NHAN_VIEN thanh cong");
  } catch (error) {
    console.log("Tao bang NHAN_VIEN that bai");
  }
};
