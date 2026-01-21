import type { FastifyInstance, FastifyPluginOptions } from "fastify";
// import { loginController, signupController } from "./controllers";
import * as controllers from "./controllers";
import * as schemas from "./schemas";
import { users } from "./controllers";

function routes(fastifyServer: FastifyInstance, options: FastifyPluginOptions) {
  //   fastifyServer.route({
  //     method: "POST",
  //     url: "/signup",
  //     handler: controllers.signup,
  //   });

  //   fastifyServer.route({
  //     method: "POST",
  //     url: "/login",
  //     handler: controllers.login,
  //   });

  fastifyServer.route({
    method: "GET",
    url: "/test",
    handler: controllers.test,
  });

  fastifyServer.route({
    method: "GET",
    url: "/books",
    handler: controllers.getBooks,
  });

  fastifyServer.route({
    method: "POST",
    url: "/loan_book",
    handler: controllers.loanBook,
    preHandler: (request, reply) => {
      const userId = request.headers.user_id;

      if (!userId || Array.isArray(userId)) {
        return reply.status(400).send({
          message: "Please provide a user id! from my prehandler",
        });
      }

      const foundUser = users.find((user) => user.id === userId);

      if (!foundUser) {
        return reply.status(403).send({
          message: "You must be a user to borrow a book!",
        });
      }
    },
    schema: schemas.loanBookSchema,
  });

  fastifyServer.route({
    method: "GET",
    url: "/my_books",
    handler: controllers.loanBook,
  });
}

export default routes;
