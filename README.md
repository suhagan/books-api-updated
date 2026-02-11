# Books API (Bun + Fastify)

This project is a **learning-focused backend API** built with **Bun** and **Fastify**.
It demonstrates how to design, structure, test, and debug a small REST API using:

- in-memory state
- JSON file loading
- request validation
- Fastify lifecycle control
- Bun’s built-in test runner

All requirements are **fully implemented and fully tested**.

---

## Assignment Requirements

The API fulfills the following requirements:

1. Load books from a JSON file and keep them in memory
2. Allow users to borrow books **only if they are available**
3. Allow users to return borrowed books
4. List available books:
   - all available books
   - available books filtered by year

---

## Why this project exists

This project is a **Boiler Room–style exercise**, meaning:

- The starting code was intentionally incomplete
- Requirements had to be interpreted carefully
- Structure, correctness, and testability were improved step-by-step
- Learning and reasoning were prioritized over shortcuts

The final result reflects **real backend problem-solving**, not just “making it work”.

---

## Original Project Structure (Before Refactoring)

```text
src/
├─ index.ts
├─ routes.ts
├─ controllers.ts
├─ schemas.ts
└─ types.ts
```

### Problems with the original structure

- Books were **never loaded** from `books.json`
- `/books` endpoint crashed intentionally
- `/my_books` pointed to the wrong controller
- No way to return books
- Data and logic lived in the same files
- No test setup
- Server could not be reused in tests
- Fastify lifecycle was not understood

This made the project **hard to test, hard to debug, and incomplete**.

---

## Final Project Structure (After Refactoring)

```text
books-api/
├─ src/
│  ├─ data/
│  │  ├─ store.ts          # Central in-memory store (books, users, loans)
│  │  └─ books-loader.ts   # Loads books.json using Bun.file
│  │
│  ├─ __tests__/
│  │  └─ books-api.test.ts # Full API tests using bun:test + fastify.inject
│  │
│  ├─ controllers.ts       # Business logic only
│  ├─ routes.ts            # HTTP routing + Fastify lifecycle control
│  ├─ schemas.ts           # JSON schema validation
│  ├─ types.ts             # Shared TypeScript types
│  ├─ server.ts            # Builds Fastify app (used by tests)
│  └─ index.ts             # Starts HTTP server
│
├─ books.json              # Source of truth for book data
├─ package.json
├─ bun.lock
├─ tsconfig.json
├─ README.md
└─ .gitignore
```

---

## Why these changes were necessary

### Separation of concerns

- **books-loader.ts** → file I/O only
- **store.ts** → shared in-memory state
- **controllers.ts** → business logic
- **routes.ts** → HTTP & validation only
- **server.ts** → reusable Fastify instance

This makes the code easier to understand, test, and extend.

---

### Testability

- The server can be created **without opening a real port**
- Tests use `fastify.inject()` instead of HTTP calls
- Shared state is reset between tests
- Tests are deterministic and isolated

---

### Correctness & stability

- Books are actually loaded from `books.json`
- Borrowed books never appear in `/books`
- Returning a book makes it available again
- Filtering by year works correctly
- Validation errors are handled properly
- Fastify lifecycle bugs were fixed by correctly returning `reply` in `preHandler`

---

## Running the Server

### 1. Install dependencies

```bash
bun install
```

### 2. Start the server

```bash
bun run start
```

The server will run at:

```
http://localhost:3000
```

---

## Running Tests

This project uses **Bun’s built-in test runner**.

```bash
bun test
```

### What the tests cover

- Listing available books
- Filtering books by year
- Borrowing a book
- Preventing double borrowing
- Returning a book
- Listing a user’s borrowed books
- Validation errors (missing headers, invalid actions)

All tests run **without starting a real HTTP server**.

---

## API Endpoints

### GET `/books`

Returns all available (not borrowed) books.

Optional query:

```
/books?year=2009
```

---

### POST `/loan_book`

Borrow a book if it is available.

**Headers**

```
user_id: 1
```

**Body**

```json
{
  "book_id": "5"
}
```

---

### POST `/return_book`

Return a previously borrowed book.

**Headers**

```
user_id: 1
```

**Body**

```json
{
  "book_id": "5"
}
```

---

### GET `/my_books`

Returns books borrowed by the current user.

**Headers**

```
user_id: 1
```

---

## Key Learning Outcomes

- Using **Bun** as a backend runtime
- Loading files with `Bun.file`
- Building testable Fastify applications
- Understanding Fastify’s request lifecycle
- Writing meaningful API tests
- Structuring backend projects correctly
- Debugging real lifecycle and state bugs

---

## Final Notes

- No database is used — all data is **in memory**
- Restarting the server resets all loans
- This is intentional for learning purposes
- The structure is ready to be extended with a real database later

---

This project was created using `bun init` with Bun v1.3.6.
[Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
