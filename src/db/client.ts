// src/db/client.ts

type SqlTag = typeof Bun.sql;

/**
 * Bun reads DATABASE_URL automatically from .env.
 * Bun.sql is the tagged template you call like:
 *   await db`SELECT 1`
 */
let db: SqlTag | null = null;

export function getDb(): SqlTag {
  if (db) return db;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Add it to .env");
  }

  db = Bun.sql;
  return db;
}

export async function withTransaction<T>(fn: (db: SqlTag) => Promise<T>): Promise<T> {
  const db = getDb();
  await db`BEGIN`;
  try {
    const result = await fn(db);
    await db`COMMIT`;
    return result;
  } catch (err) {
    await db`ROLLBACK`;
    throw err;
  }
}
