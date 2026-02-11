import type { FastifyInstance } from "fastify";
import { CustomersController } from "../controllers/customers.controller";
import { createCustomerBodySchema, customerIdParamsSchema } from "../schemas/customers.schemas";

export async function customersRoutes(app: FastifyInstance) {
  const c = new CustomersController();

  app.get("/customers", c.list);
  app.get("/customers/:id", { schema: { params: customerIdParamsSchema } }, c.get);
  app.post("/customers", { schema: { body: createCustomerBodySchema } }, c.create);
  app.delete("/customers/:id", { schema: { params: customerIdParamsSchema } }, c.remove);
}
