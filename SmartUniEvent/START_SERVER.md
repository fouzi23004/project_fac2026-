# SmartUniEvent - Server Startup Guide

Complete guide for starting and running the SmartUniEvent application.

---

## Quick Start (Development)

### Prerequisites
- Node.js (v16 or higher)
- Docker Desktop (for database)
- Git

### Start Everything in 3 Steps

```bash
# Step 1: Start PostgreSQL Database
docker-compose up -d postgres

# Step 2: Start Backend Server (in one terminal)
cd backend
npm install
npm run dev

# Step 3: Start Frontend Server (in another terminal)
cd frontend
npm install
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173 (or next available port)
- Backend API: http://localhost:5000/api
- Database: localhost:5432

---

## Detailed Startup Instructions

### 1. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify database is running
docker ps

# Check database logs
docker logs smartunievent-db

# Verify database connection
docker exec smartunievent-db psql -U postgres -d smartunievent -c "\dt"
```

#### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create database
psql -U postgres
CREATE DATABASE smartunievent;
\q

# Initialize schema
psql -U postgres -d smartunievent -f backend/src/config/schema.sql
```

### 2. Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Copy environment file (if not exists)
# The .env file is already configured

# Start development server
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🎓 SmartUniEvent API Server                   ║
║                                                       ║
║        Server running on port 5000                    ║
║        Environment: development                       ║
║        Frontend: http://localhost:5173                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

**Available Scripts:**
- `npm run dev` - Start with nodemon (auto-restart on changes)
- `npm start` - Start without auto-restart
- `node src/server.js` - Direct Node.js execution

### 3. Frontend Server

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v8.0.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Note:** If port 5173 is busy, Vite will automatically try 5174, 5175, 5176, etc.

---

## Verification Steps

### 1. Check Database
```bash
# Check if container is running
docker ps | findstr smartunievent-db

# Test database connection
docker exec smartunievent-db psql -U postgres -d smartunievent -c "SELECT COUNT(*) FROM users;"
```

### 2. Check Backend API
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@university.edu\",\"password\":\"Admin@123\"}"
```

### 3. Check Frontend
- Open browser: http://localhost:5173 (or the port shown in terminal)
- You should see the SmartUniEvent homepage

---

## Default Test Accounts

### Admin Account
- **Email:** admin@university.edu
- **Password:** Admin@123
- **Role:** Admin (full access to admin dashboard)

### Sample Events
The database is pre-populated with 3 sample events:
1. Spring Gala 2024 (500 tickets, $25)
2. Tech Conference 2024 (300 tickets, $15)
3. Football Championship (1000 tickets, $10)

---

## Stopping the Servers

### Stop All Services
```bash
# Stop frontend (Ctrl+C in frontend terminal)
# Stop backend (Ctrl+C in backend terminal)

# Stop database container
docker-compose down

# Or keep data and just stop
docker-compose stop
```

### Kill Specific Processes
```bash
# Windows - Find and kill Node processes
tasklist | findstr node
taskkill //F //PID <PID_NUMBER>

# Check what's using port 5000
netstat -ano | findstr :5000
taskkill //F //PID <PID_NUMBER>
```

---

## Troubleshooting

### Issue: CORS Errors in Browser

**Symptom:**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:XXXX'
has been blocked by CORS policy
```

**Solution:**
The backend CORS configuration supports ports 5173-5176. If your frontend runs on a different port:

1. Check which port Vite is using
2. Edit `backend/src/server.js` line 44-48 and add your port
3. Restart the backend server

### Issue: Port Already in Use

**Backend (Port 5000):**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill //F //PID <PID_NUMBER>
```

**Frontend (Port 5173+):**
Vite automatically finds the next available port. Check the terminal output.

### Issue: Database Connection Failed

**Check Docker:**
```bash
# Is container running?
docker ps

# Check container logs
docker logs smartunievent-db

# Restart container
docker-compose restart postgres
```

