import sql from "mssql";
import config from "../config.js";

let pool;

export async function getConnection() {
  if (!pool) {
    pool = await new sql.ConnectionPool(config.db).connect();
  }
  return pool;
}

export { sql };
