// Fixing incorrect handler for /my_books
// Adding /return_book
// I will keep preHandler for user_id control on 
// relevant endpoints

import type { FastifyInstance, FastifyPluginOptions } from "fastify";
// import { loginController, signupController } from "./controllers";
import * as controllers from "./controllers";
import * as schemas from "./schemas";
// import { users } from "./controllers";
import { store } from "./data/store";

// requireValidUser is reused so it is not necessary to 
// duplicate user-check. /my_books will be pointed 
// correctly.
function requireValidUser(request: any, reply: any) {
  const userId = request.headers.user_id;

  if (!userId || Array.isArray(userId)) {
    return reply.status(400).send({
      message: "Please provide a user id! from my prehandler",
    });
  }

  const foundUser = store.users.find((user) => user.id === userId);

  if (!foundUser) {
    return reply.status(403).send({
      message: "You must be a user to borrow a book!",
    });
  }
} 

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

  // Test route
  fastifyServer.route({
    method: "GET",
    url: "/test",
    handler: controllers.test,
  });

  // List all books
  fastifyServer.route({
    method: "GET",
    url: "/books",
    handler: controllers.getBooks,
  });

  // Loan a book
  fastifyServer.route({
    method: "POST",
    url: "/loan_book",
    handler: controllers.loanBook,
    // preHandler: (request, reply) => {
    //   const userId = request.headers.user_id;

    //   if (!userId || Array.isArray(userId)) {
    //     return reply.status(400).send({
    //       message: "Please provide a user id! from my prehandler",
    //     });
    //   }

    //   const foundUser = users.find((user) => user.id === userId);

    //   if (!foundUser) {
    //     return reply.status(403).send({
    //       message: "You must be a user to borrow a book!",
    //     });
    //   }
    // },
    preHandler: requireValidUser, // reused preHandler
    schema: schemas.loanBookSchema,
  });

  // Return a book
  fastifyServer.route({
    method: "POST",
    url: "/return_book",
    handler: controllers.returnBook,
    preHandler: requireValidUser, // reused preHandler
    schema: schemas.returnBookSchema,
  });

  // List my books
  fastifyServer.route({
    method: "GET",
    url: "/my_books",
    handler: controllers.getMyBooks,
    preHandler: requireValidUser, // reused preHandler
  });
}

export default routes;
