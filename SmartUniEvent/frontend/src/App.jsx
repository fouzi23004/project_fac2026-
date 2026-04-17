import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import QueuePage from './pages/QueuePage';
import TicketPage from './pages/TicketPage';
import MyTicketsPage from './pages/MyTicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import TicketScanner from './pages/TicketScanner';
import ManageEventsPage from './pages/ManageEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ScanTicketPage from './pages/ScanTicketPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route
              path="/queue/:eventId"
              element={
                <ProtectedRoute>
                  <QueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket/:ticketId"
              element={
                <ProtectedRoute>
                  <TicketPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTicketsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets/:ticketId"
              element={
                <ProtectedRoute>
                  <TicketDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/scan-tickets"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ScanTicketPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-events"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ManageEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-event"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-event/:id"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <EditEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ManageUsersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
