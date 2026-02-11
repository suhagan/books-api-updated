import { getDb } from "../../db/client";

export async function resetDb() {
  const db = getDb();
  // Clear transactional tables first
  await db`TRUNCATE TABLE order_items RESTART IDENTITY CASCADE`;
  await db`TRUNCATE TABLE orders RESTART IDENTITY CASCADE`;
  await db`TRUNCATE TABLE customers RESTART IDENTITY CASCADE`;
  await db`TRUNCATE TABLE books RESTART IDENTITY CASCADE`;
}
