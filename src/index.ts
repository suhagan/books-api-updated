// import fastify from "fastify";
// import routes from "./routes";

// const fastifyServer = fastify({
//   logger: true,
//   ajv: {
//     customOptions: {
//       allErrors: true,
//       coerceTypes: false,
//       removeAdditional: false,
//     },
//   },
// });

import { buildServer } from "./server";

// const start = async () => {
//   const fastifyServer = await buildServer();
//   // await fastifyServer.register(routes);

//   await fastifyServer.listen({ host: "0.0.0.0", port: 3000 });

//   console.log("Server is listening on http://localhost:3000!");
// };

// start();

const app = buildServer();

app.listen({ port: 3000, host: "0.0.0.0" }).then(() => {
  console.log("Server running on http://localhost:3000");
});