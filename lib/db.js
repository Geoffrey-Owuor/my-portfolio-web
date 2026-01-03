import { Pool } from "@neondatabase/serverless";

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
};

// Singleton pattern to ensure only one pool is created in development
let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool(poolConfig);
} else {
  // In development check if global pool already exists
  if (!globalThis.postgresPool) {
    globalThis.postgresPool = new Pool(poolConfig);
  }
  pool = globalThis.postgresPool;
}

export async function query(queryString, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(queryString, params);
    return result.rows;
  } finally {
    client.release();
  }
}
