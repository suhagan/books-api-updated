import type { FastifyReply, FastifyRequest } from "fastify";
import { CustomersService } from "../services/customers.service";
import type { CreateCustomer } from "../types/customers.types";

export class CustomersController {
  constructor(private service = new CustomersService()) {}

  list = async (_req: FastifyRequest, reply: FastifyReply) => {
    const customers = await this.service.list();
    return reply.send({ data: customers });
  };

  get = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = Number((req.params as any).id);
    const customer = await this.service.get(id);
    return reply.send({ data: customer });
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as CreateCustomer;
    const created = await this.service.create(body);
    return reply.status(201).send({ data: created });
  };

  remove = async (req: FastifyRequest, reply: FastifyReply) => {
    const id = Number((req.params as any).id);
    const result = await this.service.delete(id);
    return reply.send(result);
  };
}
