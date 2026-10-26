const db = require("../config/database");

module.exports.PHONG = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS PHONG (
  P_ID INT AUTO_INCREMENT PRIMARY KEY,
  P_TEN VARCHAR(255) NOT NULL,
  P_SL INT CHECK(P_SL > 0) NOT NULL,
  P_GIA INT CHECK(P_GIA > 0) NOT NULL,
  P_DIENTICH DECIMAL(5, 2) CHECK(P_DIENTICH > 0) NOT NULL,
  P_TRANGTHAI VARCHAR(50) DEFAULT 'active',
  P_MOTA LONGTEXT,
  P_ANH LONGTEXT,
  P_NGAYTAO DATE,

  NT_ID INT NOT NULL,

  CONSTRAINT PHONG_NT FOREIGN KEY (NT_ID) REFERENCES NHA_TRO(NT_ID)
  ) `;
  try {
    await db.query(q);
    console.log("Tao bang PHONG thanh cong");
  } catch (error) {
    console.log("Tao bang PHONG that bai", error);
  }
};

module.exports.INSERT = async (data) => {
  data.P_MOTA = data.P_MOTA.trim() || null;
  data.P_SL = parseInt(data.P_SL);
  data.P_DIENTICH = parseInt(data.P_DIENTICH);
  data.P_GIA = parseInt(data.P_GIA.replaceAll(",", ""));

  let q = `
  INSERT INTO
  PHONG(P_TEN, P_SL, P_GIA, P_DIENTICH, P_TRANGTHAI, P_MOTA, P_ANH, P_NGAYTAO, NT_ID)
  VALUES (?,?,?,?,?,?,?,?,?)`;
  try {
    await db.query(q, [
      data.P_TEN,
      data.P_SL,
      data.P_GIA,
      data.P_DIENTICH,
      data.P_TRANGTHAI,
      data.P_MOTA,
      data.P_ANH,
      data.P_NGAYTAO,
      data.NT_ID,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.UPDATE = async (id, data) => {
  data.P_MOTA = data.P_MOTA.trim() || null;
  data.P_SL = parseInt(data.P_SL);
  data.P_DIENTICH = parseInt(data.P_DIENTICH);
  data.P_GIA = parseInt(data.P_GIA.replaceAll(",", ""));

  let q = `
  UPDATE PHONG
  SET
    P_TEN=?,
    P_SL=?,
    P_GIA=?,
    P_DIENTICH=?,
    P_TRANGTHAI=?,
    P_MOTA=?,
    P_ANH=?,
    NT_ID=?
  WHERE P_ID = ?`;
  try {
    await db.query(q, [
      data.P_TEN,
      data.P_SL,
      data.P_GIA,
      data.P_DIENTICH,
      data.P_TRANGTHAI,
      data.P_MOTA,
      data.P_ANH,
      data.NT_ID,
      id,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT = async (find, pagination, role) => {
  const params = [role];
  const conditions = ["PHONG.NT_ID IN (?)"];

  let q = `
    SELECT *, NHA_TRO.NT_TEN FROM PHONG
    INNER JOIN NHA_TRO ON PHONG.NT_ID = NHA_TRO.NT_ID`;

  if (find.search) {
    conditions.push("P_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("P_TRANGTHAI = ?");
    params.push(find.status);
  }
  if (conditions.length > 0) q += "\nWHERE " + conditions.join(" AND ");

  q += `
    ORDER BY P_ID DESC
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

module.exports.COUNT = async (find, role) => {
  const params = [role];
  const conditions = ["PHONG.NT_ID IN (?)"];

  let q = `
    SELECT COUNT(*) FROM PHONG
    INNER JOIN NHA_TRO ON PHONG.NT_ID = NHA_TRO.NT_ID`;

  if (find.search) {
    conditions.push(`P_TEN LIKE ?`);
    params.push(`%${find.search}%`);
  }

  if (find.status) {
    conditions.push(`P_TRANGTHAI = ?`);
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

module.exports.CHANGE_STATUS = async (id, status) => {
  let q = `
  UPDATE PHONG
  SET P_TRANGTHAI = ?
  WHERE P_ID = ?
  `;

  try {
    await db.query(q, [status, id]);
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE = async (id) => {
  let q = `
  DELETE FROM PHONG
  WHERE P_ID = ?
  `;
  try {
    await db.query(q, [id]);
  } catch (error) {
    throw error;
  }
};

module.exports.findByID = async (id) => {
  let q = `
  SELECT * FROM PHONG
  INNER JOIN NHA_TRO ON PHONG.NT_ID = NHA_TRO.NT_ID
  WHERE P_ID = ?`;
  try {
    const [data] = await db.query(q, [id]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_EXPORT_FILE = async (find, role) => {
  const params = [role];
  const conditions = ["PHONG.NT_ID IN (?)"];

  let q = `
    SELECT *, NHA_TRO.NT_TEN FROM PHONG
    INNER JOIN NHA_TRO ON PHONG.NT_ID = NHA_TRO.NT_ID`;

  if (find.search) {
    conditions.push("P_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("P_TRANGTHAI = ?");
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

module.exports.SELECT_ACTIVE = async (find, pagination) => {
  const params = [];
  const conditions = ["P_TRANGTHAI='active'"];

  let q = `
    SELECT *, NHA_TRO.NT_TEN FROM PHONG
    INNER JOIN NHA_TRO ON PHONG.NT_ID = NHA_TRO.NT_ID`;

  if (find.search) {
    conditions.push("P_TEN LIKE ?");
    const search = `%${find.search}%`;
    params.push(search);
  }

  if (find.status) {
    conditions.push("P_TRANGTHAI = ?");
    params.push(find.status);
  }

  if (find.housing) {
    const housing = find.housing;
    conditions.push("PHONG.NT_ID IN (?)");
    params.push(housing);
  }

  if (find.max && find.min) {
    conditions.push("P_GIA BETWEEN ? AND ?");
    params.push(find.min, find.max);
  }

  if (conditions.length > 0) q += "\nWHERE " + conditions.join(" AND ");

  q += `
    ORDER BY P_ID DESC
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

module.exports.COUNT_CLIENT = async (find) => {
  const params = [];
  const conditions = ["P_TRANGTHAI='active'"];

  let q = `
    SELECT COUNT(*) FROM PHONG
    INNER JOIN NHA_TRO ON PHONG.NT_ID = NHA_TRO.NT_ID`;

  if (find.search) {
    conditions.push(`P_TEN LIKE ?`);
    params.push(`%${find.search}%`);
  }

  if (find.status) {
    conditions.push(`NT_ID = ?`);
    params.push(find.status);
  }

  if (find.housing) {
    const housing = find.housing;
    conditions.push("PHONG.NT_ID IN (?)");
    params.push(housing);
  }

  if (find.max && find.min) {
    conditions.push("P_GIA BETWEEN ? AND ?");
    params.push(find.min, find.max);
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

module.exports.findByIDHousing = async (idHousing) => {
  let q = `
  SELECT * FROM PHONG
  WHERE NT_ID = ?`;

  try {
    const [data] = await db.query(q, [idHousing]);
    return data;
  } catch (error) {
    throw error;
  }
};
