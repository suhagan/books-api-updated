import type { FastifyInstance } from "fastify";
import { OrdersController } from "../controllers/orders.controller";
import { createOrderBodySchema, customerIdParamsSchemaForOrders } from "../schemas/orders.schemas";

export async function ordersRoutes(app: FastifyInstance) {
  const c = new OrdersController();

  app.get("/orders", c.list);
  app.post("/orders", { schema: { body: createOrderBodySchema } }, c.create);

  // "Get all existing orders for a specific customer"
  app.get(
    "/customers/:id/orders",
    { schema: { params: customerIdParamsSchemaForOrders } },
    c.listByCustomer
  );
}
