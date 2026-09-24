# Práctica REST-API (Node.js + Express + SQL Server)

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

Las contraseñas se guardan cifradas (scrypt + salt), nunca en texto plano.

## Ejemplos con curl

```bash
curl http://localhost:3000/ping
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"nombre":"Ana","email":"ana@test.com","password":"1234"}'
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email":"ana@test.com","password":"1234"}'
```
