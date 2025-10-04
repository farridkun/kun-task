# Kun Task Manager

A modern task management application built with Vue 3, TypeScript, and Netlify Functions. Features complete authentication, CRUD operations, advanced filtering, and responsive design.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git for version control

### Development Setup

```bash
# Clone and install
git clone <repository-url>
cd kun-task
npm install

# Start API server (Terminal 1)
cd apps/api
npm run dev
# Runs on http://localhost:8000

# Start frontend (Terminal 2)  
cd apps/web
npm run dev
# Runs on http://localhost:5173

# Login credentials
# Admin: admin@example.com / admin123
# User: user@example.com / user123
```

### Production Deployment

```bash
npm run build
netlify deploy --prod
```

## ✨ Features

### 🔐 Authentication System

- JWT-like token authentication
- Persistent login sessions
- Protected route navigation
- Demo accounts ready to use

### 📋 Task Management

- Complete CRUD operations (Create, Read, Update, Delete)
- Advanced filtering by status, priority, and text search
- Multi-column sorting capabilities
- Efficient pagination with navigation
- Responsive mobile-first design

### 🎨 User Experience

- Real-time loading states and error handling
- Toast notifications for user feedback
- Intuitive modal forms for task operations
- Clean, professional interface design
- Mobile and desktop optimized

## 🛠 Tech Stack

### Frontend

- Vue 3 (Composition API) + TypeScript
- Vite (Build tool) + Vue Router (Routing)
- Pinia (State management) + Axios (HTTP client)
- Custom CSS with CSS Variables

### Backend

- Netlify Functions (Serverless)
- Express.js + serverless-http wrapper
- Mock database with sample data
- CORS enabled for cross-origin requests

### Development & Testing

- Vitest (Unit testing framework) ✅ **35 tests implemented**
- ESLint (Code linting)
- TypeScript (Type safety)
- Netlify (Hosting & deployment)

## 🏗 Architecture

### Frontend Architecture

```text
src/
├── components/          # Reusable UI components
│   ├── AppHeader.vue    # Navigation and user info
│   ├── AppTable.vue     # Sortable data table
│   ├── FilterBar.vue    # Task filtering controls
│   ├── PaginationBar.vue # Page navigation
│   ├── TaskForm.vue     # Create/edit task modal
│   ├── Loader.vue       # Loading spinner
│   └── Toast.vue        # Notification messages
├── stores/              # Pinia state management
│   ├── auth.ts          # Authentication state
│   └── tasks.ts         # Task management state
├── services/            # API communication layer
│   ├── http.ts          # Axios configuration
│   ├── auth.ts          # Authentication API
│   └── tasks.ts         # Task CRUD API
├── views/               # Page components
│   ├── LoginView.vue    # Login page
│   ├── TasksView.vue    # Main tasks dashboard
│   └── NotFound.vue     # 404 error page
├── router/              # Vue Router configuration
└── styles/              # Global CSS styles
```

### Authentication Flow

1. User submits login credentials
2. API validates credentials and returns JWT token
3. Token stored in localStorage and Pinia store
4. Router guards protect authenticated routes
5. Axios interceptors attach token to requests
6. Token expiry triggers automatic logout

### Data Flow

1. **Components** dispatch actions to **Pinia stores**
2. **Stores** call **API services** for data operations
3. **Services** use **Axios** to communicate with backend
4. **Response data** updates store state
5. **Components** reactively update based on state changes
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue Components│    │   Pinia Stores  │    │   API Layer     │
│                 │    │                 │    │                 │
│ • Views         │◄──►│ • auth.ts       │◄──►│ • http.ts       │
│ • Components    │    │ • tasks.ts      │    │ • auth.ts       │
│ • Router        │    │                 │    │ • tasks.ts      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │ Netlify Functions│
                                              │                 │
                                              │ • Express API   │
                                              │ • Mock Database │
                                              │ • CORS Support  │
                                              └─────────────────┘
