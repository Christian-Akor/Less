# LESS Backend API 🚀

> **Task Management API with Node.js, Express, and MongoDB**

A complete, production-ready RESTful API backend for the LESS task management application. Built with Node.js, Express, MongoDB, and JWT authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Project Structure](#project-structure)
- [Demo Account](#demo-account)
- [Deployment](#deployment)

## ✨ Features

- 🔐 **JWT Authentication** - Secure user authentication with JSON Web Tokens
- 👤 **User Management** - Registration, login, profile management
- 📝 **Task Management** - Complete CRUD operations for tasks
- 📁 **Task Groups** - Organize tasks into custom groups with icons and colors
- 📊 **Statistics & Analytics** - Track progress and completion rates
- 🔍 **Search & Filter** - Find tasks by status, priority, group, or search term
- 🛡️ **Input Validation** - Express-validator for request validation
- 🔒 **Password Hashing** - Bcrypt for secure password storage
- 🌱 **Database Seeding** - Pre-populated demo data for testing
- ⚡ **Performance** - Mongoose indexes for optimized queries
- 📝 **Error Handling** - Comprehensive error handling and user-friendly messages

## 🛠️ Tech Stack

- **Runtime:** Node.js (v14+)
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB with Mongoose 8.0.3
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcryptjs 2.4.3
- **Validation:** express-validator 7.0.1
- **CORS:** cors 2.8.5
- **Logging:** morgan 1.10.0
- **Environment:** dotenv 16.3.1

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/less-app
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   APP_NAME=LESS
   ```

4. **Seed the database with demo data**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

The API server will be running at `http://localhost:5000`

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/less-app` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `APP_NAME` | Application name | `LESS` |

### MongoDB Connection Strings

**Local MongoDB:**
```
mongodb://localhost:27017/less-app
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/less-app
```

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/logout` | Logout user | ✅ |

### Task Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks (with filters) | ✅ |
| POST | `/api/tasks` | Create new task | ✅ |
| GET | `/api/tasks/stats/today` | Get today's statistics | ✅ |
| GET | `/api/tasks/status/:status` | Get tasks by status | ✅ |
| GET | `/api/tasks/:id` | Get single task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

### Task Group Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/task-groups` | Get all task groups | ✅ |
| POST | `/api/task-groups` | Create task group | ✅ |
| GET | `/api/task-groups/:id` | Get single task group | ✅ |
| PUT | `/api/task-groups/:id` | Update task group | ✅ |
| DELETE | `/api/task-groups/:id` | Delete task group | ✅ |
| GET | `/api/task-groups/:id/tasks` | Get tasks in group | ✅ |

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile with stats | ✅ |
| PUT | `/api/users/profile` | Update user profile | ✅ |
| DELETE | `/api/users/account` | Delete user account | ✅ |

### Request/Response Examples

#### Register User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe&background=8B5CF6&color=fff"
  }
}
```

#### Login User

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@less.app",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "Livia Vaccaro",
    "email": "demo@less.app",
    "avatar": "https://ui-avatars.com/api/?name=Livia+Vaccaro&background=8B5CF6&color=fff"
  }
}
```

#### Create Task

**Request:**
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "status": "in-progress",
  "priority": "high",
  "progress": 50,
  "taskGroup": "60d5ec49f1b2c72b8c8e4f1b",
  "dueDate": "2026-01-25T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the API",
    "status": "in-progress",
    "priority": "high",
    "progress": 50,
    "taskGroup": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "Office Project",
      "icon": "💼",
      "color": "#EC4899"
    },
    "user": "60d5ec49f1b2c72b8c8e4f1a",
    "dueDate": "2026-01-25T00:00:00.000Z",
    "isCompleted": false,
    "createdAt": "2026-01-18T12:00:00.000Z",
    "updatedAt": "2026-01-18T12:00:00.000Z"
  }
}
```

#### Get All Tasks (with filters)

**Request:**
```bash
GET /api/tasks?status=in-progress&priority=high
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "title": "Grocery shopping app design",
      "description": "Design UI/UX for the new grocery shopping mobile application",
      "status": "in-progress",
      "priority": "high",
      "progress": 65,
      "taskGroup": {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "name": "Office Project",
        "icon": "💼",
        "color": "#EC4899"
      },
      "createdAt": "2026-01-18T12:00:00.000Z"
    }
  ]
}
```

#### Get Today's Stats

**Request:**
```bash
GET /api/tasks/stats/today
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTasks": 12,
    "todayTasks": 3,
    "completedTasks": 3,
    "inProgressTasks": 6,
    "todoTasks": 3,
    "completionPercentage": 25,
    "averageProgress": 60
  }
}
```

## 🗄️ Database Models

### User Model

```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  avatar: String (auto-generated from name),
  timestamps: true
}
```

### Task Model

```javascript
{
  title: String (required, max 200 chars),
  description: String (optional, max 1000 chars),
  status: Enum ['todo', 'in-progress', 'completed'],
  priority: Enum ['low', 'medium', 'high'],
  progress: Number (0-100),
  taskGroup: ObjectId (ref: TaskGroup, required),
  user: ObjectId (ref: User, required),
  dueDate: Date (optional),
  isCompleted: Boolean,
  completedAt: Date,
  timestamps: true
}
```

### TaskGroup Model

```javascript
{
  name: String (required, max 100 chars),
  icon: String (default: '📋'),
  color: String (hex format, default: '#8B5CF6'),
  description: String (optional, max 500 chars),
  user: ObjectId (ref: User, required),
  isDefault: Boolean (default: false),
  timestamps: true
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/              # Mongoose models
│   │   ├── User.model.js
│   │   ├── Task.model.js
│   │   └── TaskGroup.model.js
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   ├── taskGroup.controller.js
│   │   └── user.controller.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   ├── taskGroup.routes.js
│   │   └── user.routes.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.middleware.js
│   └── config/              # Configuration files
│       ├── db.js            # MongoDB connection
│       └── seed.js          # Database seeding script
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── server.js               # Server entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔑 Demo Account

After running the seed script, you can use these credentials to test the API:

- **Email:** `demo@less.app`
- **Password:** `password123`

The demo account includes:
- 4 pre-configured task groups (Office, Personal, Study, Fitness)
- 12 sample tasks with various statuses and priorities
- Complete task history and statistics

## 🚀 Deployment

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### Recommended Hosting Platforms

#### Heroku

```bash
# Install Heroku CLI
heroku login
heroku create less-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

#### Render

1. Connect your GitHub repository
2. Set environment variables
3. Auto-deploy on push

### Production Best Practices

- ✅ Use strong, unique JWT secret (at least 32 characters)
- ✅ Use MongoDB Atlas with proper authentication
- ✅ Enable MongoDB connection retry logic
- ✅ Set `NODE_ENV=production`
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Add request logging
- ✅ Use environment variables for all secrets
- ✅ Enable CORS only for trusted domains
- ✅ Keep dependencies updated

## 📝 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with demo data
```

## 🔒 Security Features

- **Password Hashing:** Bcrypt with salt rounds of 10
- **JWT Tokens:** 30-day expiration
- **Protected Routes:** Middleware authentication
- **Input Validation:** Express-validator on all inputs
- **No Password Leaks:** Password field excluded from responses
- **CORS Protection:** Configurable allowed origins
- **Error Handling:** Safe error messages without sensitive data

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running locally
mongod --version

# For MongoDB Atlas, verify:
# - IP whitelist includes your IP (0.0.0.0/0 for development)
# - Database user credentials are correct
# - Connection string is properly formatted
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Christian Akor**
- GitHub: [@Christian-Akor](https://github.com/Christian-Akor)

---

**LESS Backend API** - Do more, stress LESS 💜
