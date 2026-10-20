const db = require("../config/database");

module.exports.NHAN_VIEN = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS NHAN_VIEN (
  NV_ID INT AUTO_INCREMENT PRIMARY KEY,
  NV_TEN VARCHAR(255) NOT NULL,
  NV_keycloak VARCHAR(255) UNIQUE,
  NV_CCCD VARCHAR(12),
  NV_PHAI VARCHAR(50),
  NV_DIACHI LONGTEXT,
  NV_SDT VARCHAR(10),
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

module.exports.UPDATE = async (NV_ID, data) => {
  data.NV_SDT = data.NV_SDT || null;
  data.NV_CCCD = data.NV_CCCD || null;

  let q = `
  UPDATE NHAN_VIEN
  SET NV_TEN=?, NV_SDT=?, NV_PHAI=?, NV_EMAIL=?, NV_CCCD=?, NV_TRANGTHAI=?, NV_DIACHI=?, NV_ANH=?, NV_MASO_THUE=?
  WHERE NV_ID=?`;
  try {
    await db.query(q, [
      data.NV_TEN,
      data.NV_SDT,
      data.NV_PHAI,
      data.NV_EMAIL,
      data.NV_CCCD,
      data.NV_TRANGTHAI,
      data.NV_DIACHI,
      data.NV_ANH,
      data.NV_MASO_THUE,
      NV_ID,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.findDuplication = async (arr, data) => {
  const allowed = ["NV_EMAIL", "NV_SDT", "NV_CCCD"];
  if (allowed.includes(arr)) {
    let q = `SELECT * FROM NHAN_VIEN WHERE ${arr}=?`;
    try {
      const [row] = await db.query(q, [data]);
      return row;
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else throw new Error("Tên cột không hợp lệ");
};

module.exports.INSERT = async (data) => {
  let q = `
  INSERT INTO NHAN_VIEN(
    NV_TEN,
    NV_keycloak,
    NV_CCCD,
    NV_PHAI,
    NV_DIACHI,
    NV_SDT,
    NV_EMAIL,
    NV_MASO_THUE,
    NV_ANH,
    NV_TRANGTHAI,
    NV_NGAYTAO)
  VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
  try {
    await db.query(q, [
      data.NV_TEN,
      data.NV_keycloak,
      data.NV_CCCD,
      data.NV_PHAI,
      data.NV_DIACHI,
      data.NV_SDT,
      data.NV_EMAIL,
      data.NV_MASO_THUE,
      data.NV_ANH,
      data.NV_TRANGTHAI,
      data.NV_NGAYTAO,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT = async (find, pagination) => {
  const params = [];
  const conditions = [];

  let q = `
  SELECT DISTINCT NHAN_VIEN.NV_ID, NV_TEN, NV_SDT, NV_TRANGTHAI, NV_ANH, CV_TEN FROM NHAN_VIEN
  LEFT JOIN PHAN_CONG ON PHAN_CONG.NV_ID = NHAN_VIEN.NV_ID
  LEFT JOIN CHUC_VU ON PHAN_CONG.CV_ID = CHUC_VU.CV_ID`;

  if (find.search) {
    conditions.push("NV_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("NV_TRANGTHAI = ?");
    params.push(find.status);
  }
  if (conditions.length > 0) q += "\nWHERE " + conditions.join(" AND ");

  q += `
    ORDER BY NV_ID DESC
    LIMIT ?
    OFFSET ?`;

  params.push(pagination.limit, pagination.offset);

  try {
    const data = await db.query(q, params);
    return data[0];
  } catch (error) {
    throw error;
  }
};

module.exports.COUNT = async (find) => {
  const params = [];
  const conditions = [];

  let q = `
  SELECT COUNT(*)
  FROM NHAN_VIEN`;

  if (find.search) {
    conditions.push(`NV_TEN LIKE ?`);
    params.push(`%${find.search}%`);
  }

  if (find.status) {
    conditions.push(`NV_TRANGTHAI = ?`);
    params.push(find.status);
  }

  if (conditions.length > 0) {
    q += ` WHERE ${conditions.join(" AND ")}`;
  }

  try {
    const [result] = await db.query(q, params);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.findID = async (id) => {
  let q = `
  SELECT * FROM NHAN_VIEN
  WHERE NV_ID = ?`;
  try {
    const [data] = await db.query(q, [id]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.CHANGE_STATUS = async (id, status) => {
  let q = `
  UPDATE NHAN_VIEN
  SET NV_TRANGTHAI = ?
  WHERE NV_ID = ?
  `;

  try {
    await db.query(q, [status, id]);
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE = async (id) => {
  let q = `
  DELETE FROM NHAN_VIEN
  WHERE NV_ID = ?
  `;
  try {
    await db.query(q, [id]);
  } catch (error) {
    throw error;
  }
};

module.exports.findDuplicationUpdate = async (arr, data, NV_ID) => {
  const allowed = ["NV_EMAIL", "NV_SDT", "NV_CCCD"];
  if (allowed.includes(arr)) {
    let q = `SELECT * FROM NHAN_VIEN WHERE ${arr}=? AND NV_ID != ?`;
    try {
      const [row] = await db.query(q, [data, NV_ID]);
      return row;
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else throw new Error("Tên cột không hợp lệ");
};

module.exports.SELECT_EXPORT_FILE = async (find) => {
  const params = [];
  const conditions = [];

  let q = `SELECT * FROM NHAN_VIEN`;

  if (find.search) {
    conditions.push("NV_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("NV_TRANGTHAI = ?");
    params.push(find.status);
  }
  if (conditions.length > 0) q += "\nWHERE " + conditions.join(" AND ");

  try {
    const [data] = await db.query(q, params);
    return data;
  } catch (error) {
    throw error;
  }
};
