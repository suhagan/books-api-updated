// End-to-end-ish testing with fastify.inject (no real 
// port needed).

//How it works:
// fastify.inject() will simulate HTTP without starting a 
// server on port.
// It will test both “happy path” and errors: 400 and 409
// It will use real store.books so the tests work regardless of the ids in the JSON

import { buildServer } from "../server";
import { store } from "../data/store";
import {test, expect, beforeAll, afterAll} from 'bun:test';

let app: Awaited<ReturnType<typeof buildServer>>;

beforeAll(async () => {
  app = await buildServer();
});

afterAll(async () => {
  await app.close();
});

test("GET /books returns available books (not borrowed)", async () => {
    // get a bookId from the data
    const anyBook = store.books[0];
    expect(anyBook).toBeTruthy();

    // borrow it so it becomes "unavailable"
    const loanRes = await app.inject({
        method: "POST",
        url: "/loan_book",
        headers:{ user_id: "2" },
        payload: { book_id: anyBook!.id },
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
    expect(ids.includes(anyBook!.id)).toBe(false);
});

test("GET /books?year=YYYY filters available books by year", async () => {
    // find a book and use its year for the test
    const target = store.books.find((b) => b.year);
    expect(target).toBeTruthy();

    const year = target!.year;
    const res = await app.inject({
        method: "GET",
        url: `/books?year=${encodeURIComponent(year)}`,
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as { count: number; data: Array<{ year: string }>    };
    // all returned books must have the correct year
    for (const b of body.data) {
        expect(b.year).toBe(year);
    }


});

test("POST /loan_book requires user_id header", async () => {
  const anyBook = store.books[1];
  expect(anyBook).toBeTruthy();

  const res = await app.inject({
    method: "POST",
    url: "/loan_book",
    payload: { book_id: anyBook!.id },
  });

  expect(res.statusCode).toBe(400);
});

test("POST /loan_book returns 409 if already borrowed", async () => {
  const anyBook = store.books[2];
  expect(anyBook).toBeTruthy();

  // First borrowed
  const first = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "1" },
    payload: { book_id: anyBook!.id },
  });
  expect(first.statusCode).toBe(200);

  // borrow again -> 409
  const second = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "2" },
    payload: { book_id: anyBook!.id },
  });

  expect(second.statusCode).toBe(409);
});

test("POST /return_book returns the book and makes it available again", async () => {
  const anyBook = store.books[3];
  expect(anyBook).toBeTruthy();

  // borrow
  const loan = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "3" },
    payload: { book_id: anyBook!.id },
  });
  expect(loan.statusCode).toBe(200);

  // return
  const ret = await app.inject({
    method: "POST",
    url: "/return_book",
    headers: { user_id: "3" },
    payload: { book_id: anyBook!.id },
  });
  expect(ret.statusCode).toBe(200);

  // check: the book should be visible in /books again
  const res = await app.inject({ method: "GET", url: "/books" });
  expect(res.statusCode).toBe(200);
  const body = res.json() as { data: any[] };

  const ids = body.data.map((b) => b.id);
  expect(ids.includes(anyBook!.id)).toBe(true);
});

test("GET /my_books returns only the current user's borrowed books", async () => {
  const bookA = store.books[4];
  const bookB = store.books[5];
  expect(bookA).toBeTruthy();
  expect(bookB).toBeTruthy();

  // user 1 borrows bookA
  const loan1 = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "1" },
    payload: { book_id: bookA!.id },
  });
  expect(loan1.statusCode).toBe(200);

  // user 2 borrows bookB
  const loan2 = await app.inject({
    method: "POST",
    url: "/loan_book",
    headers: { user_id: "2" },
    payload: { book_id: bookB!.id },
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

  expect(ids.includes(bookA!.id)).toBe(true);
  expect(ids.includes(bookB!.id)).toBe(false);
});