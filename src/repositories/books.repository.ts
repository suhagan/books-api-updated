import { getDb } from "../db/client";
import type { Book, CreateBook, UpdateBook } from "../types/books.types";

export class BooksRepository {
  private db = getDb();

  async getAll(year?: number): Promise<Book[]> {
    if (typeof year === "number") {
      return await this.db<Book[]>`
        SELECT id, title, author, year, isbn, price, stock_quantity
        FROM books
        WHERE year = ${year}
        ORDER BY id ASC
      `;
    }

    return await this.db<Book[]>`
      SELECT id, title, author, year, isbn, price, stock_quantity
      FROM books
      ORDER BY id ASC
    `;
  }

  async getById(id: number): Promise<Book | null> {
    const rows = await this.db<Book[]>`
      SELECT id, title, author, year, isbn, price, stock_quantity
      FROM books
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  async create(input: CreateBook): Promise<Book> {
    const stock = input.stock_quantity ?? 0;
    const rows = await this.db<Book[]>`
      INSERT INTO books (title, author, year, isbn, price, stock_quantity)
      VALUES (${input.title}, ${input.author}, ${input.year}, ${input.isbn ?? null}, ${input.price}, ${stock})
      RETURNING id, title, author, year, isbn, price, stock_quantity
    `;
    return rows[0]!;
  }

  async update(id: number, patch: UpdateBook): Promise<Book | null> {
    // Simple patch logic: update fields if present
    const current = await this.getById(id);
    if (!current) return null;

    const title = patch.title ?? current.title;
    const author = patch.author ?? current.author;
    const year = patch.year ?? current.year;
    const isbn = patch.isbn ?? current.isbn;
    const price = patch.price ?? Number(current.price);
    const stock = patch.stock_quantity ?? current.stock_quantity;

    const rows = await this.db<Book[]>`
      UPDATE books
      SET title = ${title},
          author = ${author},
          year = ${year},
          isbn = ${isbn},
          price = ${price},
          stock_quantity = ${stock},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, author, year, isbn, price, stock_quantity
    `;
    return rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await this.db<{ id: number }[]>`
      DELETE FROM books
      WHERE id = ${id}
      RETURNING id
    `;
    return rows.length > 0;
  }

  async decrementStock(bookId: number, qty: number): Promise<boolean> {
    const rows = await this.db<{ id: number }[]>`
      UPDATE books
      SET stock_quantity = stock_quantity - ${qty},
          updated_at = NOW()
      WHERE id = ${bookId} AND stock_quantity >= ${qty}
      RETURNING id
    `;
    return rows.length > 0;
  }
}
