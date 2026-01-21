import type { FastifyReply, FastifyRequest } from "fastify";
import type { Book, Loan, User } from "./types";

const books: Book[] = [];
export const users: User[] = [
  {
    id: "1",
    name: "Ahmad",
    email: "ahmad@chas.com",
  },
  {
    id: "2",
    name: "Maria",
    email: "maria@chas.com",
  },
  {
    id: "3",
    name: "Nora",
    email: "nora@chas.com",
  },
];
const loans: Loan[] = [
  {
    user_id: "1",
    book_id: "5",
    due_date: "2025-08-31",
    created_at: "2025-07-31",
  },
];

/*
1. Läser in böckerna från JSON-filen och håller det i minnet.
2. Man ska kunna låna böcker som inte är lånade redan
3. Man ska kunna lämna tillbaka böcker och uppdatera lånelistan.
4. Visa tillgängliga böcker:
    a) Alla böcker
    b) Enligt en årtal
*/

export async function test(request: FastifyRequest, reply: FastifyReply) {
  // Spara information om att den här länken har öppnats vid den tidpunkten
  // av den ip adressen
  // som var på just den enheten
  // i den platsen

  // vilken kampanj
  // vilken influencer
  // vilken källa

  console.log("Received following params: ", request.query);
  console.log("Received following user agent: ", request.headers["user-agent"]);
  console.log("Received following ip address: ", request.ip);

  return reply.redirect("https://aftonbladet.se", 301);
}

export async function getBooks(request: FastifyRequest, reply: FastifyReply) {
  throw new Error("Hej");

  // reply.status(200).send(books);
}

export async function loanBook(
  request: FastifyRequest<{
    Body: { book_id: string };
  }>,
  reply: FastifyReply
) {
  const userId = request.headers.user_id as string;

  // Boken är ledig
  const bookId = request.body.book_id;

  const existingLoan = loans.find((loan) => loan.book_id === bookId);

  if (existingLoan) {
    return reply.status(409).send({
      message: `The book is already borrowed currently, it will be available again on ${existingLoan.due_date}`,
    });
  }

  const foundBook = books.find((book) => book.id === bookId);

  if (!foundBook) {
    return reply.status(404).send({
      message: "Book not found!",
    });
  }

  const createdAt = new Date();

  const dueDate = new Date(createdAt.setMonth(createdAt.getMonth() + 1));

  const newLoan: Loan = {
    user_id: userId,
    book_id: foundBook.id,
    due_date: dueDate.toISOString(),
    created_at: createdAt.toISOString(),
  };

  // Bokför lånet
  loans.push(newLoan);

  // return reply.status(200).send({
  //   message: `You have borrowed ${foundBook.title}! Due date is on ${newLoan.due_date}.`,
  // });

  return reply.status(200).send({
    success: true,
    due_date: newLoan.due_date,
  });
}

/*

try {

const response = await axios.get("/my_books")

setBooks(response.data)


} catch (error) {
 
setError(error.response.data.message)

}


*/
