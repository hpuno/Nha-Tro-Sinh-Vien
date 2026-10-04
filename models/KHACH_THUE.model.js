const db = require("../config/database");

module.exports.KHACH_THUE = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS KHACH_THUE (
  KT_ID INT AUTO_INCREMENT PRIMARY KEY,
  KT_TEN VARCHAR(255) NOT NULL,
  KT_PHAI VARCHAR(50),
  KT_KEYCOAK VARCHAR(255) UNIQUE,
  KT_SDT VARCHAR(10) UNIQUE,
  KT_CCCD VARCHAR(12) UNIQUE,
  KT_DIACHI VARCHAR(255), 
  KT_EMAIL VARCHAR(255) UNIQUE,
  KT_TRANGTHAI VARCHAR(50) DEFAULT "active",
  KT_ANH LONGTEXT,
  KT_NGAYTAO DATE
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
  INSERT INTO KHACH_THUE(KT_TEN, KT_EMAIL, KT_KEYCOAK, KT_NGAYTAO) VALUES(?, ?, ?, ?)`;
  try {
    await db.query(q, [
      data.KT_TEN,
      data.KT_EMAIL,
      data.KT_KEYCOAK,
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

module.exports.findDuplicationUpdate = async (arr, data, KT_ID) => {
  const allowed = ["KT_EMAIL", "KT_SDT", "KT_CCCD"];
  if (allowed.includes(arr)) {
    let q = `SELECT * FROM KHACH_THUE WHERE ${arr}=? AND KT_ID != ?`;
    try {
      const row = await db.query(q, [data, KT_ID]);
      return row[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else throw new Error("Tên cột không hợp lệ");
};

module.exports.SELECT_KT = async (key, value) => {
  let q = `
  SELECT * FROM KHACH_THUE
  WHERE ${key} = ?
  `;
  try {
    const row = await db.query(q, [value]);
    return row[0];
  } catch (error) {
    throw error;
  }
};

module.exports.UPDATE = async (KT_ID, data) => {
  let q = `
  UPDATE KHACH_THUE
  SET KT_TEN=?, KT_SDT=?, KT_PHAI=?, KT_EMAIL=?, KT_CCCD=?, KT_TRANGTHAI=?, KT_DIACHI=?, KT_ANH=?
  WHERE KT_ID=?`;
  try {
    await db.query(q, [
      data.KT_TEN,
      data.KT_SDT,
      data.KT_PHAI,
      data.KT_EMAIL,
      data.KT_CCCD,
      data.KT_TRANGTHAI,
      data.KT_DIACHI,
      data.KT_ANH,
      KT_ID,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT = async () => {
  let q = `SELECT * FROM KHACH_THUE`;
  try {
    const data = await db.query(q);
    return data[0];
  } catch (error) {
    throw error;
  }
};