```

### Authentication Flow
1. User submits login credentials
2. Frontend sends POST to `/api/login`
3. Backend validates and returns JWT token + user data
4. Frontend stores token in Pinia store + localStorage
5. Subsequent requests include `Authorization: Bearer <token>` header
6. Backend middleware validates token for protected routes

### Data Flow
1. **Components** dispatch actions to **Pinia stores**
2. **Stores** call **API layer** functions
3. **API layer** makes HTTP requests to **Netlify Functions**
4. **Functions** process requests and return responses
5. **Stores** update reactive state
6. **Components** reactively update UI

## 📁 Project Structure

```
kun-task/
├── netlify.toml                 # Netlify deployment configuration
├── package.json                 # Root workspace configuration
├── .env.example                 # Environment variables template
├── README.md                    # Project documentation
│
├── apps/
│   ├── web/                     # Vue.js frontend application
│   │   ├── src/
│   │   │   ├── api/            # HTTP client and API functions
│   │   │   │   ├── http.ts     # Axios configuration
│   │   │   │   ├── auth.ts     # Authentication API
│   │   │   │   └── tasks.ts    # Tasks API
│   │   │   │
│   │   │   ├── components/     # Reusable Vue components
│   │   │   │   ├── AppHeader.vue
│   │   │   │   ├── AppTable.vue
│   │   │   │   ├── FilterBar.vue
│   │   │   │   ├── PaginationBar.vue
│   │   │   │   ├── Loader.vue
│   │   │   │   └── Toast.vue
│   │   │   │
│   │   │   ├── router/         # Vue Router configuration
│   │   │   │   └── index.ts    # Routes and navigation guards
│   │   │   │
│   │   │   ├── stores/         # Pinia state management
│   │   │   │   ├── auth.ts     # Authentication state
│   │   │   │   └── tasks.ts    # Tasks state
│   │   │   │
│   │   │   ├── styles/         # Global CSS styles
│   │   │   │   ├── variables.css
│   │   │   │   └── globals.css
│   │   │   │
│   │   │   ├── test/           # Unit tests
│   │   │   │   ├── setup.ts    # Test configuration
│   │   │   │   ├── auth.store.test.ts
│   │   │   │   ├── tasks.store.test.ts
│   │   │   │   ├── api.test.ts
│   │   │   │   ├── Loader.test.ts
│   │   │   │   └── utils.test.ts
│   │   │   │
│   │   │   ├── views/          # Page components
│   │   │   │   ├── LoginView.vue
│   │   │   │   ├── TasksView.vue
│   │   │   │   ├── TaskForm.vue
│   │   │   │   └── NotFound.vue
│   │   │   │
│   │   │   ├── main.ts         # Vue app entry point
│   │   │   └── env.d.ts        # TypeScript declarations
│   │   │
│   │   ├── index.html          # HTML template
│   │   ├── vite.config.ts      # Vite configuration
│   │   ├── tsconfig.json       # TypeScript configuration
│   │   ├── vitest.config.ts    # Vitest configuration
│   │   └── package.json        # Frontend dependencies
│   │
│   └── api/                     # Netlify Functions
│       ├── functions/
│       │   └── api.mjs         # Express API wrapped in serverless-http
│       └── package.json        # API dependencies
│
└── db/
    └── indexes.js              # MongoDB index creation script
```

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:8888/.netlify/functions/api`
- **Production**: `https://your-site.netlify.app/.netlify/functions/api`

### Authentication

#### POST `/login`
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "mock.jwt.token.12345",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

**Demo Credentials:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### Tasks API

All task endpoints require authentication header:
```
Authorization: Bearer <token>
```

#### GET `/tasks`
Retrieve paginated list of tasks with optional filtering and sorting.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sort` (string): Sort field (title, status, priority, dueDate, createdAt)
- `order` (string): Sort order (asc, desc, default: desc)
- `status` (string): Filter by status (pending, in-progress, completed)
- `priority` (string): Filter by priority (low, medium, high)
- `q` (string): Text search in title and description

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Task 1",
      "description": "Description for task 1",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2025-10-11T00:00:00.000Z",
      "createdAt": "2025-09-04T00:00:00.000Z",
      "updatedAt": "2025-09-04T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 30,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### POST `/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-10-15T00:00:00.000Z"
}
```

**Response:** Returns created task object (201 Created)

#### PUT `/tasks/:id`
Update an existing task.

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2025-10-20T00:00:00.000Z"
}
```

**Response:** Returns updated task object

#### DELETE `/tasks/:id`
Delete a task.

**Response:** 204 No Content

### Error Responses

