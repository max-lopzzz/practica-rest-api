import { randomBytes, scryptSync, createHmac, timingSafeEqual } from "node:crypto";
import "dotenv/config";

// Método para guardar contraseñas de forma segura (solo con el módulo crypto de Node.js):
//  1. Pimienta (pepper): secreto del servidor que vive en el .env, NO en la base de datos.
//     Se aplica con HMAC-SHA256, así que si alguien roba la BDD no puede probar contraseñas sin él.
//  2. Sal (salt): 16 bytes aleatorios distintos para cada contraseña. Dos usuarios con la
//     misma contraseña quedan con hashes diferentes y no sirven las tablas precalculadas.
//  3. scrypt: función de derivación de claves lenta a propósito, para que los ataques
//     de fuerza bruta sean costosos.
// Se guarda en la BDD como "salt:hash" (en hexadecimal).

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const PEPPER = process.env.PASSWORD_PEPPER;

if (!PEPPER) {
  throw new Error("Falta PASSWORD_PEPPER en el archivo .env");
}

function aplicarPimienta(password) {
  return createHmac("sha256", PEPPER).update(password).digest();
}

export function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const hash = scryptSync(aplicarPimienta(password), salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(":");
  if (!salt || !hash) return false;

  const guardado = Buffer.from(hash, "hex");
  if (guardado.length !== KEY_LENGTH) return false;

  const candidato = scryptSync(aplicarPimienta(password), salt, KEY_LENGTH);
  return timingSafeEqual(candidato, guardado);
}

// Indica si un valor de la BDD ya tiene el formato "salt:hash" (sirve para migrar)
export function isHashed(stored) {
  return /^[0-9a-f]{32}:[0-9a-f]{128}$/.test(String(stored));
}