**Check Credentials:**
Verify `backend/.env` has correct database settings:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartunievent
DB_USER=postgres
DB_PASSWORD=smartuni2024
```

### Issue: npm install Fails

**Clear cache and retry:**
```bash
# Backend
cd backend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Rate Limit Errors (429)

**Symptom:**
```
Too many requests from this IP, please try again later.
```

**Solutions:**
1. Wait 15 minutes for rate limit to reset
2. Or restart the backend server
3. For development, the limit has been increased to 1000 requests per 15 minutes

### Issue: Template JavaScript Errors

**Symptom:**
```
Cannot read properties of null (reading 'addEventListener')
```

**Solution:**
This has been fixed in `frontend/public/assets/js/main.js`. If errors persist, clear browser cache.

---

## Production Deployment

### Using Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_PASSWORD=strong_password_here
JWT_SECRET=very_strong_secret_here_min_32_chars
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://api.your-domain.com/api
VITE_NODE_ENV=production
```

### Security Checklist
- [ ] Change all default passwords
- [ ] Update JWT_SECRET to a strong random string
- [ ] Update COOKIE_SECRET
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up proper firewall rules
- [ ] Enable database backups
- [ ] Review and adjust rate limits
- [ ] Set up logging and monitoring

---

## Useful Commands

### Database Management
```bash
# Backup database
docker exec smartunievent-db pg_dump -U postgres smartunievent > backup.sql

# Restore database
docker exec -i smartunievent-db psql -U postgres smartunievent < backup.sql

# Access PostgreSQL CLI
docker exec -it smartunievent-db psql -U postgres -d smartunievent

# View all tables
docker exec smartunievent-db psql -U postgres -d smartunievent -c "\dt"
```

### Development
```bash
# Backend - Watch mode (auto-restart)
cd backend && npm run dev

# Frontend - Development server
cd frontend && npm run dev

# Frontend - Build for production
cd frontend && npm run build

# Frontend - Preview production build
cd frontend && npm run preview
```

### Logs and Debugging
```bash
# Backend logs (if using nodemon)
# Visible in terminal

# Database logs
docker logs smartunievent-db

# Follow database logs
docker logs -f smartunievent-db
```

---

## Architecture Overview

```
SmartUniEvent/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── server.js     # Main entry point
│   │   ├── config/       # Database & schema
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, validation, errors
│   │   ├── routes/       # API endpoints
│   │   └── utils/        # Helper functions
│   └── .env              # Backend environment variables
│
├── frontend/             # React/Vite application
│   ├── src/
│   │   ├── App.jsx       # Main app component
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context (auth)
│   │   ├── services/     # API client
│   │   └── utils/        # Security utilities
│   ├── public/           # Static assets
│   └── .env              # Frontend environment variables
│
└── docker-compose.yml    # Docker orchestration
```

---

## API Endpoints Reference

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### Events
- GET `/api/events` - List all events
- GET `/api/events/:id` - Get event details
- POST `/api/events` - Create event (admin)
- PUT `/api/events/:id` - Update event (admin)
- DELETE `/api/events/:id` - Delete event (superadmin)

### Queue
- POST `/api/queue/join/:eventId` - Join event queue
- GET `/api/queue/status/:eventId` - Get queue position
- POST `/api/queue/leave/:eventId` - Leave queue

### Tickets
- POST `/api/tickets/purchase/:eventId` - Purchase ticket
- GET `/api/tickets/my-tickets` - Get user's tickets
- GET `/api/tickets/:ticketId` - Get ticket with QR code
- POST `/api/tickets/validate/:ticketId` - Validate ticket

### Admin
- GET `/api/admin/stats` - Dashboard statistics
- GET `/api/admin/users` - List all users
- PUT `/api/admin/users/:userId` - Update user
- POST `/api/admin/scan-ticket` - Scan QR code

---

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review the main README.md
3. Check QUICK_START.md for database setup
4. Review SETUP_INSTRUCTIONS.md for detailed setup

---

**Last Updated:** 2026-04-16
**Version:** 1.0.0
