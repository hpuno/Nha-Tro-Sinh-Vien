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

module.exports.SELECT_SERVICE = async (find, pagination) => {
  const params = [];
  const conditions = ["DICH_VU.DV_TEN NOT IN ('Nước', 'Điện', 'Lấy rác')"];

  let q = `SELECT DICH_VU.* FROM DICH_VU`;

  if (find.status === "registered") {
    q += ` INNER JOIN SDDV ON DICH_VU.DV_ID = SDDV.DV_ID AND SDDV.P_ID = ?`;

    params.push(find.idRoom);
    conditions.push("SDDV_TRANGTHAI = 'active'");
  } else if (find.status === "unregistered") {
    q += ` LEFT JOIN SDDV ON DICH_VU.DV_ID = SDDV.DV_ID AND SDDV.P_ID = ?`;
    params.push(find.idRoom);
    conditions.push("(SDDV.DV_ID IS NULL OR SDDV_TRANGTHAI = 'inactive')");
  }

  if (find.search) {
    conditions.push("DICH_VU.DV_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (conditions.length > 0) {
    q += "\nWHERE " + conditions.join(" AND ");
  }

  q += `
    ORDER BY DICH_VU.DV_ID DESC
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

module.exports.COUNT = async (find) => {
  const params = [];
  const conditions = ["DICH_VU.DV_TEN NOT IN ('Nước', 'Điện', 'Lấy rác')"];

  let q = `SELECT COUNT(*) FROM DICH_VU`;

  if (find.status === "registered") {
    q += ` INNER JOIN SDDV ON DICH_VU.DV_ID = SDDV.DV_ID AND SDDV.P_ID = ?`;
    params.push(find.idRoom);
  } else if (find.status === "unregistered") {
    q += ` LEFT JOIN SDDV ON DICH_VU.DV_ID = SDDV.DV_ID AND SDDV.P_ID = ?`;
    params.push(find.idRoom);
    conditions.push("SDDV.DV_ID IS NULL");
  }

  if (find.search) {
    conditions.push("DICH_VU.DV_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (conditions.length > 0) {
    q += "\nWHERE " + conditions.join(" AND ");
  }

  try {
    const [data] = await db.query(q, params);
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

module.exports.findMany = async (key, value) => {
  let q = `
  SELECT * FROM DICH_VU
  WHERE ${key} IN (?)`;

  try {
    const [data] = await db.query(q, [value]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_USE_SERVICE = async (idRoom) => {
  let q = `
  SELECT DICH_VU.*
  FROM DICH_VU
  LEFT JOIN SDDV
    ON DICH_VU.DV_ID = SDDV.DV_ID
    AND SDDV.P_ID = ?
  WHERE SDDV.DV_ID IS NULL AND DV_TEN NOT IN ('Nước', 'Điện', 'Lấy rác')`;

  try {
    const [data] = await db.query(q, [idRoom]);
    return data;
  } catch (error) {
    throw error;
  }
};
