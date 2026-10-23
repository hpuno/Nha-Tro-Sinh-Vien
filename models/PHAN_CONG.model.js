const db = require("../config/database");

module.exports.PHAN_CONG = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS PHAN_CONG (
  NV_ID INT NOT NULL,
  NT_ID INT NOT NULL,
  CV_ID INT NOT NULL,

  PRIMARY KEY (NV_ID, NT_ID, CV_ID),

  CONSTRAINT PC_CV FOREIGN KEY (CV_ID) REFERENCES CHUC_VU(CV_ID),
  CONSTRAINT PC_NT FOREIGN KEY (NT_ID) REFERENCES NHA_TRO(NT_ID),
  CONSTRAINT PC_NV FOREIGN KEY (NV_ID) REFERENCES NHAN_VIEN(NV_ID)
  )`;

  try {
    await db.query(q);
    console.log("Tao bang PHAN_CONG thanh cong");
  } catch (error) {
    console.log("Tao bang PHAN_CONG that bai");
    throw error;
  }
};

module.exports.PERMISSION = async (idUser, idHousing, idRole) => {
  let q = `
  INSERT INTO
  PHAN_CONG(NV_ID, NT_ID, CV_ID)
  VALUES(?, ?, ?)`;
  try {
    await db.query(q, [idUser, idHousing, idRole]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_PERMISSION = async (find, pagination) => {
  const params = [];
  const conditions = [];

  let q = `
    SELECT DISTINCT NHAN_VIEN.NV_ANH, NHAN_VIEN.NV_ID, NHAN_VIEN.NV_TEN, CHUC_VU.CV_TEN, CHUC_VU.CV_LEVEL 
    FROM NHAN_VIEN
    LEFT JOIN PHAN_CONG ON PHAN_CONG.NV_ID = NHAN_VIEN.NV_ID
    LEFT JOIN CHUC_VU ON PHAN_CONG.CV_ID = CHUC_VU.CV_ID
    WHERE NV_TRANGTHAI = "active"`;

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
    ORDER BY CHUC_VU.CV_LEVEL
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

module.exports.SELECT_ROLE = async (id) => {
  let q = `
    SELECT DISTINCT CHUC_VU.CV_TEN FROM CHUC_VU
    INNER JOIN PHAN_CONG ON PHAN_CONG.CV_ID = CHUC_VU.CV_ID
    WHERE PHAN_CONG.NV_ID = ?`;
  try {
    const [data] = await db.query(q, [id]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_HOUSING = async (id) => {
  let q = `
    SELECT NHA_TRO.NT_TEN, NHA_TRO.NT_ID FROM NHA_TRO
    INNER JOIN PHAN_CONG ON PHAN_CONG.NT_ID = NHA_TRO.NT_ID
    WHERE PHAN_CONG.NV_ID = ?`;
  try {
    const [data] = await db.query(q, id);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.FindByID = async (idUser) => {
  let q = `
  SELECT * FROM PHAN_CONG
  WHERE NV_ID = ?`;
  try {
    const [data] = await db.query(q, [idUser]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.FindByRole = async (CV_ID) => {
  let q = `
  SELECT DISTINCT CV_ID FROM PHAN_CONG
  WHERE CV_ID = ?`;
  try {
    const [data] = await db.query(q, [CV_ID]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE_ROLE = async (CV_ID) => {
  let q = `
    DELETE FROM PHAN_CONG
    WHERE CV_ID = ?`;
  try {
    await db.query(q, [CV_ID]);
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE_PERMISSION = async (idUser) => {
  let q = `
    DELETE FROM PHAN_CONG
    WHERE NV_ID = ?`;
  try {
    await db.query(q, [idUser]);
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_EXPORT_FILE = async (find) => {
  const params = [];
  const conditions = [];

  let q = `
    SELECT DISTINCT NHAN_VIEN.NV_TEN, CHUC_VU.CV_TEN, NHA_TRO.NT_TEN
    FROM PHAN_CONG
    LEFT JOIN NHAN_VIEN ON PHAN_CONG.NV_ID = NHAN_VIEN.NV_ID
    LEFT JOIN CHUC_VU ON PHAN_CONG.CV_ID = CHUC_VU.CV_ID
    LEFT JOIN NHA_TRO ON PHAN_CONG.NT_ID = NHA_TRO.NT_ID
    WHERE NV_TRANGTHAI = "active"`;

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
