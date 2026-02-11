// End-to-end-ish testing with fastify.inject (no real 
// port needed).

//How it works:
// fastify.inject() will simulate HTTP without starting a 
// server on port.
// It will test both “happy path” and errors: 400 and 409
// It will use real store.books so the tests work regardless of the ids in the JSON

import { buildServer } from "../server";
import { resetStoreForTests, store } from "../data/store";
import {test, expect, beforeEach, afterEach} from 'bun:test';

let app: Awaited<ReturnType<typeof buildServer>>;

function getAnyAvailableBook() {
  const book = store.books.find(
    (b) => !store.loans.some((l) => l.book_id === b.id)
  );

  if (!book) {
    throw new Error("No available book found for test");
  }

  return book;
}

beforeEach(async () => {
  // reset shared memory BEFORE every test
  resetStoreForTests();

  // build a fresh server instance
  app = await buildServer();

  // books MUST be loaded
  if (store.books.length === 0) {
    throw new Error("Books were not loaded before tests ran");
  }
});

afterEach(async () => {
  try {
    if (app) {
      await app.close();
    }
  } catch (error) {
    // Ignore errors on close
  }
});

/* -------------------------------------------------------
   TESTS
------------------------------------------------------- */

test("GET /books returns available books (not borrowed)", async () => {
    // get a bookId from the data
    // const anyBook = store.books[0];
    const book = getAnyAvailableBook();
    //expect(anyBook).toBeTruthy();

    // borrow it so it becomes "unavailable"
    const loanRes = await app.inject({
        method: "POST",
        url: "/loan_book",
        headers:{ user_id: "2" },
        payload: { book_id: book.id },
    });

    expect(loanRes.statusCode).toBe(200);

    // now /books should not contain that book
    const res = await app.inject({
        method: "GET",
        url: "/books",
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as { count: number; data: any[] };
    const ids = body.data.map((b) => b.id);
    expect(ids.includes(book.id)).toBe(false);
});



test("GET /books?year=YYYY filters available books by year", async () => {
    // find a book and use its year for the test
    const target = store.books.find((b) => b.year);
    expect(target).toBeTruthy();

    //const year = target!.year;
    const res = await app.inject({
        method: "GET",
        url: `/books?year=${encodeURIComponent(target!.year)}`,
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as { data: Array<{ year: string }> };
    // all returned books must have the correct year
    for (const book of body.data) {
        expect(book.year).toBe(target!.year);
    }


});



test("POST /loan_book requires user_id header", async () => {
  //const anyBook = store.books[1];
    const book = getAnyAvailableBook();
  expect(book).toBeTruthy();

  const res = await app.inject({
    method: "POST",
    url: "/loan_book",
    payload: { book_id: book.id },
  });

  expect(res.statusCode).toBe(400);
});


test("POST /loan_book returns 409 if already borrowed", async () => {
  //const anyBook = store.books[2];
    const book = getAnyAvailableBook();
  expect(book).toBeTruthy();

  // First borrowed
  const first = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "1" },
    payload: { book_id: book.id },
  });
  expect(first.statusCode).toBe(200);

  // borrow again -> 409
  const second = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "2" },
    payload: { book_id: book.id },
  });

  expect(second.statusCode).toBe(409);
});


test("POST /return_book returns the book and makes it available again", async () => {
  //const anyBook = store.books[3];
    const book = getAnyAvailableBook();
  expect(book).toBeTruthy();

  // borrow
  const loan = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "3" },
    payload: { book_id: book.id },
  });
  expect(loan.statusCode).toBe(200);

  // return
  const ret = await app.inject({
    method: "POST",
    url: "/return_book",
    headers: { user_id: "3" },
    payload: { book_id: book.id },
  });
  expect(ret.statusCode).toBe(200);

  // check: the book should be visible in /books again
  const res = await app.inject({ method: "GET", url: "/books" });
  expect(res.statusCode).toBe(200);
  //const body = res.json() as { data: any[] };
    const body = res.json() as { data: Array<{ id: string }> };

  //const ids = body.data.map((b) => b.id);
  //expect(ids.includes(anyBook!.id)).toBe(true);
  expect(body.data.some((b) => b.id === book.id)).toBe(true);
});


test("GET /my_books returns only the current user's borrowed books", async () => {
  // user 1 borrows first available book
  const bookA = getAnyAvailableBook();

  const loan1 = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "1" },
    payload: { book_id: bookA.id },
  });

  expect(loan1.statusCode).toBe(200);

  // NOW get another available book (must be different)
  const bookB = getAnyAvailableBook();

  const loan2 = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "2" },
    payload: { book_id: bookB.id },
  });

  expect(loan2.statusCode).toBe(200);

  // user 1 -> my_books should contain bookA but not bookB
  const res = await app.inject({
    method: "GET",
    url: "/my_books",
    headers: { user_id: "1" },
  });

  expect(res.statusCode).toBe(200);

  const body = res.json() as { data: Array<{ id: string }> };
  const ids = body.data.map((b) => b.id);

  expect(ids.includes(bookA.id)).toBe(true);
  expect(ids.includes(bookB.id)).toBe(false);
});
