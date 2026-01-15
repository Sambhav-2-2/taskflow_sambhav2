# TaskFlow - Task Management System

## Overview

TaskFlow is a modern, full-stack task management application that helps individuals and small teams efficiently organize, track, and manage their daily tasks and responsibilities. Built with a focus on user experience, security, and reliability, TaskFlow provides a clean, intuitive interface for managing tasks with features like categorization, priority levels, due dates, and comprehensive statistics.

##  Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **API Documentation**: Swagger UI (swagger-jsdoc, swagger-ui-express)
- **CORS**: cors middleware

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel (Serverless Functions)
- **Version Control**: Git & GitHub

## ✨ Features Implemented

### Core Features
-  User Registration & Login
-  JWT-based Authentication
-  Protected Routes
-  Create, Read, Update, Delete Tasks
-  Task Categories/Tags
-  Task Priority Levels (High, Medium, Low)
-  Due Date Functionality
-  Task Status (Pending, In Progress, Completed)

### Dashboard Features
-  Task Statistics Dashboard
-  Filter by Status, Priority, Category
-  Search Functionality
-  Quick Add Task Form
-  Visual Task Analytics

### UI/UX Features
-  Responsive Design (Mobile, Tablet, Desktop)
-  Dark/Light Mode Support
-  Loading States & Skeleton Loaders
-  Toast Notifications
-  Form Validation
-  Error Handling
-  Smooth Animations & Transitions

## Project Structure

```
taskflow/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Page Components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── services/       # API Service Layer
│   │   ├── utils/          # Utility Functions
│   │   └── styles/         # Global Styles
│   ├── public/
│   └── package.json
│
├── server/                 # Backend Express Application
│   ├── config/             # Configuration Files
│   ├── controllers/        # Route Controllers
│   ├── middleware/         # Custom Middleware
│   ├── models/             # Database Models
│   ├── routes/             # API Routes
│   ├── utils/              # Utility Functions
│   ├── database.sqlite     # SQLite Database File
│   └── package.json
│
├── docs/                   # Documentation
│   └── api-docs.md
│
└── README.md
```

##  Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sambhav-2-2/taskflow_sambhav2.git
   cd taskflow_sambhav2
   ```

2. **Navigate to server directory**
   ```bash
   cd server
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   ```

5. **Configure environment variables**
   ```env
   PORT=5000
   JWT_SECRET=yoursecret
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

6. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure API endpoint**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

##  Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT CHECK(priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  status TEXT CHECK(status IN ('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
  dueDate TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

##  API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Task Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| GET | `/api/tasks/stats` | Get task statistics | Yes |
| GET | `/api/tasks/:id` | Get specific task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Request/Response Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Create Task
```bash
POST /api/tasks
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "category": "Work",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```



##  Challenges and Solutions

### Challenge 1: Real-time Statistics Update

**Problem**: When tasks were created, updated, or deleted, the dashboard statistics weren't reflecting the changes immediately, leading to a poor user experience.

**Solution**: Implemented a centralized state management approach using React Context API. Created a `TaskContext` that maintains the task list and provides update functions. When any CRUD operation is performed, the context automatically triggers a re-fetch of statistics, ensuring the dashboard always displays accurate data. Additionally, implemented optimistic updates for better perceived performance.

### Challenge 2: Responsive Design with Complex Data Tables

**Problem**: The task list table looked great on desktop but was nearly unusable on mobile devices. Traditional responsive techniques weren't sufficient for the data-heavy table layout.

**Solution**: Implemented a hybrid approach using Tailwind CSS:
1. On desktop (≥768px): Display tasks in a traditional table format with all columns visible
2. On mobile (<768px): Transform the table into a card-based layout where each task becomes a stacked card with key information prominently displayed
3. Added collapsible sections for less critical information on mobile
4. Implemented touch-friendly action buttons with appropriate sizing

This approach maintained full functionality across all device sizes while providing an optimal viewing experience.

### Challenge 3: JWT Token Management

**Problem**: Managing JWT tokens securely while maintaining a smooth user experience, especially handling token expiration and refresh scenarios.

**Solution**: Implemented a robust token management system:
1. Store JWT token in localStorage for persistence across sessions
2. Created an Axios interceptor that automatically attaches the token to all API requests
3. Implemented automatic logout when receiving a 401 response, with user-friendly notification
4. Added loading states during authentication checks to prevent flash of unauthenticated content
5. Protected routes that redirect to login when no valid token is present

##  Future Enhancements

- [ ] Task sharing and collaboration
- [ ] Email notifications for due dates
- [ ] Recurring tasks
- [ ] Task attachments
- [ ] Calendar view
- [ ] Mobile app (React Native)
- [ ] Dark mode toggle
- [ ] Export tasks to CSV/PDF



##  Author

**Your Name**
- GitHub: [@Sambhav-2-2](https://github.com/Sambhav-2-2)

