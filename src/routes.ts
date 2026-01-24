// Fixing incorrect handler for /my_books
// Adding /return_book
// I will keep preHandler for user_id control on 
// relevant endpoints

import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as controllers from "./controllers";
import * as schemas from "./schemas";
import { store } from "./data/store";

/**
 * PreHandler that VALIDATES user_id
 * IMPORTANT:
 * - MUST return reply.send(...) to stop lifecycle
 */
async function requireValidUser(request: any, reply: any) {
  const userId = request.headers.user_id;

  if (!userId || Array.isArray(userId)) {
    return reply.status(400).send({
      message: "Please provide a user id!",
    });
  }

  const foundUser = store.users.find((u) => u.id === userId);

  if (!foundUser) {
    return reply.status(403).send({
      message: "You must be a user to borrow a book!",
    });
  }

  // If valid → Fastify continues to handler
}

function routes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.route({
    method: "GET",
    url: "/test",
    handler: controllers.test,
  });

  fastify.route({
    method: "GET",
    url: "/books",
    handler: controllers.getBooks,
  });

  fastify.route({
    method: "POST",
    url: "/loan_book",
    preHandler: requireValidUser,
    handler: controllers.loanBook,
    schema: schemas.loanBookSchema,
  });

  fastify.route({
    method: "POST",
    url: "/return_book",
    preHandler: requireValidUser,
    handler: controllers.returnBook,
    schema: schemas.returnBookSchema,
  });

  fastify.route({
    method: "GET",
    url: "/my_books",
    preHandler: requireValidUser,
    handler: controllers.getMyBooks,
  });
}

export default routes;
