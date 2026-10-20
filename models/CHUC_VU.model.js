const db = require("../config/database");

module.exports.CHUC_VU = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS CHUC_VU (
  CV_ID INT AUTO_INCREMENT PRIMARY KEY,
  CV_TEN VARCHAR(255) NOT NULL,
  CV_LEVEL INT NOT NULL,
  CV_MOTA LONGTEXT,
  CV_TRANGTHAI VARCHAR(50) DEFAULT 'active',
  CV_NGAYTAO DATE
  )
  `;
  try {
    await db.query(q);
    console.log("Tao bang CHUC_VU thanh cong");
  } catch (error) {
    console.log("Tao bang CHUC_VU that bai");
  }
};

module.exports.INSERT = async (data) => {
  data.CV_MOTA = data.CV_MOTA || null;

  let q = `
  INSERT INTO CHUC_VU(CV_TEN, CV_LEVEL, CV_MOTA, CV_TRANGTHAI, CV_NGAYTAO)
  VALUES (?, ?, ?, ?, ?)`;

  try {
    await db.query(q, [
      data.CV_TEN,
      data.CV_LEVEL,
      data.CV_MOTA,
      data.CV_TRANGTHAI,
      data.CV_NGAYTAO,
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.UPDATE = async (CV_ID, data) => {
  data.CV_MOTA = data.CV_MOTA || null;

  let q = `
  UPDATE CHUC_VU
  SET CV_TEN=?, CV_MOTA=?, CV_TRANGTHAI=?
  WHERE CV_ID=?`;
  try {
    await db.query(q, [data.CV_TEN, data.CV_MOTA, data.CV_TRANGTHAI, CV_ID]);
  } catch (error) {
    throw error;
  }
};

module.exports.COUNT_LEVEL = async () => {
  let q = "SELECT COUNT(*) FROM CHUC_VU";
  try {
    const [data] = await db.query(q);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT = async () => {
  let q = `SELECT * FROM CHUC_VU`;
  try {
    const [data] = await db.query(q);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.FindByID = async (id) => {
  let q = `
  SELECT * FROM CHUC_VU
  WHERE CV_ID = ?`;
  try {
    const [data] = await db.query(q, [id]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_ACTIVE = async () => {
  let q = `
  SELECT * FROM CHUC_VU
  WHERE CV_TRANGTHAI = "active"`;
  try {
    const [data] = await db.query(q);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE = async (id) => {
  let q = `
  DELETE FROM CHUC_VU
  WHERE CV_ID = ?`;
  try {
    await db.query(q, [id]);
  } catch (error) {
    throw error;
  }
};
