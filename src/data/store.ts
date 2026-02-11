/*
// Central in-memory store for the entire app.
// Why: controllers, routes, and tests must share the same state.

import type { Book, Loan, User } from "../types";

// Shape of the in-memory store
export type Store = {
  books: Book[];
  loans: Loan[];
  users: User[];
};

// The single shared store instance
export const store: Store = {
  books: [],

  users: [
    { id: "1", name: "Ahmad", email: "ahmad@chas.com" },
    { id: "2", name: "Maria", email: "maria@chas.com" },
    { id: "3", name: "Nora", email: "nora@chas.com" },
  ],

  loans: [
    {
      user_id: "1",
      book_id: "5",
      due_date: "2025-08-31",
      created_at: "2025-07-31",
    },
  ],
};

/**
 * Reset store state between tests.
 * Why:
 * - Tests must be isolated
 * - Forces books-loader to reload books.json
 */
/*
export function resetStoreForTests() {
  store.loans.length = 0;
  store.books.length = 0;
}


*/