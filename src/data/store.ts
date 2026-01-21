// Central in-memory store for the entire app.
// Why: So that controllers and services can 
// share the same data without "accidentally" 
// creating new arrays.

import type { Book, Loan, User } from "../types";

// defining types of the store's properties
export type Store = {
    // to import all books from books.json
    books: Book[]; 
    // active loan (in-memory)
    loans: Loan[]; 
    // allowed user (in-memory)
    users: User[]; 
};

// the actual store object
export const store: Store = {
    books: [],

    // users from controllers.ts (same data, but moved to store)
    users: [
        { id: "1", name: "Ahmad", email: "ahmad@chas.com" },
        { id: "2", name: "Maria", email: "maria@chas.com" },
        { id: "3", name: "Nora", email: "nora@chas.com" },
    ],

    // loans from controllers.ts (same data, but moved to store)
    loans: [
        {
        user_id: "1",
        book_id: "5",
        due_date: "2025-08-31",
        created_at: "2025-07-31",
        },
    ],
};
