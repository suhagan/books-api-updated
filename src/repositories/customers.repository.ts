import { getDb } from "../db/client";
import type { Customer, CreateCustomer } from "../types/customers.types";

export class CustomersRepository {
  private db = getDb();

  async getAll(): Promise<Customer[]> {
    return await this.db<Customer[]>`
      SELECT id, first_name, last_name, email, phone, city, country
      FROM customers
      ORDER BY id ASC
    `;
  }

  async getById(id: number): Promise<Customer | null> {
    const rows = await this.db<Customer[]>`
      SELECT id, first_name, last_name, email, phone, city, country
      FROM customers
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  async create(input: CreateCustomer): Promise<Customer> {
    const rows = await this.db<Customer[]>`
      INSERT INTO customers (first_name, last_name, email, phone, city, country)
      VALUES (${input.first_name}, ${input.last_name}, ${input.email}, ${input.phone ?? null}, ${input.city ?? null}, ${input.country ?? null})
      RETURNING id, first_name, last_name, email, phone, city, country
    `;
    return rows[0]!;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await this.db<{ id: number }[]>`
      DELETE FROM customers
      WHERE id = ${id}
      RETURNING id
    `;
    return rows.length > 0;
  }
}
