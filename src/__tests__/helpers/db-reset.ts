import { getDb } from "../../db/client";

export async function resetDb() {
  const db = getDb();

  // Reliable existence check (boolean) — avoids regclass decoding issues
  const check = await db<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'order_items'
    ) AS exists
  `;

  if (!check[0]?.exists) {
    const info = await db<
      { db: string; addr: string; port: number; sp: string }[]
    >`
      SELECT
        current_database() as db,
        inet_server_addr() as addr,
        inet_server_port() as port,
        current_setting('search_path') as sp
    `;
    throw new Error(
      `Database schema is missing in this connection.\n` +
        `Connected to: ${JSON.stringify(info[0], null, 2)}\n` +
        `Run: docker exec -i books_api_pg psql -U postgres -d postgres < sql/initial.sql`
    );
  }

  // Schema-qualified TRUNCATE to avoid any search_path edge case
  await db`
    TRUNCATE TABLE
      public.order_items,
      public.orders,
      public.customers,
      public.books
    RESTART IDENTITY
    CASCADE
  `;
}
