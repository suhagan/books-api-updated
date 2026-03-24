# Skriftlig dokumentation

**Kurs: Backendutveckling och API-design med säkerhetsfokus — 50 yhp**
**Program: Fullstack Developer Open Source, Yrkeshögskola**
**Klass: FOS25**

Namn: Suhagan Mostahid
Datum: 18 Mars 2026

### Databastyper (kursmål 2)

1. What are the different types of databases? Briefly describe the most common database types and their main uses.

Answer:
There are several different types of databases, but the most common are relational databases, document databases, key-value databases, and graph databases.

- Relational databases (SQL) such as PostgreSQL and MySQL store data in tables with rows and columns. They are good when data has clear relationships and strong consistency requirements.

- Document databases (NoSQL) such as MongoDB store data as JSON-like documents. They are useful when the data structure is flexible.

- Key-value databases like Redis store simple key–value pairs and are often used for caching.

- Graph databases such as Neo4j are designed to store and analyze relationships between entities, for example in social networks.

Each database type is used depending on the structure of the data and performance requirements.

2. Which database type have you chosen for your project? Justify your choice by comparing it with at least one alternative database type. Describe at least one advantage and one disadvantage that the database type has given you in your project.

Answer:
In the project, PostgreSQL is chosen, which is a relational database.

This fits well because the system has clear relationships between books, customers, orders, and order_items.

Compared to a document database like MongoDB, PostgreSQL gives stronger data integrity through foreign keys and constraints.

Advantage: strong data consistency and structured relationships.
Disadvantage: schema changes require more planning compared to flexible NoSQL databases.

### Skalbarhet och arkitektur (kursmål 8)

3. Imagine that your backend service is used by a very large audience with high demands on availability, performance and reliability. It is also critical that no requests are dropped. Describe and justify how you would design or further develop your architecture to:

- handle high load
- ensure high availability
- avoid lost requests
- maintain good response time
  Give at least 2 examples of measures you would take to meet this need.

Answer:
If the backend service were to be used by a very large audience, it would be necessary to further develop the architecture to handle high load, high availability, and secure handling of requests.

Handle high load:
Make the API horizontally scalable by running multiple instances behind a load balancer. This distributes traffic and handles more concurrent users.

Ensure high availability:
Use multiple instances of the application and database with redundancy and backups. If one instance fails, another can take over. Containerization (e.g., Docker/Kubernetes) can improve stability.

Avoid lost requests:
Use a message queue (e.g., RabbitMQ or Kafka) for critical operations. This ensures requests are processed even if a service crashes.

Maintain good response time:
Use caching for frequently requested data and optimize database queries with indexing.

Two concrete actions I would therefore take are:

- Introduce a load balancer and multiple API instances to handle high load and increase availability.
- Introduce a message queue for critical operations, so that requests are not lost even if the system is temporarily under high load or a process goes down.

The architecture will become both more robust, scalable and reliable.

4. Describe how your Node.js project is structured. What layers or modules have you divided the code into, and why? Explain how your structure helps make the code easier to maintain or develop. Describe your project structure and justify at least one structural choice. If you have followed a named design pattern, describe how your structure follows this pattern and explain the benefits of it.

Answer:
My Node.js project is structured in several clear layers to separate responsibilities and make the code easier to maintain and develop.

The project includes the following parts:

- routes: The route layer defines API endpoints and which controllers to call. Schema validation and middleware are also included here, such as protected routes.
- controllers: The controller layer handles HTTP requests and responses. Controllers receive the request, forward the work to the service layer, and return the result to the client.
- services: The service layer contains the business logic. For example, there are rules for order handling, validation of logic, token flow, and other central functionality. This keeps the controllers thin.
- repositories: The repository layer contains the database calls. This is where SQL queries and the interaction with PostgreSQL are located. This way, database code is not mixed with business logic.
- schemas: Validation rules for incoming data are defined in schemas. This allows incorrect request bodies to be stopped early.
- db: The DB layer handles the connection to PostgreSQL and is used by repositories to run SQL queries.
- errors: The Error layer contains central error handling and standardized API errors, which means that the application returns consistent error messages.
- auth: In auth, I have collected authentication, JWT logic, and middleware for protected routes.

This structure in practice follows a layer-based design pattern and also uses clear features of the Repository Pattern. The advantage of this is that each part has a clear responsibility. For example, if you want to change the database logic, the repositories are primarily affected, while the route and controller layers can remain unchanged.

An important structural choice in the project is precisely the separation between controller, service, and repository. This makes the code more testable, more readable, and easier to extend with new resources or functions without the entire system becoming difficult to overview.

### Säkerhet (kursmål 3)

5. Describe common security threats to web applications (e.g. from the OWASP Top 10). Briefly explain how each threat works and what the consequences of exploiting it could be. Describe at least 2 threats.

