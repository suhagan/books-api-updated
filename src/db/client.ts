type SqlClient = ReturnType<typeof Bun.sql>;

let client: SqlClient | null = null;

export function getDb() {
  if (client) return client;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing. Add it to .env");
  }

  client = Bun.sql({ url });
  return client;
}

// Very small transaction helper (works well for course assignments)
export async function withTransaction<T>(
  fn: (db: ReturnType<typeof Bun.sql>) => Promise<T>
): Promise<T> {
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
