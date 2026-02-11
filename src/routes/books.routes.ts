import type { FastifyInstance } from "fastify";
import { BooksController } from "../controllers/books.controller";
import {
  bookIdParamsSchema,
  booksQuerySchema,
  createBookBodySchema,
  updateBookBodySchema,
} from "../schemas/books.schemas";

export async function booksRoutes(app: FastifyInstance) {
  const c = new BooksController();

  app.get("/books", { schema: { querystring: booksQuerySchema } }, c.list);
  app.get("/books/:id", { schema: { params: bookIdParamsSchema } }, c.get);

  app.post("/books", { schema: { body: createBookBodySchema } }, c.create);
  app.put("/books/:id", { schema: { params: bookIdParamsSchema, body: updateBookBodySchema } }, c.update);

  app.delete("/books/:id", { schema: { params: bookIdParamsSchema } }, c.remove);
}
