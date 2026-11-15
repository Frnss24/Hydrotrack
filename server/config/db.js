import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(
  databaseUrl &&
    !databaseUrl.includes("user:password@") &&
    !databaseUrl.includes("your-neon-host")
);

export const pool = isDatabaseConfigured
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  : null;
