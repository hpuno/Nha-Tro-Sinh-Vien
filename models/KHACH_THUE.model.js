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
  data.KT_SDT = data.KT_SDT || null;
  data.KT_CCCD = data.KT_CCCD || null;

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

module.exports.SELECT = async (find, pagination) => {
  const params = [];
  const conditions = [];

  let q = `SELECT * FROM KHACH_THUE`;

  if (find.search) {
    conditions.push("KT_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("KT_TRANGTHAI = ?");
    params.push(find.status);
  }
  if (conditions.length > 0) q += "\nWHERE " + conditions.join(" AND ");

  q += `
    ORDER BY KT_ID DESC
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

module.exports.CHANGE_STATUS = async (id, status) => {
  let q = `
  UPDATE KHACH_THUE
  SET KT_TRANGTHAI = ?
  WHERE KT_ID = ?
  `;

  try {
    await db.query(q, [status, id]);
  } catch (error) {
    throw error;
  }
};

module.exports.findByID = async (id) => {
  let q = `
  SELECT * FROM KHACH_THUE
  WHERE KT_ID = ?
  `;
  try {
    const data = await db.query(q, [id]);
    return data[0];
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE_USER = async (id) => {
  let q = `
  DELETE FROM KHACH_THUE
  WHERE KT_ID = ?
  `;
  try {
    db.query(q, [id]);
  } catch (error) {
    throw error;
  }
};

module.exports.COUNT = async (find) => {
  const params = [];
  const conditions = [];

  let q = `
  SELECT COUNT(*)
  FROM KHACH_THUE`;

  if (find.search) {
    conditions.push(`KT_TEN LIKE ?`);
    params.push(`%${find.search}%`);
  }

  if (find.status) {
    conditions.push(`KT_TRANGTHAI = ?`);
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

module.exports.INSERT_ADMIN = async (data) => {
  let q = `
  INSERT INTO KHACH_THUE(
    KT_TEN,
    KT_PHAI,
    KT_KEYCOAK,
    KT_SDT,
    KT_CCCD,
    KT_DIACHI,
    KT_EMAIL,
    KT_TRANGTHAI,
    KT_ANH,
    KT_NGAYTAO)
  VALUES(? , ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.query(q, [
      data.KT_TEN,
      data.KT_PHAI,
      data.KT_KEYCOAK,
      data.KT_SDT,
      data.KT_CCCD,
      data.KT_DIACHI,
      data.KT_EMAIL,
      data.KT_TRANGTHAI,
      data.KT_ANH,
      data.KT_NGAYTAO,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_EXPORT_FILE = async (find) => {
  const params = [];
  const conditions = [];

  let q = `SELECT * FROM KHACH_THUE`;

  if (find.search) {
    conditions.push("KT_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("KT_TRANGTHAI = ?");
    params.push(find.status);
  }
  if (conditions.length > 0) q += "\nWHERE " + conditions.join(" AND ");

  try {
    const data = await db.query(q, params);
    return data[0];
  } catch (error) {
    throw error;
  }
};
