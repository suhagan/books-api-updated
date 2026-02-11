import { BooksRepository } from "../repositories/books.repository";
import { BadRequestError, NotFoundError } from "../errors/api-error";
import type { CreateBook, UpdateBook } from "../types/books.types";

export class BooksService {
  constructor(private repo = new BooksRepository()) {}

  async list(year?: number) {
    if (year !== undefined && (!Number.isInteger(year) || year < 0)) {
      throw new BadRequestError("Invalid year query parameter");
    }
    return this.repo.getAll(year);
  }

  async get(id: number) {
    const book = await this.repo.getById(id);
    if (!book) throw new NotFoundError("Book not found");
    return book;
  }

  async create(input: CreateBook) {
    return this.repo.create(input);
  }

  async update(id: number, patch: UpdateBook) {
    const updated = await this.repo.update(id, patch);
    if (!updated) throw new NotFoundError("Book not found");
    return updated;
  }

  async delete(id: number) {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundError("Book not found");
    return { deleted: true };
  }
}
