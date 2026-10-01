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

module.exports.INSERT = async (data) => {
  let q = `
  INSERT INTO KHACH_THUE(KT_TEN, KT_EMAIL, KT_MATKHAU, KT_TOKEN, KT_NGAYTAO) VALUES(?, ?, ?, ?, ?)`;
  try {
    await db.query(q, [
      data.KT_TEN,
      data.KT_EMAIL,
      data.KT_MATKHAU,
      data.KT_TOKEN,
      data.KT_NGAYTAO,
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.findDuplication = async (arr, data) => {
  const allowed = ["KT_EMAIL", "KT_SDT", "KT_CCCD"];
  if (allowed.includes(arr)) {
    let q = `SELECT * FROM KHACH_THUE WHERE ${arr}=?`;
    try {
      const row = await db.query(q, [data]);
      return row[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else throw new Error("Tên cột không hợp lệ");
};
