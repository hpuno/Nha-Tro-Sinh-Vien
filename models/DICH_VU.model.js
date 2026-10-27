const db = require("../config/database");

module.exports.DICH_VU = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS DICH_VU (
    DV_ID INT AUTO_INCREMENT PRIMARY KEY,
    DV_TEN VARCHAR(255) NOT NULL,
    DV_GIA INT CHECK(DV_GIA > 0) NOT NULL,
    DV_MOTA LONGTEXT,
    DV_NGAYTAO DATE,
    DV_DVT VARCHAR(50) NOT NULL,
    DV_TRANGTHAI VARCHAR(255) DEFAULT 'active')`;
  try {
    await db.query(q);
    console.log("Tao bang DICH_VU thanh cong");
  } catch (error) {
    console.log("Tao bang DICH_VU that bai");
  }
};

module.exports.INSERT = async (data) => {
  data.DV_GIA = parseInt(data.DV_GIA.replaceAll(",", ""));
  data.DV_MOTA = data.DV_MOTA ? data.DV_MOTA.trim() : null;

  let q = `
  INSERT INTO
  DICH_VU (
    DV_TEN,
    DV_GIA,
    DV_MOTA,
    DV_NGAYTAO,
    DV_DVT,
    DV_TRANGTHAI)
    VALUES (?,?,?,?,?,?)`;

  try {
    await db.query(q, [
      data.DV_TEN,
      data.DV_GIA,
      data.DV_MOTA,
      data.DV_NGAYTAO,
      data.DV_DVT,
      data.DV_TRANGTHAI,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT = async () => {
  let q = "SELECT * FROM DICH_VU";

  try {
    const [data] = await db.query(q);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.UPDATE = async (id, data) => {
  data.DV_GIA = parseInt(data.DV_GIA.replaceAll(",", ""));
  data.DV_MOTA = data.DV_MOTA ? data.DV_MOTA.trim() : null;

  let q = `
  UPDATE DICH_VU
  SET DV_TEN = ?, DV_GIA = ?, DV_MOTA = ?, DV_DVT = ?, DV_TRANGTHAI = ?
  WHERE DV_ID = ?`;

  try {
    await db.query(q, [
      data.DV_TEN,
      data.DV_GIA,
      data.DV_MOTA,
      data.DV_DVT,
      data.DV_TRANGTHAI,
      id,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE = async (id) => {
  let q = `
  DELETE FROM DICH_VU
  WHERE DV_ID = ?`;

  try {
    await db.query(q, [id]);
  } catch (error) {
    throw error;
  }
};

module.exports.FindById = async (key, value) => {
  let q = `
  SELECT * FROM DICH_VU
  WHERE ${key} = ?`;

  try {
    const [data] = await db.query(q, [value]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.CHANGE_STATUS = async (id, status) => {
  let q = `
  UPDATE DICH_VU
  SET DV_TRANGTHAI = ?
  WHERE DV_ID = ?`;

  try {
    await db.query(q, [status, id]);
  } catch (error) {
    throw error;
  }
};
