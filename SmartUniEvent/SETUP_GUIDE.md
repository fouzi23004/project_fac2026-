# SmartUniEvent - Setup Guide

## Project Overview
SmartUniEvent is a high-performance ticketing system for university campus events, built with React and designed to handle massive simultaneous demand.

## What Has Been Implemented

### Frontend (React + Vite)
Located in: `SmartUniEvent/frontend/`

#### Pages Created:
1. **Home Page** (`/`)
   - Landing page with feature showcase
   - Call-to-action buttons
   - Project overview

2. **Login Page** (`/login`)
   - Academic email validation
   - JWT authentication
   - Form validation

3. **Register Page** (`/register`)
   - Student registration
   - Academic email verification (.edu, .tn)
   - Password strength requirements

4. **Events Page** (`/events`)
   - Event listing with mock data
   - Category filters (Galas, Conferences, Sports, Festivals)
   - Availability tracking
   - Event details display

5. **Queue Page** (`/queue/:eventId`)
   - Dynamic queue system
   - Real-time position updates (simulated)
   - Visual progress indicator
   - Wave-based entry algorithm
   - Purchase window with 5-minute timer

6. **Ticket Page** (`/ticket/:ticketId`)
   - Digital ticket display
   - QR code generation (encrypted)
   - Download functionality
   - Event details summary

## Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation & Running

```bash
# Navigate to frontend directory
cd SmartUniEvent/frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The application will be available at: **http://localhost:5173**

## Testing the Application

### 1. Test Home Page
- Open http://localhost:5173
- You should see the SmartUniEvent landing page
- Navigate through the features section

### 2. Test Registration
- Click "Register" or go to http://localhost:5173/register
- Try entering a non-academic email (should show error)
- Try entering a valid academic email (e.g., student@university.edu)
- Fill all fields and submit

### 3. Test Login
- Go to http://localhost:5173/login
- Enter academic email and password
- Login functionality stores JWT in localStorage

### 4. Test Events Page
- Go to http://localhost:5173/events
- Browse mock events
- Try filtering by category
- Click "Book Ticket" on any event

### 5. Test Queue System
- After clicking "Book Ticket", you'll be redirected to the queue
- Watch the position counter decrease (simulated)
- When position reaches 0, purchase window appears
- Click "Confirm Purchase"

### 6. Test Ticket Page
- After purchase, you'll see your digital ticket
- QR code will be displayed
- Try downloading the QR code

## Known Issues & Solutions

### Issue: QR Code Not Displaying
**Solution:** This has been fixed by using `QRCodeSVG` instead of `QRCode`

### Issue: Page Not Loading
**Solution:**
- Clear browser cache
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for errors

### Issue: "Module not found" errors
**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## Current Status

### ✅ Completed Features:
- React application structure
- All 6 pages created and styled
- Navigation system with React Router
- Mock authentication system
- Event browsing and filtering
- Dynamic queue simulation
- QR code generation
- Responsive design

### 🔄 Ready for Backend Integration:
All pages have placeholder API calls marked with `// TODO: Replace with actual API call`

The following API endpoints need to be implemented:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/queue/join/:eventId` - Join event queue
- `POST /api/tickets/purchase/:eventId` - Purchase ticket
- `GET /api/tickets/:ticketId` - Get ticket details

## Next Steps

1. **Backend Development**
   - Create Node.js/Express server
   - Set up PostgreSQL database
   - Implement API endpoints
   - Add WebSocket for real-time queue updates

2. **Integration**
   - Connect frontend to backend API
   - Replace mock data with real data
   - Test full user flow

3. **Enhancement**
   - Add payment gateway
   - Implement email verification
   - Add admin dashboard
   - Performance optimization

4. **Deployment**
   - Create Docker containers
   - Set up CI/CD pipeline
   - Deploy to production

## Project Structure

```
SmartUniEvent/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.css
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AuthPages.css
│   │   │   ├── EventsPage.jsx
│   │   │   ├── EventsPage.css
│   │   │   ├── QueuePage.jsx
│   │   │   ├── QueuePage.css
│   │   │   ├── TicketPage.jsx
│   │   │   └── TicketPage.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
└── SETUP_GUIDE.md (this file)
```

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Make sure the development server is running
4. Try clearing browser cache and reloading

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **QRCode.react** - QR code generation
- **Axios** - HTTP client
- **CSS3** - Styling with modern gradients and animations

The frontend is fully functional with mock data and ready for backend integration!
