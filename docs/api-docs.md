# API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://taskflow-api.vercel.app`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-14T12:00:00.000Z"
  }
}
```

### Login User
Authenticate and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-14T12:00:00.000Z"
  }
}
```

### Get User Profile
Retrieve the authenticated user's profile.

**Endpoint:** `GET /api/auth/profile`

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-14T12:00:00.000Z",
    "updatedAt": "2024-01-14T12:00:00.000Z"
  }
}
```

### Update User Profile
Update the authenticated user's profile.

**Endpoint:** `PUT /api/auth/profile`

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "name": "John Smith",
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Smith",
    "createdAt": "2024-01-14T12:00:00.000Z",
    "updatedAt": "2024-01-14T14:00:00.000Z"
  }
}
```

---

## Task Endpoints

### Get All Tasks
Retrieve all tasks for the authenticated user with optional filters.

**Endpoint:** `GET /api/tasks`

**Headers:** `Authorization: Bearer <token>` (required)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (Pending, In Progress, Completed) |
| priority | string | Filter by priority (High, Medium, Low) |
| category | string | Filter by category |
| search | string | Search in title and description |
| sortBy | string | Sort field (title, priority, status, dueDate, createdAt, updatedAt) |
| sortOrder | string | Sort order (ASC, DESC) |

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API docs",
      "category": "Work",
      "priority": "High",
      "status": "In Progress",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "createdAt": "2024-01-14T12:00:00.000Z",
      "updatedAt": "2024-01-14T12:00:00.000Z",
      "userId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

### Create Task
Create a new task.

**Endpoint:** `POST /api/tasks`

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "category": "Work",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "category": "Work",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-14T12:00:00.000Z",
    "updatedAt": "2024-01-14T12:00:00.000Z",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Get Task by ID
Retrieve a specific task.

**Endpoint:** `GET /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
{
  "success": true,
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "category": "Work",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-14T12:00:00.000Z",
    "updatedAt": "2024-01-14T12:00:00.000Z",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Update Task
Update an existing task.

**Endpoint:** `PUT /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "Completed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Updated task title",
    "description": "Write comprehensive README and API docs",
    "category": "Work",
    "priority": "High",
    "status": "Completed",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-14T12:00:00.000Z",
    "updatedAt": "2024-01-14T14:00:00.000Z",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Delete Task
Delete a task.

**Endpoint:** `DELETE /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Get Task Statistics
Get statistics about the user's tasks.

**Endpoint:** `GET /api/tasks/stats`

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "total": 25,
    "pending": 10,
    "inProgress": 8,
    "completed": 7,
    "highPriority": 5,
    "mediumPriority": 12,
    "lowPriority": 8,
    "overdue": 3,
    "dueSoon": 4,
    "byCategory": {
      "Work": 15,
      "Personal": 10
    },
    "recentlyCompleted": 3,
    "completionRate": 28
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```
