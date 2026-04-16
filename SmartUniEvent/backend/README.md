# SmartUniEvent - Backend API

**High-Performance University Event Ticketing System API**

This is the backend REST API for SmartUniEvent, built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **RESTful API** with Express.js
- **PostgreSQL Database** with ACID transactions
- **JWT Authentication** with secure HTTP-only cookies
- **Role-Based Authorization** (Student, Admin, SuperAdmin)
- **Dynamic Queue System** for fair ticket distribution
- **QR Code Generation** for digital tickets
- **Security Features**: XSS, CSRF, SSRF protection, rate limiting
- **Academic Email Validation**
- **Audit Logging** for security tracking

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## 🛠️ Installation

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartunievent
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 4. Set Up Database

**Create Database:**
```bash
psql -U postgres
CREATE DATABASE smartunievent;
\q
```

**Initialize Schema:**
```bash
psql -U postgres -d smartunievent -f src/config/schema.sql
```

Or use the npm script:
```bash
npm run db:init
```

### 5. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── schema.sql           # Database schema
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── event.controller.js  # Event management
│   │   ├── queue.controller.js  # Queue system
│   │   ├── ticket.controller.js # Ticket operations
│   │   └── admin.controller.js  # Admin functions
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validation.js        # Input validation
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── event.routes.js      # Event endpoints
│   │   ├── queue.routes.js      # Queue endpoints
│   │   ├── ticket.routes.js     # Ticket endpoints
│   │   └── admin.routes.js      # Admin endpoints
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   └── server.js                # Main server file
├── .env                         # Environment variables
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get current user | Private |
| POST | `/verify-email` | Verify email | Public |
| POST | `/validate-email` | Validate academic email | Public |

### Events (`/api/events`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all events | Public |
| GET | `/:id` | Get event by ID | Public |
| POST | `/` | Create event | Admin |
| PUT | `/:id` | Update event | Admin |
| DELETE | `/:id` | Delete event | SuperAdmin |

### Queue (`/api/queue`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/join/:eventId` | Join event queue | Private |
| GET | `/status/:eventId` | Get queue status | Private |
| POST | `/leave/:eventId` | Leave queue | Private |

### Tickets (`/api/tickets`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/purchase/:eventId` | Purchase ticket | Private |
| GET | `/my-tickets` | Get user's tickets | Private |
| GET | `/:ticketId` | Get ticket details | Private |
| POST | `/validate/:ticketId` | Validate ticket | Private |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Get statistics | Admin |
| GET | `/users` | Get all users | Admin |
| PUT | `/users/:userId` | Update user | Admin |
| POST | `/scan-ticket` | Scan QR code | Admin |
| GET | `/events/:eventId/analytics` | Get event analytics | Admin |

## 📊 Database Schema

### Main Tables

- **users**: User accounts (students, admins)
- **events**: Event information
- **queue**: Dynamic queue management
- **tickets**: Purchased tickets with QR codes
- **audit_logs**: Security audit trail

### Key Features

- **ACID Transactions**: Prevent double-booking
- **Row Locking**: Ensure ticket availability
- **Stored Procedures**: `reserve_ticket()` function
- **Views**: `event_stats` for analytics
- **Indexes**: Optimized for fast queries
- **Triggers**: Auto-update timestamps

## 🔐 Security Implementation

### Authentication
- JWT with HTTP-only cookies
- Bcrypt password hashing (10 rounds)
- Email verification tokens
- Password reset tokens with expiration

### Authorization
- Role-based access control (RBAC)
- Protected routes with middleware
- Admin-only endpoints

### Protection Against
- **SQL Injection**: Parameterized queries
- **XSS**: Helmet.js and CSP headers
- **CSRF**: SameSite cookies
- **SSRF**: URL validation
- **Brute Force**: Rate limiting
- **Data Leaks**: Audit logging

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable via environment variables

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@university.edu",
    "studentId": "12345",
    "password": "Test@123456"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@university.edu",
    "password": "Test@123456"
  }'
```

**Get Events:**
```bash
curl http://localhost:5000/api/events
```

### Using Postman

1. Import the endpoints from the documentation
2. Set base URL: `http://localhost:5000/api`
3. For authenticated requests, add token to Authorization header

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | smartunievent |
| `DB_USER` | Database user | postgres |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRE` | Token expiration | 7d |
| `FRONTEND_URL` | Frontend URL | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests | 100 |

## 🐛 Error Handling

All errors return JSON:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## 📈 Performance Optimization

- Connection pooling (max 20 connections)
- Database indexes on frequently queried columns
- B-Tree indexing for fast lookups
- Transaction isolation for ACID compliance
- Query optimization with prepared statements

## 🔄 ACID Transactions

The `reserve_ticket()` function ensures atomic ticket purchases:

```sql
-- Locks event row
-- Checks availability
-- Decreases ticket count
-- All or nothing (rollback on error)
```

## 👥 Default Accounts

**Admin Account** (created by schema.sql):
- Email: `admin@university.edu`
- Password: `Admin@123`
- Role: admin

## 🚀 Deployment

### Production Checklist

- [ ] Change all secrets in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Monitor logs and errors
- [ ] Set up reverse proxy (nginx)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 Related Documentation

- [Frontend Documentation](../frontend/README.md)
- [Project Report](../Rapport_SmartUniEvent_HediElFouzi_YassinAbid_MelekBradai.pdf)

## 🤝 Contributors

- **Hedi EL FOUZI**
- **Yassin ABID**
- **Melek BRADAI**

**Supervisor**: Faouzi MOUSSA
**Institution**: FST - IGL3
**Year**: 2024-2025

---

**SmartUniEvent Backend** - Secure, Scalable, High-Performance 🚀
