# Books API — Secure REST Backend

**Bun + Fastify + PostgreSQL + Docker + JWT Authentication**

Started this project as a **learning REST API using in-memory data**, then evolved into a **database-backed backend**, and finally into a **secure API system** for the **Backend Development & API Security Examination Assignment**.

The final system demonstrates:

- REST API design
- Layered backend architecture
- PostgreSQL relational database
- JWT authentication
- Route protection
- Security middleware
- Dockerized environment
- API validation
- Multi-language API understanding (PHP demo)

---

# Project Evolution

This repository shows the **progression of backend development concepts**.

### Phase 1 — Learning API

Initial version:

- In-memory state
- JSON file loading
- Simple borrowing logic
- No database
- Basic API structure

---

### Phase 2 — Database Backend

The API was upgraded to use **PostgreSQL + Docker**.

New features:

- Persistent relational database
- Repository pattern
- Service layer business logic
- Order system with stock management
- Foreign keys and constraints
- Integration testing

---

### Phase 3 — Security & Examination Requirements

The final version adds **security and authentication features required by the examination**.

New additions:

- JWT authentication
- Access & refresh tokens
- Protected routes
- Security middleware
- Rate limiting
- Helmet HTTP security headers
- CORS configuration
- Standardized API error handling
- PHP API demo

This final version represents a **production-style secure backend**.

---

# Technology Stack

| Component        | Technology               |
| ---------------- | ------------------------ |
| Backend runtime  | Bun                      |
| Web framework    | Fastify                  |
| Database         | PostgreSQL               |
| Containerization | Docker                   |
| Authentication   | JWT                      |
| Validation       | Fastify JSON Schema      |
| Security         | Helmet, CORS, Rate Limit |
| Testing          | Bun test runner          |
| Demo API         | PHP                      |

---

# Project Structure

```text
books-api-updated/
│
├─ src/
│
│  ├─ auth/
│  │  ├─ auth.routes.ts
│  │  ├─ auth.service.ts
│  │  ├─ auth.repository.ts
│  │  └─ auth-middleware.ts
│
│  ├─ db/
│  │  └─ client.ts
│
│  ├─ repositories/
│  │  ├─ books.repository.ts
│  │  ├─ customers.repository.ts
│  │  └─ orders.repository.ts
│
│  ├─ services/
│  │  ├─ books.service.ts
│  │  ├─ customers.service.ts
│  │  └─ orders.service.ts
│
│  ├─ controllers/
│  │  ├─ books.controller.ts
│  │  ├─ customers.controller.ts
│  │  └─ orders.controller.ts
│
│  ├─ routes/
│  │  ├─ books.routes.ts
│  │  ├─ customers.routes.ts
│  │  └─ orders.routes.ts
│
│  ├─ schemas/
│  │  ├─ books.schemas.ts
│  │  ├─ customers.schemas.ts
│  │  └─ orders.schemas.ts
│
│  ├─ errors/
│  │  ├─ api-error.ts
│  │  └─ error-handler.ts
│
│  ├─ server.ts
│  └─ index.ts
│
├─ sql/
│  ├─ initial.sql
│  ├─ books.sql
│  └─ orders.sql
│
├─ php/
│  └─ index.php
│
├─ docker-compose.yml
├─ .env
├─ package.json
└─ README.md
```

---

# Architecture Overview

The backend follows a **clean layered architecture**.

### Repository Layer

Responsible for:

- SQL queries
- Database access
- Data persistence

No business logic.

---

### Service Layer

Handles:

- Business rules
- Validation
- Order logic
- Stock updates
- Token generation

---

### Controller Layer

Responsible for:

- Handling HTTP requests
- Calling services
- Returning responses

---

### Route Layer

Defines:

- API endpoints
- Schema validation
- Authentication middleware

---

### Security Layer

Includes:

- JWT authentication
- Protected routes
- Rate limiting
- Helmet security headers
- Standardized error responses

---

# Database Schema

Tables used:

- `books`
- `customers`
- `orders`
- `order_items`
- `users` (authentication)

Relationships:

```
customers → orders
orders → order_items
books → order_items
```

Foreign keys ensure **data integrity**.

---

# Running the Project

## Start PostgreSQL

```bash
docker compose up -d
```

---

## Apply Database Schema

```bash
docker exec -i books_api_pg psql -U postgres -d postgres < sql/initial.sql
docker exec -i books_api_pg psql -U postgres -d postgres < sql/books.sql
docker exec -i books_api_pg psql -U postgres -d postgres < sql/orders.sql
```

---

## Start the API

```bash
bun run src/index.ts
```

Server runs on:

```
http://localhost:3000
```

---

# Environment Configuration

`.env`

```env
DATABASE_URL=postgresql://postgres:hemligt@127.0.0.1:5432/postgres

JWT_ACCESS_SECRET=supersecretaccess
JWT_REFRESH_SECRET=supersecretrefresh
```

---

# Authentication Endpoints

## Register

```
POST /auth/register
```

Creates a new user.

---

## Login

```
POST /auth/login
```

Returns:

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

## Refresh Token

```
POST /auth/refresh
```

Generates a new access token.

---

# Protected Routes

Routes requiring authentication:

```
POST   /books
PUT    /books/:id
DELETE /books/:id

POST   /customers
DELETE /customers/:id

POST   /orders
```

Authentication header:

```
Authorization: Bearer <accessToken>
```

---

# Security Features

This API includes several security mechanisms:

### JWT Authentication

Access tokens protect sensitive endpoints.

---

### Helmet

Adds secure HTTP headers:

- XSS protection
- Content Security Policy
- HSTS

---

### Rate Limiting

Limits excessive requests.

Example:

```
100 requests per minute
```

---

### CORS

Allows safe cross-origin requests.

---

### JSON Schema Validation

All request bodies are validated before reaching business logic.

---

# API Endpoints

### Books

```
GET /books
GET /books/:id
POST /books (protected)
PUT /books/:id (protected)
DELETE /books/:id (protected)
```

---

### Customers

```
GET /customers
GET /customers/:id
POST /customers (protected)
DELETE /customers/:id (protected)
```

---

### Orders

```
GET /orders
GET /customers/:id/orders
POST /orders (protected)
```

---

# PHP API Demo

To demonstrate **API principles in another language**, a small PHP API is included.

Start PHP server:

```bash
php -S localhost:8000
```

Test:

```
GET /php/health
GET /php/books
POST /php/books
```

This demonstrates:

- routing
- request handling
- JSON responses

---

# Running Tests

```bash
bun test
```

Tests verify:

- books endpoints
- customers endpoints
- order creation
- stock updates
- database integration

---

# Key Learning Outcomes

This project demonstrates understanding of:

- REST API design
- Secure backend development
- PostgreSQL relational modeling
- Dockerized infrastructure
- Authentication and authorization
- API validation
- Error handling
- Multi-language API concepts

---

# Final Status

The system now includes:

- secure authentication
- database-backed persistence
- protected routes
- layered architecture
- production-style backend practices

---

# Author

**Suhagan Mostahid**
