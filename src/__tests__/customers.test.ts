import { test, expect } from "bun:test";
import { buildTestServer } from "./helpers/build-server";
import { resetDb } from "./helpers/db-reset";
import { getDb } from "../db/client";

async function seedCustomer() {
  const db = getDb();
  await db`INSERT INTO customers (first_name, last_name, email) VALUES ('A', 'B', 'a@b.com')`;
}

test("GET /customers returns customers", async () => {
  await resetDb();
  await seedCustomer();

  const app = buildTestServer();
  const res = await app.inject({ method: "GET", url: "/customers" });

  expect(res.statusCode).toBe(200);
  const body = res.json();
  expect(body.data.length).toBe(1);

  await app.close();
});
