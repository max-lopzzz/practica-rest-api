# Práctica REST-API (Node.js + Express + SQL Server)

Frontend que consume esta API: https://github.com/max-lopzzz/Actividad---Pr-ctica-con-HTML

## Instalación

```bash
npm install
cp .env.example .env   # y llena tus datos de conexión
```

Crea la base de datos ejecutando `database/script.sql` en SQL Server.

> Si tu contraseña tiene `#`, ponla entre comillas en el `.env` (`DB_PASSWORD="abc#123"`).

## Ejecutar

```bash
npm run dev   # con nodemon
npm start     # sin nodemon
```

## Rutas

| Método | Ruta         | Descripción                         |
|--------|--------------|-------------------------------------|
| GET    | `/`          | Bienvenida y lista de rutas         |
| GET    | `/marco`     | Responde `polo`                     |
| GET    | `/ping`      | Responde `pong`                     |
| GET    | `/users`     | Lista todos los usuarios            |
| GET    | `/users/:id` | Obtiene un usuario                  |
| POST   | `/users`     | Crea usuario `{nombre, email, password}` |
| PUT    | `/users/:id` | Actualiza usuario (campos opcionales) |
| DELETE | `/users/:id` | Elimina usuario                     |
| POST   | `/login`     | Inicia sesión `{email, password}`   |
| GET    | `/contactos` | Lista los formularios de contacto   |
| POST   | `/contactos` | Guarda el formulario `{metodo, email, telefono, pais, region}` |

## Contraseñas seguras (módulo `crypto` de Node.js)

Las contraseñas nunca se guardan en texto plano. El método está en [src/utils/password.js](src/utils/password.js):

1. **Pimienta (pepper):** HMAC-SHA256 con `PASSWORD_PEPPER`, un secreto que vive en el `.env` y no en la BDD.
2. **Sal (salt):** 16 bytes aleatorios diferentes para cada contraseña.
3. **scrypt:** función lenta a propósito para dificultar los ataques de fuerza bruta.

En la BDD se guarda `salt:hash`. Para el login se repite el proceso con la sal guardada y se compara con `timingSafeEqual`.

```bash
npm run hash-demo          # prueba: mismo texto = mismo hash, cambio mínimo = hash muy distinto
npm run migrar-passwords   # convierte a hash las contraseñas que estén en texto plano en la BDD
```

> `PASSWORD_PEPPER` es obligatoria. Si la cambias, las contraseñas guardadas dejan de coincidir.

## CORS

La API acepta peticiones del frontend desde cualquier origen. Para limitarlo, pon los orígenes en `CORS_ORIGIN` del `.env`, separados por coma (p. ej. `CORS_ORIGIN=http://localhost:5500,https://max-lopzzz.github.io`).

## Ejemplos con curl

```bash
curl http://localhost:4000/ping
curl -X POST http://localhost:4000/users -H "Content-Type: application/json" -d '{"nombre":"Ana","email":"ana@test.com","password":"1234"}'
curl -X POST http://localhost:4000/login -H "Content-Type: application/json" -d '{"email":"ana@test.com","password":"1234"}'
```
