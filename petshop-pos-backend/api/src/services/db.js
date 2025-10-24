import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("🟢 Conectado a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("🔴 Error en la conexión a PostgreSQL:", err.message);
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
