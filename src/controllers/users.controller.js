import { getConnection, sql } from "../database/connection.js";
import { hashPassword } from "../utils/password.js";

const PUBLIC_FIELDS = "id, nombre, email, created_at";

export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT ${PUBLIC_FIELDS} FROM users`);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "nombre, email y password son obligatorios" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("email", sql.NVarChar(150), email)
      .input("password", sql.NVarChar(255), hashPassword(password))
      .query(
        `INSERT INTO users (nombre, email, password)
         OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.email, INSERTED.created_at
         VALUES (@nombre, @email, @password)`
      );
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre && !email && !password) {
    return res.status(400).json({ message: "Envía al menos un campo: nombre, email o password" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("nombre", sql.NVarChar(100), nombre ?? null)
      .input("email", sql.NVarChar(150), email ?? null)
      .input("password", sql.NVarChar(255), password ? hashPassword(password) : null)
      .query(
        `UPDATE users SET
           nombre = COALESCE(@nombre, nombre),
           email = COALESCE(@email, email),
           password = COALESCE(@password, password)
         OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.email, INSERTED.created_at
         WHERE id = @id`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM users WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
