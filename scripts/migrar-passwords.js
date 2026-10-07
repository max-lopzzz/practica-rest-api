// Actualiza las contraseñas de la base de datos: convierte a hash (sal + pimienta + scrypt)
// todas las que todavía estén guardadas en texto plano.
// Ejecutar con: npm run migrar-passwords
import { getConnection, sql } from "../src/database/connection.js";
import { hashPassword, isHashed } from "../src/utils/password.js";

const pool = await getConnection();
const { recordset: usuarios } = await pool.request().query("SELECT id, email, password FROM users");

let actualizados = 0;
for (const usuario of usuarios) {
  if (isHashed(usuario.password)) continue;

  await pool
    .request()
    .input("id", sql.Int, usuario.id)
    .input("password", sql.NVarChar(255), hashPassword(usuario.password))
    .query("UPDATE users SET password = @password WHERE id = @id");

  console.log(`Contraseña actualizada: ${usuario.email}`);
  actualizados++;
}

console.log(`\n${actualizados} de ${usuarios.length} contraseñas convertidas a hash.`);
await pool.close();
