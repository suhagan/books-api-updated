// Here I will build the Fastify instance and loads 
// books before routes.
// The tests should be able to create server without 
// starting a real port.
// All the logic for “building the app” is here. 
// Tester imports buildServer().

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
// import { loadBooksOnce } from "./data/books-loader";
// import routes from "./routes";
import { registerErrorHandler } from "./errors/error-handler";
import { booksRoutes } from "./routes/books.routes";
import { customersRoutes } from "./routes/customers.routes";
import { ordersRoutes } from "./routes/orders.routes";
import { authRoutes } from "./auth/auth.routes"; 


// export async function buildServer() {
//     const fastifyServer = Fastify({
//         logger: false, // keeping tests silent (can be turned on later)
//         ajv: {
//             customOptions: {
//                 allErrors: true,
//                 coerceTypes: false,
//                 removeAdditional: false,
//             },
//         },
//     });

//     // load books into store before routes
//     await loadBooksOnce();

//     // register routes - MUST await this
//     await fastifyServer.register(routes);

//     return fastifyServer;
// }

export async function buildServer() {
  const app = Fastify({ logger: true });

  registerErrorHandler(app);

  app.get("/health", async () => ({ ok: true }));

  await app.register(cors, {
  origin: true,
  });

  await app.register(helmet);

  await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
  });
  
  app.register(booksRoutes);
  app.register(customersRoutes);
  app.register(ordersRoutes);
  await app.register(authRoutes); 

  return app;
}
