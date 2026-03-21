import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import QueuePage from './pages/QueuePage';
import TicketPage from './pages/TicketPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/queue/:eventId" element={<QueuePage />} />
          <Route path="/ticket/:ticketId" element={<TicketPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
