# SmartUniEvent - Complete Setup Instructions

## 🚀 Quick Start (3 Methods)

### **Method 1: Docker (Easiest - Recommended)**

If you have Docker installed:

```bash
# Navigate to project root
cd C:\Users\msi\Desktop\projetlprojet\SmartUniEvent

# Start everything with Docker Compose
docker-compose up -d

# Wait for services to start (about 30 seconds)
# PostgreSQL will be on: localhost:5432
# Backend API will be on: http://localhost:5000
```

That's it! The database will be automatically created and initialized.

---

### **Method 2: Manual PostgreSQL Installation**

#### Step 1: Install PostgreSQL

1. Download from: https://www.postgresql.org/download/windows/
2. Run installer (use password: `smartuni2024`)
3. Keep default port: `5432`
4. Install all components including pgAdmin

#### Step 2: Create Database

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE smartunievent;
```

Or use command line:
```bash
# After adding PostgreSQL to PATH
psql -U postgres
# Enter your password
CREATE DATABASE smartunievent;
\q
```

#### Step 3: Initialize Database Schema

```bash
cd backend
psql -U postgres -d smartunievent -f src/config/schema.sql
```

Or copy the contents of `backend/src/config/schema.sql` and execute in pgAdmin.

#### Step 4: Update Backend .env

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartunievent
DB_USER=postgres
DB_PASSWORD=smartuni2024  # Use your actual password
```

#### Step 5: Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend will start on: http://localhost:5000

#### Step 6: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

---

### **Method 3: Use Online PostgreSQL Service**

If you don't want to install locally, use a free cloud database:

#### Option A: ElephantSQL (Free)

1. Go to: https://www.elephantsql.com/
2. Sign up for free account
3. Create a new instance (Tiny Turtle - Free)
4. Copy the connection URL

#### Option B: Supabase (Free)

1. Go to: https://supabase.com/
2. Create account and new project
3. Get database credentials from Settings > Database

#### Update .env with cloud credentials:

```env
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

Then run the schema.sql in their web interface.

---

## 🧪 Verify Installation

### Check PostgreSQL is Running

```bash
psql -U postgres -c "SELECT version();"
```

### Check Database Exists

```bash
psql -U postgres -l | grep smartunievent
```

### Test Backend API

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-04-09T...",
  "uptime": 123.456
}
```

### Test Database Connection

```bash
curl http://localhost:5000/api/events
```

---

## 📊 Database Tables Created

After running `schema.sql`, you'll have:

- ✅ `users` - User accounts (student, admin, superadmin)
- ✅ `events` - Event information
- ✅ `queue` - Dynamic queue management
- ✅ `tickets` - Tickets with QR codes
- ✅ `audit_logs` - Security audit trail

**Default Admin Account:**
- Email: `admin@university.edu`
- Password: `Admin@123`

**Sample Events:**
- Spring Gala 2024
- Tech Conference 2024
- Football Championship

---

## 🔧 Troubleshooting

### PostgreSQL Not Starting

```bash
# Check status (Windows)
net start postgresql-x64-16

# Start manually
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start
```

### Port Already in Use

If port 5432 is taken:
```env
# Change in .env
DB_PORT=5433
```

### Connection Refused

Check:
1. PostgreSQL service is running
2. Port is correct (5432)
3. Password matches
4. Database exists

### Schema Errors

If you get errors running schema.sql:
1. Make sure database is created first
2. Check PostgreSQL version (need 14+)
3. Run each section of schema.sql separately

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset everything
docker-compose down -v
docker-compose up -d

# Access PostgreSQL shell
docker exec -it smartunievent-db psql -U postgres -d smartunievent
```

---

## 🎯 Next Steps

After database is set up:

1. ✅ Database running on `localhost:5432`
2. ✅ Backend API on `http://localhost:5000`
3. ✅ Frontend on `http://localhost:5173`

**Test the full stack:**
- Visit: http://localhost:5173
- Register with academic email (*.edu or *.tn)
- Browse events
- Book a ticket!

---

## 📞 Need Help?

Common issues:
- **PostgreSQL installation**: Check Windows Services
- **Database connection**: Verify credentials in .env
- **Schema errors**: Run sections one by one
- **Port conflicts**: Change ports in .env

---

**SmartUniEvent** - Your ticket to better campus events! 🎓🎫
