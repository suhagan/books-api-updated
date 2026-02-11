import { test, expect, beforeAll } from "bun:test";
import { buildTestServer } from "./helpers/build-server";
import { resetDb } from "./helpers/db-reset";
import { getDb } from "../db/client";

async function seedMinimal() {
  const db = getDb();
  await db`INSERT INTO books (title, author, year, isbn, price, stock_quantity)
           VALUES ('Test Book', 'Tester', 2020, '111', 100.00, 3)`;
}

test("GET /books returns books", async () => {
  await resetDb();
  await seedMinimal();

  const app = buildTestServer();
  const res = await app.inject({ method: "GET", url: "/books" });

  expect(res.statusCode).toBe(200);
  const body = res.json();
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBe(1);

  await app.close();
});
