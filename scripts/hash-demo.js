// Prueba del módulo crypto de Node.js: hash de un texto
// Ejecutar con: npm run hash-demo
import { createHash } from "node:crypto";
import { hashPassword, verifyPassword } from "../src/utils/password.js";

const sha256 = (texto) => createHash("sha256").update(texto).digest("hex");

// Cuenta cuántos bits son distintos entre dos hashes en hexadecimal
function bitsDiferentes(hexA, hexB) {
  const a = Buffer.from(hexA, "hex");
  const b = Buffer.from(hexB, "hex");
  let diferentes = 0;
  for (let i = 0; i < a.length; i++) {
    let x = a[i] ^ b[i];
    while (x) {
      diferentes += x & 1;
      x >>= 1;
    }
  }
  return diferentes;
}

console.log("=== 1. Hash de un texto (SHA-256) ===");
const texto = "Hola mundo";
const hash1 = sha256(texto);
console.log(`"${texto}" -> ${hash1}`);

console.log("\n=== 2. El mismo texto genera el mismo hash ===");
const hash2 = sha256(texto);
console.log(`"${texto}" -> ${hash2}`);
console.log("¿Son iguales?", hash1 === hash2 ? "Sí" : "No");

console.log("\n=== 3. Cambiando ligeramente el texto ===");
for (const variante of ["Hola mundo.", "hola mundo", "Hola mundO"]) {
  const h = sha256(variante);
  const bits = bitsDiferentes(hash1, h);
  console.log(`"${variante}" -> ${h}`);
  console.log(`   Cambiaron ${bits} de 256 bits (${((bits / 256) * 100).toFixed(1)}%)`);
}
console.log("Un cambio mínimo en el texto cambia aproximadamente la mitad del hash (efecto avalancha).");

console.log("\n=== 4. Método para contraseñas: sal + pimienta + scrypt ===");
const password = "miPassword123";
const guardado1 = hashPassword(password);
const guardado2 = hashPassword(password);
console.log(`Contraseña: "${password}"`);
console.log(`Hash 1: ${guardado1}`);
console.log(`Hash 2: ${guardado2}`);
console.log("¿Hash 1 y Hash 2 son iguales?", guardado1 === guardado2 ? "Sí" : "No (cada uno tiene una sal diferente)");
console.log("verifyPassword con la contraseña correcta:", verifyPassword(password, guardado1));
console.log("verifyPassword con una contraseña incorrecta:", verifyPassword("miPassword124", guardado1));
