# Task Manager - Backend

Spring Boot backend for the Full Stack Developer Assignment (Task Management App).

## Tech Stack
Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA, H2 (in-memory, auth tables only), JWT (jjwt), Lombok, Bean Validation.

## Approach (state & structure)

**Tasks are kept in a plain in-memory store** (`TaskStore`, backed by a
`ConcurrentHashMap`) — no relational table, exactly as the assignment specifies.
It seeds 3 sample tasks on startup and resets on every restart.

**Auth is table-based** since multi-role login was also asked for. Three tables
back it, using H2 in an in-memory mode so there's still zero setup:
- `roles` — master list (`ROLE_ADMIN`, `ROLE_USER`)
- `users` — username + bcrypt-hashed password
- `user_roles` — join table linking a user to one or more roles

This keeps roles reusable and makes assigning multiple roles to one user a
single extra row, instead of hard-coding role strings on the user.

**JWT flow**: `POST /api/auth/login` validates credentials via Spring Security's
`AuthenticationManager`, then `JwtUtil` issues a signed token (HS256) carrying
the username and roles as claims. `JwtAuthFilter` runs once per request,
reads the `Authorization: Bearer <token>` header, validates the token, and
populates the `SecurityContext` so `@PreAuthorize` / `hasRole(...)` checks work.
Sessions are stateless (`SessionCreationPolicy.STATELESS`) — the frontend is
expected to store the token (e.g. in `localStorage`) and send it on every call.

**Validation**: request DTOs use `@NotBlank` / `@Size`, enforced via `@Valid`.
A `GlobalExceptionHandler` turns validation errors, missing tasks, duplicate
usernames, and bad credentials into clean JSON error responses instead of
stack traces.

## Default users (seeded on startup)
| Username | Password  | Roles                  |
|----------|-----------|-------------------------|
| admin    | admin123  | ROLE_ADMIN, ROLE_USER   |
| user     | user123   | ROLE_USER               |

## Run it
```bash
mvn spring-boot:run
```
App starts on `http://localhost:8080`.

## API Endpoints

### Auth
| Method | Endpoint             | Auth | Notes                          |
|--------|-----------------------|------|---------------------------------|
| POST   | /api/auth/login       | -    | returns JWT + username + roles |
| POST   | /api/auth/register    | -    | optional roles, defaults to ROLE_USER |

### Tasks
| Method | Endpoint                 | Auth        | Notes                    |
|--------|--------------------------|-------------|---------------------------|
| GET    | /api/tasks               | any user    | list all tasks           |
| POST   | /api/tasks               | any user    | name required             |
| PUT    | /api/tasks/{id}/status   | any user    | body: `{ "status": "COMPLETED" }` |
| DELETE | /api/tasks/{id}          | ADMIN only  |                            |

### Dashboard
| Method | Endpoint               | Auth     | Notes                                    |
|--------|------------------------|----------|--------------------------------------------|
| GET    | /api/dashboard/summary | any user | `{ totalTasks, pendingTasks, completedTasks }` |

## Sample request
```
POST /api/auth/login
{ "username": "admin", "password": "admin123" }

-> 200 OK
{ "token": "eyJ...", "type": "Bearer", "username": "admin", "roles": ["ROLE_ADMIN","ROLE_USER"] }
```
Then call any `/api/**` endpoint with header:
```
Authorization: Bearer eyJ...
```
