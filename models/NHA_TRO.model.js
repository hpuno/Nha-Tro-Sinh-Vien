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

module.exports.INSERT = async (data) => {
  let q = `
  INSERT INTO NHA_TRO(
    NT_TEN, 
    NT_DIACHI, 
    NT_MOTA, 
    NT_ANH, 
    NT_NGAYTAO, 
    NT_TRANGTHAI)
  VALUES(?, ?, ?, ?, ?, ?)`;

  try {
    await db.query(q, [
      data.NT_TEN,
      data.NT_DIACHI,
      data.NT_MOTA,
      data.NT_ANH,
      data.NT_NGAYTAO,
      data.NT_TRANGTHAI,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT = async (find, pagination) => {
  const params = [];
  const conditions = [];

  let q = `SELECT * FROM NHA_TRO`;

  if (find.search) {
    conditions.push("NT_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("NT_TRANGTHAI = ?");
    params.push(find.status);
  }
  if (conditions.length > 0) q += "\nWHERE " + conditions.join(" AND ");

  q += `
    ORDER BY NT_ID DESC
    LIMIT ?
    OFFSET ?`;

  params.push(pagination.limit, pagination.offset);

  try {
    const [data] = await db.query(q, params);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_ACTIVE = async () => {
  let q = `
  SELECT * FROM NHA_TRO
  WHERE NT_TRANGTHAI = "active"`;
  try {
    const [data] = await db.query(q);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.CHANGE_STATUS = async (id, status) => {
  let q = `
  UPDATE NHA_TRO
  SET NT_TRANGTHAI = ?
  WHERE NT_ID = ?
  `;

  try {
    await db.query(q, [status, id]);
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE = async (id) => {
  let q = `
  DELETE FROM NHA_TRO
  WHERE NT_ID = ?`;

  try {
    await db.query(q, [id]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_ONE = async (id) => {
  let q = `
  SELECT * FROM NHA_TRO
  WHERE NT_ID = ?`;

  try {
    const [data] = await db.query(q, [id]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.UPDATE = async (id, data) => {
  let q = `
  UPDATE NHA_TRO
  SET NT_TEN=?, NT_DIACHI = ?, NT_MOTA=?, NT_ANH=?, NT_TRANGTHAI=?
  WHERE NT_ID=?`;

  try {
    await db.query(q, [
      data.NT_TEN,
      data.NT_DIACHI,
      data.NT_MOTA,
      data.NT_ANH,
      data.NT_TRANGTHAI,
      id,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.COUNT = async (find) => {
  const params = [];
  const conditions = [];

  let q = `
  SELECT COUNT(*)
  FROM NHA_TRO`;

  if (find.search) {
    conditions.push(`NT_TEN LIKE ?`);
    params.push(`%${find.search}%`);
  }

  if (find.status) {
    conditions.push(`NT_TRANGTHAI = ?`);
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

module.exports.SELECT_EXPORT_FILE = async (find) => {
  const params = [];
  const conditions = [];

  let q = `SELECT * FROM NHA_TRO`;

  if (find.search) {
    conditions.push("NT_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("NT_TRANGTHAI = ?");
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

module.exports.COUNT_ROOM = async () => {
  let q = `
  SELECT COUNT(*) AS COUNT FROM NHA_TRO
  JOIN phong ON PHONG.NT_ID = NHA_TRO.NT_ID
  GROUP BY NHA_TRO.NT_ID
  `;

  try {
    const [data] = await db.query(q);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_RENTAL = async (role) => {
  let q = `
  SELECT * FROM NHA_TRO
  WHERE NT_ID IN (?) AND NT_TRANGTHAI = "active"`;
  try {
    const [data] = await db.query(q, role);
    return data;
  } catch (error) {
    throw error;
  }
};
