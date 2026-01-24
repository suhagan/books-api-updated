// Here I will build the Fastify instance and loads 
// books before routes.
// The tests should be able to create server without 
// starting a real port.
// All the logic for “building the app” is here. 
// Tester imports buildServer().

import Fastify from "fastify";
import { loadBooksOnce } from "./data/books-loader";
import routes from "./routes";

export async function buildServer() {
    const fastifyServer = Fastify({
        logger: false, // keeping tests silent (can be turned on later)
        ajv: {
            customOptions: {
                allErrors: true,
                coerceTypes: false,
                removeAdditional: false,
            },
        },
    });

    // load books into store before routes
    await loadBooksOnce();

    // register routes - MUST await this
    await fastifyServer.register(routes);

    return fastifyServer;
}
