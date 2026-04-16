# SmartUniEvent - Frontend

**High-Performance University Event Ticketing Platform**

SmartUniEvent is a next-generation ticketing platform designed specifically for university campus events. Built with React and modern web technologies, it provides a fair, transparent, and secure ticket distribution system that can handle massive concurrent loads.

## 🎯 Features

### Core Features
- **High-Performance Architecture**: Handle thousands of simultaneous connections without crashes
- **Dynamic Queue System**: Wave-based entry system for fair ticket distribution
- **Academic Email Verification**: Ensures only verified students can access events
- **Real-Time Updates**: Live queue position and ticket availability tracking
- **Secure Authentication**: JWT-based auth with OAuth2 support (Google, Microsoft)
- **QR Code Tickets**: Encrypted digital tickets with unique QR codes
- **Mobile-Responsive**: Fully responsive design for all devices

### Security Features
- **XSS Protection**: Input sanitization with DOMPurify
- **CSRF Protection**: Anti-CSRF tokens on all sensitive requests
- **SSRF Prevention**: URL validation to prevent server-side request forgery
- **Anti-Bot Protection**: Rate limiting and queue verification
- **Secure Cookies**: HttpOnly, Secure, SameSite attributes on JWT cookies
- **Password Requirements**: Strong password validation

### Admin Features
- **Admin Dashboard**: Comprehensive event management interface
- **Ticket Scanner**: QR code scanner for event entry validation
- **Analytics**: Real-time statistics and reports
- **User Management**: Student, Admin, and SuperAdmin roles
- **Event Creation**: Full CRUD operations for events

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A modern web browser
- Backend API running (see backend documentation)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
SmartUniEvent/
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 Security Implementation

The platform implements comprehensive security measures as specified in the project rapport:

- **SQL Injection Prevention**: Prepared statements and ORM usage
- **XSS Protection**: DOMPurify sanitization and CSP headers
- **CSRF Protection**: SameSite cookies and anti-CSRF tokens
- **SSRF Prevention**: URL validation blocking local IPs
- **Session Security**: JWT with HttpOnly, Secure cookies

## 🎨 Technology Stack

- **Frontend**: React 19, Vite, Bootstrap 5
- **Authentication**: JWT, OAuth2 (Google, Microsoft)
- **Security**: DOMPurify, CSRF protection
- **QR Codes**: qrcode.react
- **HTTP**: Axios
- **Routing**: React Router DOM v7

## 📚 Documentation

For detailed documentation, please refer to:
- Frontend README: `frontend/README.md`
- Project Rapport: `Rapport_SmartUniEvent_HediElFouzi_YassinAbid_MelekBradai.pdf`

## 👥 Team

- **Hedi EL FOUZI**
- **Yassin ABID**
- **Melek BRADAI**

**Supervisor**: Faouzi MOUSSA
**Institution**: FST - IGL3
**Year**: 2024-2025

---

**SmartUniEvent** - Plateforme de Billetterie Universitaire Haute Performance 🎓🎫
