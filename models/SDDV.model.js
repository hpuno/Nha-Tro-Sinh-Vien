const db = require("../config/database");

module.exports.SDDV = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS SDDV (
      SDDV_THANGNAM DATE NOT NULL,

      TP_ID INT NOT NULL,
      DV_ID INT NOT NULL,

      SDDV_TRANGTHAI VARCHAR(50) DEFAULT 'active',

      PRIMARY KEY (SDDV_THANGNAM, TP_ID, DV_ID),

      CONSTRAINT SDDV_PHONG
        FOREIGN KEY (TP_ID) REFERENCES THUE_PHONG(TP_ID),

      CONSTRAINT SDDV_DV
        FOREIGN KEY (DV_ID) REFERENCES DICH_VU(DV_ID)
    )`;

  try {
    await db.query(q);
    console.log("Tao bang SDDV thanh cong");
  } catch (error) {
    console.log("Tao bang SDDV that bai", error);
    throw error;
  }
};

module.exports.SELECT = async (find, pagination, role) => {
  const params = [role];
  const conditions = ["PHONG.NT_ID IN (?)"];

  let q = `
    SELECT
      PHONG.P_TEN,
      PHONG.P_ID,
      THUE_PHONG.TP_ID,
      DICH_VU.DV_TEN,
      DICH_VU.DV_ID,
      DATE_FORMAT(SDDV.SDDV_THANGNAM, '%m/%Y') AS SDDV_THANGNAM,
      SDDV.SDDV_TRANGTHAI

    FROM SDDV
    INNER JOIN THUE_PHONG
      ON THUE_PHONG.TP_ID = SDDV.TP_ID
    INNER JOIN PHONG
      ON PHONG.P_ID = THUE_PHONG.P_ID
    INNER JOIN DICH_VU
      ON DICH_VU.DV_ID = SDDV.DV_ID
    INNER JOIN NHA_TRO
      ON NHA_TRO.NT_ID = PHONG.NT_ID
  `;

  if (find.search) {
    conditions.push("PHONG.P_TEN LIKE ?");
    params.push(`%${find.search}%`);
  }

  if (find.status) {
    const [m, y] = find.status.split("/");
    conditions.push("DATE_FORMAT(SDDV.SDDV_THANGNAM, '%m/%Y') = ?");
    params.push(`${m}/${y}`);
  }

  q += "\nWHERE " + conditions.join(" AND ");

  q += `
    ORDER BY SDDV.SDDV_THANGNAM DESC
    LIMIT ?
    OFFSET ?
  `;

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
    SELECT COUNT(*) AS total
    FROM SDDV
    INNER JOIN THUE_PHONG
      ON THUE_PHONG.TP_ID = SDDV.TP_ID
    INNER JOIN PHONG
      ON PHONG.P_ID = THUE_PHONG.P_ID
    INNER JOIN DICH_VU
      ON DICH_VU.DV_ID = SDDV.DV_ID
    INNER JOIN NHA_TRO
      ON NHA_TRO.NT_ID = PHONG.NT_ID
  `;

  if (find.search) {
    conditions.push("PHONG.P_TEN LIKE ?");
    params.push(`%${find.search}%`);
  }

  if (find.status) {
    const [m, y] = find.status.split("/");
    conditions.push("DATE_FORMAT(SDDV.SDDV_THANGNAM, '%m/%Y') = ?");
    params.push(`${m}/${y}`);
  }

  q += "\nWHERE " + conditions.join(" AND ");

  try {
    const [data] = await db.query(q, params);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.DELETE_USE_SERVICE = async (idRental, idService, month_year) => {
  let q = `
    DELETE FROM SDDV
    WHERE
      TP_ID = ? AND
      DV_ID = ? AND
      DATE_FORMAT(SDDV_THANGNAM, '%m/%Y') = ?
  `;

  try {
    await db.query(q, [idRental, idService, month_year]);
  } catch (error) {
    throw error;
  }
};

module.exports.findById = async (data, key, id) => {
  let q = `
    SELECT ${data}
    FROM SDDV
    WHERE ${key} = ?
  `;

  try {
    const [result] = await db.query(q, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.SELECT_ACTIVE = async (data, key, id) => {
  let q = `
    SELECT ${data}
    FROM SDDV
    WHERE ${key} = ?
      AND SDDV_TRANGTHAI = 'active'
  `;

  try {
    const [result] = await db.query(q, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.SIGNUP = async (SDDV_THANGNAM, TP_ID, DV_ID) => {
  let q = `
    INSERT INTO SDDV (
      SDDV_THANGNAM,
      TP_ID,
      DV_ID
    )
    VALUES (?, ?, ?)
  `;

  try {
    await db.query(q, [SDDV_THANGNAM, TP_ID, DV_ID]);
  } catch (error) {
    throw error;
  }
};
