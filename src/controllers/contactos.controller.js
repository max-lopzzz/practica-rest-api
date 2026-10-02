import { getConnection, sql } from "../database/connection.js";

const METODOS = ["email", "telefono", "ninguno"];

export const getContactos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM contactos ORDER BY id DESC");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContacto = async (req, res) => {
  const { metodo, email, telefono, pais, region } = req.body;

  if (!METODOS.includes(metodo)) {
    return res.status(400).json({ message: "metodo debe ser email, telefono o ninguno" });
  }
  if (metodo === "email" && !email) {
    return res.status(400).json({ message: "Escribe tu correo" });
  }
  if (metodo === "telefono" && !telefono) {
    return res.status(400).json({ message: "Escribe tu teléfono" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("metodo", sql.NVarChar(20), metodo)
      .input("email", sql.NVarChar(150), metodo === "email" ? email : null)
      .input("telefono", sql.NVarChar(20), metodo === "telefono" ? telefono : null)
      .input("pais", sql.NVarChar(10), pais || null)
      .input("region", sql.NVarChar(20), region || null)
      .query(
        `INSERT INTO contactos (metodo, email, telefono, pais, region)
         OUTPUT INSERTED.*
         VALUES (@metodo, @email, @telefono, @pais, @region)`
      );
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
