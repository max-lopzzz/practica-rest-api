import { config } from "dotenv";
config();

export default {
  port: process.env.PORT || 4000,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || "localhost",
    port: Number(process.env.DB_PORT) || 1433,
    database: process.env.DB_DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
};