Answer:
Two common security threats to web applications are injection attacks and poor authentication/authorization.

- Injection, such as SQL injection, involves an attacker submitting malicious input that is interpreted as part of a database query or other internal logic. If the application does not handle input securely, the attacker can read, modify, or delete data in the database. The consequences can be data leaks, corrupted data, or full control over certain parts of the system.

Poor authentication and authorization means that the system does not properly check identity or authorization. If routes are not properly protected, unauthorized users can access sensitive functions. The consequences can be that someone creates, modifies, or deletes data without permission, or gains access to other users' information.

A third common threat is DoS or overload, where an attacker sends many requests to make the system slow or unavailable. The consequences are poor availability and, in the worst case, downtime.
One can also mention security flaws in headers and configuration, where the application lacks protection that reduces the risk of, for example, certain types of script attacks or insecure cross-origin calls.

6. What security measures have you implemented in your API? Describe how each measure protects against a specific threat and justify why you chose these particular measures. If you see gaps or missing protections in your current implementation, describe what you would have added given more time. Describe at least 2 measures and identify at least 1 gap.

Answer:
In my project, I have implemented several security measures in the API.

The first is JWT-based authentication. I use registration and login to create access tokens and refresh tokens. Then, certain routes are protected so that only authenticated users can call them. This protects against unauthorized access and reduces the risk that anyone can create, modify, or delete data.

The second measure is rate limiting. It limits how many requests can be sent during a certain period of time. This protects against overloading, brute force-like behavior, and other types of API abuse.

The third measure is Helmet, which adds secure HTTP headers. This strengthens the basic security of the application and reduces the risk of certain types of attacks associated with insecure headers or browser behavior.

The fourth measure is CORS configuration, which controls which clients are allowed to call the API from other origins. This is important to avoid exposing the API to unwanted cross-origin usage.
In addition to this, I also use schema validation of request bodies. This stops incorrect or unexpected data early before it reaches business logic or the database. I also use parameterized database queries, which helps reduce the risk of SQL injection.

I chose these measures because they are relatively easy to implement but provide clear security benefits directly in a REST API.

A shortcoming of the current implementation is that I do not yet have full role-based access control on all routes. I have users and roles, but with more time I would have added clear rules for, for example, admin-only routes. I could also have added better logging, monitoring, token rotation with even stricter policies and possibly more input sanitization at multiple levels.

### Node.js vs PHP (kursmål 9)

7. Compare Node.js and PHP as backend technologies from the following perspectives: architecture, ecosystem, and performance. Describe similarities and differences. Compare from at least 2 perspectives.

Answer:
Node.js and PHP are both common backend technologies, but they differ in several ways.

- From an architectural perspective, Node.js is built on an event-driven and asynchronous model, which is well suited for APIs and real-time applications with many simultaneous connections. PHP has traditionally been request-based, where each request is handled separately. This makes PHP easy to understand and use in classic web applications, while Node.js often feels more natural for modern APIs and services with a lot of I/O.
- From an ecosystem perspective, both have strong ecosystems. Node.js has npm and a very large selection of packages for modern backend and frontend workflows. PHP also has a mature ecosystem with, for example, Composer and frameworks such as Laravel and Symfony. PHP's ecosystem is particularly strong in the traditional web and CMS world, while Node.js is often stronger in JavaScript-based full-stack projects.
- From a performance perspective, Node.js can be very efficient for many simultaneous I/O-bound requests because it uses a non-blocking model. PHP can also perform well, especially in modern environments, but the working model is different. For real-time functions and APIs with many parallel connections, Node.js often has an advantage. For more traditional web applications, PHP works very well and can be easier to deploy in some contexts.

The similarity between them is that both can be used to build REST APIs, manage databases, authentication, and business logic. The main difference lies in the programming model, ecosystem focus, and how they are typically used in practice.

8. Which of the technologies (Node.js or PHP) do you prefer for backend development? Justify your choice and describe in which type of project one technology would have been better suited than the other.

Answer:
I prefer Node.js for backend development, especially in projects like this.

The main reason is that Node.js is very well suited for modern REST APIs and that it feels efficient to be able to work in the same language family as frontend development, i.e. JavaScript/TypeScript. In my project with Bun and Fastify, it has been clear how easy it is to build routes, middleware, authentication and database logic in a structured way.

Node.js is particularly well suited for projects where we want to build:

- APIs
- real-time services
- apps with many simultaneous requests
- full-stack solutions where frontend and backend share a technology stack

PHP, on the other hand, is often better suited for more traditional web projects, especially where you use established PHP frameworks or CMS solutions. For example, if you are building a content-heavy website, an administrative system or something that will be integrated into a mature PHP ecosystem, PHP can be a very good choice.

I would therefore say that Node.js is my first choice for modern API-driven backend projects, while PHP is a strong option for classic web applications and projects where the PHP ecosystem provides clear advantages.
