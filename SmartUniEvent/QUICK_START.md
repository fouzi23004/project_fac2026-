# ⚡ SmartUniEvent - Quick Start Guide

## 🎯 Current Situation

Your system has:
- ✅ Node.js installed
- ✅ Docker installed (but Desktop not running)
- ❌ PostgreSQL not installed locally

## 🚀 Choose Your Setup Method

---

### **Option 1: Use Docker (Fastest - 2 minutes)**

#### Step 1: Start Docker Desktop
- Open **Docker Desktop** application on Windows
- Wait for it to fully start (icon turns green in system tray)

#### Step 2: Start Database
```bash
cd C:\Users\msi\Desktop\projetlprojet\SmartUniEvent
docker-compose up -d postgres
```

#### Step 3: Verify Database is Running
```bash
docker ps
```

You should see `smartunievent-db` running.

**Done!** PostgreSQL is now running on `localhost:5432`

---

### **Option 2: Install PostgreSQL (10 minutes)**

#### Step 1: Download PostgreSQL
- Go to: https://www.postgresql.org/download/windows/
- Click "Download the installer"
- Download **PostgreSQL 16** for Windows

#### Step 2: Install
1. Run the installer
2. **Password**: Set to `smartuni2024` (or remember your own)
3. **Port**: Keep default `5432`
4. **Locale**: Keep default
5. Install all components

#### Step 3: Add to PATH
1. Press Windows + X → System
2. Advanced System Settings → Environment Variables
3. Edit "Path" → Add: `C:\Program Files\PostgreSQL\16\bin`
4. Click OK and **restart terminal**

#### Step 4: Create Database
Open Command Prompt (as Administrator):
```bash
psql -U postgres
# Enter password: smartuni2024
CREATE DATABASE smartunievent;
\q
```

#### Step 5: Initialize Schema
```bash
cd C:\Users\msi\Desktop\projetlprojet\SmartUniEvent\backend
psql -U postgres -d smartunievent -f src/config/schema.sql
```

**Done!** PostgreSQL is set up with all tables.

---

### **Option 3: Use Free Cloud Database (5 minutes)**

#### Using Supabase (Recommended)

1. **Sign Up**
   - Go to: https://supabase.com/
   - Create free account

2. **Create Project**
   - Click "New Project"
   - Name: `smartunievent`
   - Password: (save this!)
   - Region: Choose closest to you
   - Click "Create new project"

3. **Get Credentials**
   - Go to: Settings → Database
   - Copy these values:
     - Host
     - Database name
     - Port (5432)
     - User (postgres)
     - Password

4. **Update Backend .env**
   Edit `backend/.env`:
   ```env
   DB_HOST=db.xxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_password_from_supabase
   ```

5. **Run Schema**
   - In Supabase Dashboard → SQL Editor
   - Copy entire contents of `backend/src/config/schema.sql`
   - Paste and click "Run"

**Done!** Cloud database ready!

---

## 🎬 Start the Application

Once database is set up (any method above):

### Terminal 1 - Backend
```bash
cd C:\Users\msi\Desktop\projetlprojet\SmartUniEvent\backend
npm install
npm run dev
```

Backend will start on: **http://localhost:5000**

### Terminal 2 - Frontend (Already Running)
Your frontend is already running on: **http://localhost:5173**

---

## ✅ Verification

### Test Backend API:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": 123.45
}
```

### Test Database Connection:
```bash
curl http://localhost:5000/api/events
```

Should return list of events (3 sample events).

### Test Frontend:
Open browser: **http://localhost:5173**

---

## 🎮 Try It Out!

1. **Register** with academic email
   - Email must end with: `.edu` or `.tn`
   - Example: `student@university.edu`
   - Password: `Test@123456`

2. **Login** with your credentials

3. **Browse Events**
   - Click "Events" in navigation
   - See 3 sample events

4. **Book a Ticket**
   - Click "Book Ticket"
   - Join the queue
   - Watch position update
   - Complete purchase
   - Get QR code!

5. **Admin Features** (optional)
   - Login as admin: `admin@university.edu` / `Admin@123`
   - Access: http://localhost:5173/admin
   - View dashboard
   - Scan tickets

---

## 💡 Recommended: Docker Setup

**If you have Docker Desktop:**

1. **Start Docker Desktop** (look for whale icon in taskbar)
2. Wait until it says "Docker Desktop is running"
3. Run:
   ```bash
   cd C:\Users\msi\Desktop\projetlprojet\SmartUniEvent
   docker-compose up -d
   ```

This starts:
- ✅ PostgreSQL database (auto-configured)
- ✅ Backend API (auto-connected)

Then just start frontend and you're done!

---

## 🆘 Troubleshooting

### Docker Desktop Won't Start
- Check if Hyper-V is enabled (Windows Features)
- Check if WSL2 is installed
- Restart computer

### PostgreSQL Connection Failed
- Check if PostgreSQL service is running:
  ```bash
  net start postgresql-x64-16
  ```
- Verify password in `.env` matches installation
- Check port 5432 is not blocked by firewall

### Backend Won't Start
- Make sure `node_modules` installed: `npm install`
- Check `.env` file exists in `backend/` folder
- Verify database is running

---

## 📝 What's Next?

After setup, you have:
- ✅ Full-stack application running
- ✅ Database with sample data
- ✅ Authentication system
- ✅ Admin dashboard
- ✅ Ticket booking with QR codes

Explore the features and test the system!

---

**Need help? Check `SETUP_INSTRUCTIONS.md` for detailed guides.**

**SmartUniEvent** - Let's get this running! 🚀
