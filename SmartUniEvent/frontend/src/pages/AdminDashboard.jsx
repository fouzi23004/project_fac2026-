import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, eventsAPI } from '../services/api';

function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    activeUsers: 0,
    upcomingEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchDashboardData();

    // Initialize AOS animations
    if (window.AOS) {
      window.AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      // Fetch real statistics from database
      const statsResponse = await adminAPI.getStats();
      setStats(statsResponse.data.stats);

      // Fetch recent events
      const eventsResponse = await eventsAPI.getAll({ limit: 5, sort: 'recent' });
      const events = eventsResponse.data.events || [];

      // Calculate tickets sold and revenue for each event
      setRecentEvents(events.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        ticketsSold: event.totalTickets - event.availableTickets,
        revenue: (event.totalTickets - event.availableTickets) * parseFloat(event.price),
        status: event.status || 'active'
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep default values on error
    }
  };

  return (
    <main className="main">
      <section className="section" style={{minHeight: '100vh', paddingTop: '100px'}}>
        <div className="container">
          <div className="row mb-4" data-aos="fade-up">
            <div className="col-12">
              <h2 className="text-warning mb-2">Admin Dashboard</h2>
              <p className="text-light">Welcome back, {user?.firstName}!</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div className="card border-0 h-100" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-calendar-event text-warning" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h3 className="text-warning display-5 mb-2">{stats.totalEvents}</h3>
                  <p className="text-light mb-0">Total Events</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="card border-0 h-100" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-ticket-perforated text-warning" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h3 className="text-warning display-5 mb-2">{stats.totalTicketsSold.toLocaleString()}</h3>
                  <p className="text-light mb-0">Tickets Sold</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div className="card border-0 h-100" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-cash-stack text-warning" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h3 className="text-warning display-5 mb-2">${stats.totalRevenue.toLocaleString()}</h3>
                  <p className="text-light mb-0">Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
              <div className="card border-0 h-100" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-people text-warning" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h3 className="text-warning display-5 mb-2">{stats.activeUsers.toLocaleString()}</h3>
                  <p className="text-light mb-0">Active Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-5">
            <div className="col-12" data-aos="fade-up">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body p-4">
                  <h4 className="text-warning mb-4">Quick Actions</h4>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <Link to="/admin/create-event" className="btn btn-warning w-100 py-3">
                        <i className="bi bi-plus-circle me-2"></i>Create Event
                      </Link>
                    </div>
                    <div className="col-md-3">
                      <Link to="/admin/manage-events" className="btn btn-outline-warning w-100 py-3">
                        <i className="bi bi-gear me-2"></i>Manage Events
                      </Link>
                    </div>
                    <div className="col-md-3">
                      <Link to="/admin/scan-tickets" className="btn btn-outline-warning w-100 py-3">
                        <i className="bi bi-qr-code-scan me-2"></i>Scan Tickets
                      </Link>
                    </div>
                    <div className="col-md-3">
                      <Link to="/admin/users" className="btn btn-outline-warning w-100 py-3">
                        <i className="bi bi-people me-2"></i>Manage Users
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="row">
            <div className="col-12" data-aos="fade-up">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="text-warning mb-0">Recent Events</h4>
                    <Link to="/admin/manage-events" className="text-warning text-decoration-none">
                      View All <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-dark table-hover">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date</th>
                          <th>Tickets Sold</th>
                          <th>Revenue</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="text-light">{event.title}</td>
                            <td className="text-light">{new Date(event.date).toLocaleDateString()}</td>
                            <td className="text-light">{event.ticketsSold}</td>
                            <td className="text-warning">${event.revenue.toLocaleString()}</td>
                            <td>
                              <span className="badge bg-success">{event.status}</span>
                            </td>
                            <td>
                              <Link to={`/admin/events/${event.id}`} className="btn btn-sm btn-outline-warning me-2">
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <Link to={`/admin/events/${event.id}/analytics`} className="btn btn-sm btn-outline-info">
                                <i className="bi bi-graph-up"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
