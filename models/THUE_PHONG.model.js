const db = require("../config/database");

module.exports.THUE_PHONG = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS THUE_PHONG (
  TP_ID INT AUTO_INCREMENT PRIMARY KEY,
  TP_DATCOC INT CHECK(TP_DATCOC > 0), 
  TP_GIA INT NOT NULL CHECK(TP_GIA > 0),
  TP_GIADIEN INT NOT NULL CHECK(TP_GIADIEN > 0),
  TP_GIANUOC INT NOT NULL CHECK(TP_GIANUOC > 0),
  TP_GIARAC INT NOT NULL CHECK(TP_GIARAC > 0),

  TP_NGAYTHUE DATE,
  TP_NGAY_KETTHUC DATE,
  TP_TRANGTHAI VARCHAR(255) DEFAULT "confirm",

  NV_ID INT,
  KT_ID INT NOT NULL,
  P_ID INT NOT NULL,

  CONSTRAINT TP_TP FOREIGN KEY (KT_ID) REFERENCES KHACH_THUE(KT_ID),
  CONSTRAINT TP_NV FOREIGN KEY (NV_ID) REFERENCES NHAN_VIEN(NV_ID),
  CONSTRAINT TP_PHONG FOREIGN KEY (P_ID) REFERENCES PHONG(P_ID))`;
  try {
    await db.query(q);
    console.log("Tao bang THUE_PHONG thanh cong");
  } catch (error) {
    console.log(error);
    console.log("Tao bang THUE_PHONG that bai");
  }
};

module.exports.INSERT = async (data, KT_ID, P_ID) => {
  let q = `
  INSERT INTO 
  THUE_PHONG (TP_NGAYTHUE, TP_NGAY_KETTHUC, KT_ID, P_ID, TP_GIADIEN, TP_GIANUOC, TP_GIARAC, TP_GIA)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    await db.query(q, [
      data.TP_NGAYTHUE,
      data.TP_NGAY_KETTHUC,
      KT_ID,
      P_ID,
      data.TP_GIADIEN,
      data.TP_GIANUOC,
      data.TP_GIARAC,
      data.TP_GIA,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.findByID = async (key, value) => {
  let q = `
  SELECT * FROM THUE_PHONG
  WHERE ${key} = ?`;
  try {
    const [data] = await db.query(q, [value]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_RENTAL = async (key) => {
  let q = `SELECT ${key} FROM THUE_PHONG`;
  try {
    const [data] = await db.query(q);
    return data;
  } catch (error) {
    throw error;
  }
};
