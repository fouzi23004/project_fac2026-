# SmartUniEvent Frontend

High-Performance Ticketing System for Campus Events - React Frontend

## Features

- **Authentication System**: Login and registration with academic email validation
- **Event Discovery**: Browse and filter university events by category
- **Dynamic Queue System**: Real-time queue position updates with wave-based entry
- **Secure Ticketing**: Encrypted QR codes for ticket verification
- **Responsive Design**: Mobile-friendly interface for all devices

## Tech Stack

- **React 18**: Modern UI library with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **QRCode.react**: QR code generation
- **Axios**: HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Auth/           # Authentication components
│   ├── Events/         # Event-related components
│   ├── Queue/          # Queue system components
│   └── Navbar.jsx      # Navigation bar
├── pages/              # Page components
│   ├── HomePage.jsx    # Landing page
│   ├── LoginPage.jsx   # Login page
│   ├── RegisterPage.jsx # Registration page
│   ├── EventsPage.jsx  # Events listing
│   ├── QueuePage.jsx   # Queue management
│   └── TicketPage.jsx  # Ticket display with QR code
├── utils/              # Utility functions
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Key Features Implemented

### 1. Authentication Pages
- Academic email validation (.edu, .tn domains)
- Password strength requirements
- JWT token storage
- Secure login/logout

### 2. Events Page
- Event listing with filtering by category
- Real-time availability tracking
- Visual availability indicators
- Event details display

### 3. Queue System
- Real-time position updates
- Visual progress indicators
- Estimated wait time calculation
- Wave-based entry simulation
- Purchase window with timer

### 4. Ticket Page
- QR code generation with encrypted data
- Ticket details display
- Download QR code functionality
- Event information summary

## API Integration

The frontend is ready for backend integration. Update the API endpoints in:
- `src/pages/LoginPage.jsx`
- `src/pages/RegisterPage.jsx`
- `src/pages/EventsPage.jsx`
- `src/pages/QueuePage.jsx`
- `src/pages/TicketPage.jsx`

Replace mock data with actual API calls to `http://localhost:5000/api/*`

## Environment Variables

Create a `.env` file for configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

## Security Features

- JWT token authentication
- Academic email validation
- Encrypted QR codes
- Secure local storage handling
- Protected routes

## Next Steps

1. Connect to backend API
2. Implement WebSocket for real-time queue updates
3. Add payment gateway integration
4. Implement email verification
5. Add admin dashboard
