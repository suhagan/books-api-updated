import type { FastifyReply, FastifyRequest } from "fastify";
import { OrdersService } from "../services/orders.service";
import type { CreateOrderInput } from "../types/orders.types";

export class OrdersController {
  constructor(private service = new OrdersService()) {}

  list = async (_req: FastifyRequest, reply: FastifyReply) => {
    const orders = await this.service.list();
    return reply.send({ data: orders });
  };

  listByCustomer = async (req: FastifyRequest, reply: FastifyReply) => {
    const customerId = Number((req.params as any).id);
    const orders = await this.service.listByCustomer(customerId);
    return reply.send({ data: orders });
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as CreateOrderInput;
    const created = await this.service.create(body);
    return reply.status(201).send(created);
  };
}
