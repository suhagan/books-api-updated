// // All requirements will be implemented here (listing, 
// // borrowing, returning, my books)
// // I will use store + books-loader instead of local 
// // arrays.
// // I will try to fix bug in date calculation (setMonth 
// // mutates original date).

// import type { FastifyReply, FastifyRequest } from "fastify";
// import type { Book, Loan, User } from "./types";
// import { store } from "./data/store";

// // const books: Book[] = [];
// // export const users: User[] = [
// //   {
// //     id: "1",
// //     name: "Ahmad",
// //     email: "ahmad@chas.com",
// //   },
// //   {
// //     id: "2",
// //     name: "Maria",
// //     email: "maria@chas.com",
// //   },
// //   {
// //     id: "3",
// //     name: "Nora",
// //     email: "nora@chas.com",
// //   },
// // ];
// // const loans: Loan[] = [
// //   {
// //     user_id: "1",
// //     book_id: "5",
// //     due_date: "2025-08-31",
// //     created_at: "2025-07-31",
// //   },
// // ];

// /*
// 1. Läser in böckerna från JSON-filen och håller det i minnet.
// 2. Man ska kunna låna böcker som inte är lånade redan
// 3. Man ska kunna lämna tillbaka böcker och uppdatera lånelistan.
// 4. Visa tillgängliga böcker:
//     a) Alla böcker
//     b) Enligt en årtal
// */

// export async function test(request: FastifyRequest, reply: FastifyReply) {
//   // Spara information om att den här länken har öppnats vid den tidpunkten
//   // av den ip adressen
//   // som var på just den enheten
//   // i den platsen

//   // vilken kampanj
//   // vilken influencer
//   // vilken källa

//   console.log("Received following params: ", request.query);
//   console.log("Received following user agent: ", request.headers["user-agent"]);
//   console.log("Received following ip address: ", request.ip);

//   return reply.redirect("https://aftonbladet.se", 301);
// }

// /**
// * - GET /books?year=YYYY
// * - returns only AVAILABLE books (not borrowed)
// * - if year exists: filter on year
// * - show available books (all + by year)
// */

// export async function getBooks(request: FastifyRequest<{ Querystring: { year?: string } }>, reply: FastifyReply) {
//   // throw new Error("Hej");
//   const { year } = request.query;

//   // all book_ids that are on loan
//   const borrowedIds = new Set(store.loans.map((l) => l.book_id));

//   // filter books that are NOT borrowed
//   let availableBooks = store.books.filter((b) => !borrowedIds.has(b.id));

//   // if year is provided, filter on year
//   if (year) {
//     availableBooks = availableBooks.filter((b) => b.year === String(year));
//   }

//   return reply.status(200).send({
//     count: availableBooks.length,
//     data: availableBooks,
//   });
//   // reply.status(200).send(books);
// }

// /**
// * POST /loan_book
// * Headers: user_id
// * Body: { book_id }
// *
// * - only borrow if the book is not already borrowed
// */
// export async function loanBook(
//     request: FastifyRequest<{
//       Body: { book_id: string };
//     }>,
//     reply: FastifyReply
// ) {
//     const userId = request.headers.user_id as string;

//     // Boken är ledig / Book is available
//     const bookId = request.body.book_id;

//     // if the book is already borrowed -> 409
//     const existingLoan = store.loans.find((loan) => loan.book_id === bookId);

//     if (existingLoan) {
//       //return await reply.status(409).send({
//       return reply.status(409).send({
//         message: `The book is already borrowed currently, it will be available again on ${existingLoan.due_date}`,
//       });
//     }

//     // the book must exist
//     const foundBook = store.books.find((book) => book.id === bookId);

//     if (!foundBook) {
//       //return await reply.status(404).send({
//       return reply.status(404).send({
//         message: "Book not found!",
//       });
//     }

//     const createdAt = new Date();
//     const dueDate = new Date(createdAt.getTime());
//     dueDate.setMonth(dueDate.getMonth() + 1);

//     const newLoan: Loan = {
//       user_id: userId,
//       book_id: foundBook.id,
//       due_date: dueDate.toISOString(),
//       created_at: createdAt.toISOString(),
//     };

//     store.loans.push(newLoan);

//     //return await reply.status(200).send({
//     return reply.status(200).send({
//       success: true,
//       due_date: newLoan.due_date,
//     });
// }

// /*
//  * POST /return_book
//  * Headers: user_id
//  * Body: { book_id }
//  *
//  * lämna tillbaka bok och uppdatera lånelistan
//  */
// export async function returnBook(
//   request: FastifyRequest<{
//     Body: { book_id: string };
//   }>,
//   reply: FastifyReply
// ) {
//   const userId = request.headers.user_id as string;
//   const bookId = request.body.book_id;

//   // find the loan
//   const loanIndex = store.loans.findIndex(
//     (l) => l.book_id === bookId && l.user_id === userId
//   );

//   if (loanIndex === -1) {
//     //return await reply.status(404).send({
//     return reply.status(404).send({
//       message: "You have not borrowed that book.",
//     });
//   }

//   // remove the loan from the list
//   store.loans.splice(loanIndex, 1);

//   //return await reply.status(200).send({
//   return reply.status(200).send({
//     success: true,
//     message: "Book returned successfully.",
//   });
// }

// /**
// * GET /my_books
// * Headers: user_id
// *
// * - returns books that the user has borrowed
// * - includes due_date
// */
// export async function getMyBooks(
//     request: FastifyRequest,
//     reply: FastifyReply
// ) {
//     const userId = request.headers.user_id as string;

//     // find loans for that user
//     const myLoans = store.loans.filter((l) => l.user_id === userId);

//     // map to books with due_date / "join" loans + books
//     const myBooks = myLoans.map((loan) => {
//       const book = store.books.find((b) => b.id === loan.book_id)!;
//       if (!book) return null;

//       return {
//         ...book,
//         due_date: loan.due_date,
//         created_at: loan.created_at,
//       };
//     }).filter(Boolean) as Array<Book & { due_date: string; created_at: string }>;
    
//     return await reply.status(200).send({
//       count: myBooks.length,
//       data: myBooks,
//     });   
// }

// /**
// try {

// const response = await axios.get("/my_books")

// setBooks(response.data)


// } catch (error) {
 
// setError(error.response.data.message)

// }


// */
