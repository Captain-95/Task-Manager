# Task Manager

A full-stack Task Management application built using Spring Boot and Angular. The application provides secure authentication, role-based authorization, task management, dashboard analytics, and a responsive user interface.

---

## Features

- JWT Authentication
- Role-Based Access Control (Admin/User)
- Dashboard with Analytics
- Create, Update and Delete Tasks
- Mark Tasks as Completed
- Search and Filter Tasks
- Responsive User Interface
- RESTful APIs
- Angular Material Design

---

## Technology Stack

### Backend

- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- H2 Database
- Maven

### Frontend

- Angular
- Angular Material
- TypeScript
- RxJS
- Chart.js
- SCSS

---

## Project Structure

```text
task-manager
│
├── task-manager-backend
│   ├── src
│   ├── pom.xml
│   └── ...
│
└── task-manager-frontend
    ├── src
    ├── angular.json
    ├── package.json
    └── ...
```

---

## Prerequisites

- Java 17
- Maven
- Node.js 20+
- Angular CLI

---

## Clone Repository

```bash
git clone https://github.com/<your-username>/task-manager.git

cd task-manager
```

---

## Backend Setup

Navigate to the backend project.

```bash
cd task-manager-backend
```

Run the application.

```bash
mvn spring-boot:run
```

Backend URL

```
http://localhost:8080
```

H2 Database Console

```
http://localhost:8080/h2-console
```

---

## Frontend Setup

Navigate to the frontend project.

```bash
cd task-manager-frontend
```

Install dependencies.

```bash
npm install
```

Run the application.

```bash
ng serve
```

Frontend URL

```
http://localhost:4200
```

---

## Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| user | user123 | USER |

---

## Application Features

### Authentication

- User Login
- JWT Token Authentication
- Role-Based Authorization

### Dashboard

- Total Tasks
- Pending Tasks
- Completed Tasks
- Tasks Created Today
- Task Status Chart
- Weekly Activity Chart

### Task Management

- Create Task
- Update Task
- Delete Task (Admin Only)
- Mark Task as Completed
- Search Tasks
- Filter by Status

---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/login` |
| POST | `/api/auth/register` |

### Dashboard

| Method | Endpoint |
|---------|----------|
| GET | `/api/dashboard/summary` |

### Tasks

| Method | Endpoint |
|---------|----------|
| GET | `/api/tasks` |
| POST | `/api/tasks` |
| PUT | `/api/tasks/{id}` |
| PUT | `/api/tasks/{id}/status` |
| DELETE | `/api/tasks/{id}` |

---

## Screenshots

Add screenshots of the following pages.

- Login
- Dashboard
- Task List
- Add Task Dialog
- Edit Task Dialog

---

## Future Enhancements

- PostgreSQL/MySQL Support
- Docker Deployment
- Email Notifications
- Task Priority
- Due Date Management
- User Profile Management

---

## Author

Sahil Shrivastava

Java Full Stack Developer