All endpoints return appropriate HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (task doesn't exist)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

## 🗄 Database Design

### MongoDB Index Strategy

Even though the current implementation uses in-memory storage, the project includes a comprehensive MongoDB indexing strategy for future database integration.

#### Indexes (`db/indexes.js`)

1. **Text Search Index (`text_title_description`)**
   ```javascript
   { title: "text", description: "text" }
   ```
   - **Purpose**: Enable full-text search across task titles and descriptions
   - **Use Case**: Search functionality in the UI filter bar
   - **Performance**: O(log n) search time for text queries

2. **Compound Query Index (`compound_query`)**
   ```javascript
   { status: 1, priority: 1, dueDate: 1, createdAt: 1 }
   ```
   - **Purpose**: Optimize common filter combinations and sorting
   - **Use Cases**: 
     - Filter by status + priority
     - Sort by due date or creation date
     - Dashboard queries combining multiple filters
   - **Performance**: Covers most UI query patterns efficiently

3. **Due Date Range Index (`dueDate_range`)**
   ```javascript
   { dueDate: 1 }
   ```
   - **Purpose**: Optimize date-based queries and range searches
   - **Use Cases**:
     - Find overdue tasks
     - Tasks due within specific timeframes
     - Calendar view implementations
   - **Performance**: O(log n) for date range queries

4. **Creation Date Index (`createdAt_desc`)**
   ```javascript
   { createdAt: -1 }
   ```
   - **Purpose**: Optimize default task listing (newest first)
   - **Use Cases**:
     - Default task sorting
     - Pagination performance
     - Recent activity queries
   - **Performance**: O(1) for pagination with consistent ordering

#### Index Selection Rationale

- **Query Patterns**: Indexes are designed based on actual UI query patterns
- **Compound Optimization**: The compound index covers multiple filter scenarios
- **Text Search**: Enables flexible search without regex performance penalties
- **Pagination**: Consistent sorting indexes improve pagination performance
- **Future-Proof**: Designed to handle real-world usage patterns at scale

## 🔧 Local Development

### Prerequisites
- Node.js 18+ 
- Git

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/farridkun/kun-task.git>
   cd kun-task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Netlify CLI globally:**
   ```bash
   npm install -g netlify-cli
   ```

4. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

5. **Start development server:**
   ```bash
   npm dev
   ```

   This command:
   - Runs Netlify Dev on `http://localhost:8888`
   - Serves Vue app with HMR
   - Provides Functions at `/.netlify/functions/api`
   - Enables API proxy configuration

6. **Access the application:**
   - Frontend: `http://localhost:8888`
   - API: `http://localhost:8888/.netlify/functions/api`

### Development Commands

```bash
# Start development server
npm dev

# Build for production
npm build

# Preview production build
npm preview

# Run tests
npm test

# Lint code
npm lint

# Install dependencies for specific workspace
npm -C apps/web install
npm -C apps/api install
```

### Hot Reload & Debugging

- **Frontend**: Vite provides instant HMR for Vue components
- **Backend**: Netlify Dev automatically restarts functions on changes
- **State**: Pinia DevTools available in browser extension
- **Network**: Use browser DevTools to inspect API requests

## 🧪 Testing

The project includes a comprehensive unit testing suite using **Vitest** with **35 passing tests** covering all major functionality.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage (from web directory)
cd apps/web && npm run test:coverage
```

### Test Suite Overview

✅ **35 Tests Passing** across 5 test files:

```
src/test/
├── setup.ts              # Test environment configuration
├── auth.store.test.ts     # Authentication store tests (8 tests)
├── tasks.store.test.ts    # Task management store tests (11 tests)
├── api.test.ts           # API service layer tests (7 tests)
├── Loader.test.ts        # Component tests (4 tests)
└── utils.test.ts         # Utility function tests (5 tests)
```

### Test Coverage Areas

**✅ Comprehensive Coverage:**
- **Authentication Flow**: Login, logout, token persistence, error handling
- **Task CRUD Operations**: Create, read, update, delete with validation
- **State Management**: Pinia stores with proper state transitions
- **API Communication**: HTTP requests, responses, error scenarios
- **Component Rendering**: Vue components with props and events
- **Utility Functions**: Date formatting, status colors, priority sorting

### Testing Strategy

1. **Unit Tests**: Individual functions, components, and stores
2. **Integration Tests**: Store-API interactions and data flow
3. **Mock Testing**: localStorage, HTTP clients, external dependencies
4. **Edge Case Testing**: Error conditions, validation, empty states

**Testing Features:**
- Mock setup for browser APIs (localStorage, fetch)
- Pinia store testing with proper isolation
- Vue component testing with Vue Test Utils
- API service mocking for reliable tests
- Comprehensive error scenario coverage

### Performance Optimizations

- **Code Splitting**: Vendor chunks separated for better caching
- **Tree Shaking**: Unused code eliminated in production
- **Asset Optimization**: Images and CSS optimized by Vite
- **Serverless Functions**: Auto-scaling backend with zero cold starts

## 🔒 Environment Variables

### Frontend (`apps/web/.env`)
```bash
VITE_API_BASE_URL=/api
```
---

**Built with ❤️ by farrid.dev using Vue 3, Pinia, and Netlify Functions**