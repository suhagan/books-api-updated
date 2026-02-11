import type { FastifyReply, FastifyRequest } from "fastify";
import { BooksService } from "../services/books.service";
import type { CreateBook, UpdateBook } from "../types/books.types";

export class BooksController {
  constructor(private service = new BooksService()) {}

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const year = (req.query as any)?.year;
    const parsedYear = year !== undefined ? Number(year) : undefined;
    const books = await this.service.list(parsedYear);
    return reply.send({ data: books });
  };

  get = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = Number((req.params as any).id);
    const book = await this.service.get(id);
    return reply.send({ data: book });
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as CreateBook;
    const created = await this.service.create(body);
    return reply.status(201).send({ data: created });
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = Number((req.params as any).id);
    const patch = req.body as UpdateBook;
    const updated = await this.service.update(id, patch);
    return reply.send({ data: updated });
  };

  remove = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = Number((req.params as any).id);
    const result = await this.service.delete(id);
    return reply.send(result);
  };
}
