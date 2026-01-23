# Books API (Bun + Fastify)

This project is a **learning-focused backend API** built with **Bun** and **Fastify**.
It demonstrates how to structure a small API using **in-memory data**, **JSON loading**, **request validation**, and **test-driven development**.

The assignment requirements were:

1. Load books from a JSON file and keep them in memory
2. Allow users to borrow books only if they are available
3. Allow users to return borrowed books
4. List available books
   - all available books
   - filter available books by year

All requirements are fully implemented and tested.

---

## Why this project exists

This project is designed as a **Boiler Room exercise**, meaning:

- The code is intentionally **incomplete at first**
- You must **read requirements carefully**
- You improve structure, correctness, and testability step by step
- Learning is prioritized over “quick hacks”

---

## Old Project Structure

Initially, the project had the following problems:

```text
src/
├─ index.ts
├─ routes.ts
├─ controllers.ts
├─ schemas.ts
└─ types.ts
```

### Issues with the old structure

- `books` array was **empty** (JSON was never loaded)
- `/books` endpoint crashed intentionally
- `/my_books` pointed to the wrong controller
- No way to return books
- Business logic and data lived in the same file
- No test setup (despite being a Bun project)
- Server could not be reused in tests

This made the project **hard to test, hard to reason about, and incomplete**.

---

## Modified Structure (After Refactoring)

The project is restructured to support **clarity, testability, and separation of concerns**:

```text
books-api/
├─ src/
│  ├─ data/
│  │  ├─ store.ts          # In-memory data store (books, users, loans)
│  │  └─ books-loader.ts   # Loads books.json using Bun.file
│  │
│  ├─ __tests__/
│  │  └─ books-api.test.ts # Full API tests using bun:test
│  │
│  ├─ controllers.ts       # Request handlers (logic only)
│  ├─ routes.ts            # API routes + validation
│  ├─ schemas.ts           # JSON schemas for request validation
│  ├─ types.ts             # Shared TypeScript types
│  ├─ server.ts            # Builds Fastify server (used by tests)
│  └─ index.ts             # Starts the HTTP server
│
├─ books.json              # Source of truth for book data
├─ package.json
├─ bun.lock
├─ tsconfig.json
├─ README.md
└─ .gitignore
```

---

## Reason behind these changes

### Separation of concerns

- **Data loading** is isolated (`books-loader.ts`)
- **In-memory state** is centralized (`store.ts`)
- **Controllers** contain logic only
- **Routes** only define HTTP behavior

### Testability

- `server.ts` allows the server to be created **without listening on a port**
- Tests use `fastify.inject()` instead of real HTTP calls
- Bun’s built-in test runner (`bun:test`) is used

### Correctness

- Books are actually loaded from `books.json`
- Borrowed books are excluded from `/books`
- Returning a book makes it available again
- Query filtering (`?year=`) works correctly
- Input validation is enforced with schemas

---

## Way to run the server

### 1️ Install dependencies

```bash
bun install
```

### 2️ Start the server

```bash
bun run start
```

Server will run at:

```
http://localhost:3000
```

---

## Way to run tests

This project uses **Bun’s built-in test runner**.

```bash
bun test
```

### Tests

- Listing available books
- Filtering by year
- Borrowing a book
- Preventing double borrowing
- Returning a book
- Listing a user’s borrowed books
- Validation errors (missing headers, invalid actions)

All tests run **without opening a real network port**.

---

## API Endpoints Overview

### GET `/books`

Returns all **available** (not borrowed) books.

Optional query:

```
/books?year=2009
```

---

### POST `/loan_book`

Borrow a book if available.

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

List books borrowed by the current user.

**Headers**

```
user_id: 1
```

---

## Manual Testing with Insomnia

It can be possible to fully test the API using **Insomnia**:

Recommended flow:

1. `GET /books`
2. `POST /loan_book`
3. `GET /my_books`
4. `POST /return_book`
5. `GET /books` again (book should be available)

Use `user_id` as a request header in all user-specific endpoints.

---

## Key Learning Outcomes

- Using **Bun as a backend runtime**
- Loading files with `Bun.file`
- Building testable Fastify servers
- Writing meaningful API tests
- Structuring small projects correctly
- Thinking in **requirements, not just code**

---

## Final Notes

- No database is used — everything is **in-memory**
- Restarting the server resets loans
- This is intentional and suitable for learning/testing
- The structure is easily extendable to a real DB later

---

This project was created using `bun init` in bun v1.3.6. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
