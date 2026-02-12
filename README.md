# Books API (Bun + Fastify + PostgreSQL + Docker)

This project has evolved from an **in-memory learning API** into a **real database-backed production-style backend**. This **database-backed REST API** is built with:

- **Bun**
- **Fastify**
- **PostgreSQL**
- **Docker**
- **Bun test runner**

It demonstrates how to design, structure, and test a real backend using:

- SQL schema design
- Repository pattern
- Service layer business logic
- Dockerized Postgres
- Integration testing with Fastify.inject()
- Clean separation of concerns

---

# Project Evolution

This project originally used:

- In-memory state
- JSON file loading
- Simple borrowing logic

It has now been upgraded to:

- Real PostgreSQL database
- Proper relational schema
- Order creation with stock management
- Foreign keys and constraints
- Transaction-ready structure
- Docker-based environment

This reflects real-world backend architecture.

---

# Evolved Structure

```text
books-api-updated/
├─ src/
│  ├─ db/
│  │  └─ client.ts
│  │
│  ├─ repositories/
│  │  ├─ books.repository.ts
│  │  ├─ customers.repository.ts
│  │  └─ orders.repository.ts
│  │
│  ├─ services/
│  │  ├─ books.service.ts
│  │  ├─ customers.service.ts
│  │  └─ orders.service.ts
│  │
│  ├─ controllers/
│  │  ├─ books.controller.ts
│  │  ├─ customers.controller.ts
│  │  └─ orders.controller.ts
│  │
│  ├─ routes/
│  │  ├─ books.routes.ts
│  │  ├─ customers.routes.ts
│  │  └─ orders.routes.ts
│  │
│  ├─ schemas/
│  │  ├─ books.schemas.ts
│  │  ├─ customers.schemas.ts
│  │  └─ orders.schemas.ts
│  │
│  ├─ errors/
│  │  ├─ api-error.ts
│  │  └─ error-handler.ts
│  │
│  ├─ __tests__/
│  │  ├─ books.test.ts
│  │  ├─ customers.test.ts
│  │  └─ orders.test.ts
│  │
│  ├─ server.ts
│  └─ index.ts
│
├─ sql/
│  ├─ initial.sql
│  ├─ books.sql
│  └─ orders.sql
│
├─ docker-compose.yml
├─ .env
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

# Architecture Overview

The project follows a layered backend architecture:

### 1️ Repository Layer

- SQL queries only
- No business logic
- Direct database access

### 2️ Service Layer

- Business rules
- Validation
- Stock checking
- Order total calculation

### 3️ Controller Layer

- HTTP request handling
- Calls service layer
- Returns responses

### 4️ Route Layer

- Fastify route registration
- JSON schema validation

### 5️ Database Layer

- PostgreSQL (Docker)
- Relational schema
- Foreign keys
- Indexed columns

---

# Database Schema

Tables:

- `books`
- `customers`
- `orders`
- `order_items`

Relationships:

- orders → customers (FK)
- order_items → orders (FK)
- order_items → books (FK)

Business logic includes:

- Prevent ordering non-existent books
- Prevent ordering if stock is insufficient
- Decrement stock on order creation
- Automatically calculate order total

---

# Running the Project (Docker Setup)

## 1️ Start PostgreSQL container

```bash
docker compose up -d
```

---

## 2️ Apply schema and seed data

```bash
docker exec -i books_api_pg psql -U postgres -d postgres < sql/initial.sql
docker exec -i books_api_pg psql -U postgres -d postgres < sql/books.sql
docker exec -i books_api_pg psql -U postgres -d postgres < sql/orders.sql
```

---

## 3️ Verify tables exist

```bash
docker exec -it books_api_pg psql -U postgres -d postgres -c "\dt"
```

You should see:

- books
- customers
- orders
- order_items

---

# Environment Configuration

`.env` file:

```env
DATABASE_URL=postgresql://postgres:hemligt@127.0.0.1:5432/postgres
```

Bun automatically loads `.env`.

---

# Running the Server

```bash
bun run start
```

Server runs on:

```
http://localhost:3000
```

---

# Running Tests

This project uses **Bun's built-in test runner**.

```bash
bun test
```

---

# What the Tests Verify

### GET /books

- Returns 200
- Returns seeded books

### GET /customers

- Returns 200
- Returns seeded customers

### POST /orders

- Creates order
- Inserts order_items
- Decrements book stock
- Calculates order total
- Returns 201
- Returns numeric order_id

This is a **full integration test**:
HTTP → Controller → Service → Repository → PostgreSQL → back to HTTP

---

# API Endpoints

## GET `/books`

Returns all books.

---

## GET `/customers`

Returns all customers.

---

## POST `/orders`

Create a new order.

Request body:

```json
{
  "customer_id": 1,
  "items": [
    {
      "book_id": 1,
      "quantity": 1
    }
  ]
}
```

Response:

```json
{
  "created": true,
  "order_id": 1,
  "customer_id": 1
}
```

---

# Learning Outcomes

This project demonstrates:

- Dockerized database setup
- SQL schema design
- Foreign key constraints
- Indexing strategy
- Repository pattern
- Service-layer business logic
- Fastify route validation
- Integration testing
- Debugging multi-environment issues
- Handling type mismatches (BIGSERIAL → number)

---

# Real-World Improvements Over Previous Version

| Old Version         | New Version              |
| ------------------- | ------------------------ |
| In-memory state     | PostgreSQL database      |
| JSON file storage   | Relational schema        |
| No persistence      | Persistent Docker volume |
| Simple borrowing    | Full order system        |
| No stock management | Stock decrement logic    |
| Basic tests         | Full integration tests   |

---

# Final Status

All tests pass:

```
3 pass
0 fail
```

The API is fully functional, properly structured, and database-backed.

# Author

Suhagan Mostahid
