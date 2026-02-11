import { test, expect } from "bun:test";
import { buildTestServer } from "./helpers/build-server";
import { resetDb } from "./helpers/db-reset";
import { getDb } from "../db/client";

async function seedForOrder() {
  const db = getDb();
  await db`INSERT INTO customers (first_name, last_name, email) VALUES ('Anna', 'A', 'anna@test.com')`;
  await db`INSERT INTO books (title, author, year, isbn, price, stock_quantity)
           VALUES ('Book1', 'Auth', 2020, 'x1', 50.00, 2)`;
}

test("POST /orders creates order and decrements stock", async () => {
  await resetDb();
  await seedForOrder();

  const app = buildTestServer();

  const res = await app.inject({
    method: "POST",
    url: "/orders",
    payload: {
      customer_id: 1,
      items: [{ book_id: 1, quantity: 1 }],
    },
  });

  expect(res.statusCode).toBe(201);
  const body = res.json();
  expect(body.created).toBe(true);
  expect(body.order_id).toBe(1);

  // Verify stock
  const db = getDb();
  const rows = await db<{ stock_quantity: number }[]>`
    SELECT stock_quantity FROM books WHERE id = 1
  `;
  expect(rows[0]!.stock_quantity).toBe(1);

  await app.close();
});
