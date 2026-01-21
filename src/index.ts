import fastify from "fastify";
import routes from "./routes";

const fastifyServer = fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      coerceTypes: false,
      removeAdditional: false,
    },
  },
});

const start = async () => {
  await fastifyServer.register(routes);

  await fastifyServer.listen({ host: "0.0.0.0", port: 3000 });

  console.log("Server is listening!");
};

start();
