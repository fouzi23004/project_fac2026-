import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketsAPI } from '../services/api';
import { Link } from 'react-router-dom';

function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketsAPI.getMyTickets();
      setTickets(response.data.tickets || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTickets = () => {
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return tickets.filter(ticket => ticket.event && new Date(ticket.event.date) >= now);
      case 'past':
        return tickets.filter(ticket => ticket.event && new Date(ticket.event.date) < now);
      default:
        return tickets;
    }
  };

  const filteredTickets = getFilteredTickets();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'used':
        return 'bg-secondary';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-2 text-warning">My Tickets</h1>
          <p className="text-light">View and manage all your event tickets</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filter === 'all' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('all')}
            >
              All Tickets ({tickets.length})
            </button>
            <button
              type="button"
              className={`btn ${filter === 'upcoming' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({tickets.filter(t => t.event && new Date(t.event.date) >= new Date()).length})
            </button>
            <button
              type="button"
              className={`btn ${filter === 'past' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('past')}
            >
              Past ({tickets.filter(t => t.event && new Date(t.event.date) < new Date()).length})
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-ticket-perforated display-1 text-muted"></i>
          </div>
          <h3 className="mb-3">No Tickets Found</h3>
          <p className="text-muted mb-4">
            {filter === 'all'
              ? "You haven't purchased any tickets yet."
              : `You don't have any ${filter} tickets.`
            }
          </p>
          <Link to="/events" className="btn btn-primary">
            <i className="bi bi-calendar-event me-2"></i>
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="row">
          {filteredTickets.map((ticket) => {
            // Skip tickets without event data
            if (!ticket.event) return null;

            return (
            <div key={ticket.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm hover-shadow border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                {/* Event Image */}
                <div className="position-relative">
                  {ticket.event?.imageUrl ? (
                    <img
                      src={ticket.event.imageUrl}
                      className="card-img-top"
                      alt={ticket.event.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="card-img-top bg-gradient d-flex align-items-center justify-content-center"
                      style={{ height: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      <i className="bi bi-calendar-event text-white" style={{ fontSize: '4rem' }}></i>
                    </div>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`position-absolute top-0 end-0 m-2 badge ${getStatusBadgeClass(ticket.status)}`}
                  >
                    {ticket.status.toUpperCase()}
                  </span>
                </div>

                <div className="card-body d-flex flex-column">
                  {/* Event Title */}
                  <h5 className="card-title mb-2 text-warning">{ticket.event.title}</h5>

                  {/* Event Details */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center text-light mb-2">
                      <i className="bi bi-calendar3 me-2 text-warning"></i>
                      <small>
                        {new Date(ticket.event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </small>
                    </div>
                    <div className="d-flex align-items-center text-light mb-2">
                      <i className="bi bi-clock me-2 text-warning"></i>
                      <small>{ticket.event.time}</small>
                    </div>
                    <div className="d-flex align-items-center text-light mb-2">
                      <i className="bi bi-geo-alt me-2 text-warning"></i>
                      <small>{ticket.event.location}</small>
                    </div>
                  </div>

                  {/* QR Code Preview */}
                  {ticket.qrCodeData && (
                    <div className="text-center mb-3">
                      <img
                        src={ticket.qrCodeData}
                        alt="QR Code"
                        style={{ width: '100px', height: '100px' }}
                        className="border border-warning rounded p-1"
                      />
                    </div>
                  )}

                  {/* Ticket Info */}
                  <div className="border-top border-secondary pt-3 mb-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted d-block">Ticket ID</small>
                        <strong className="text-light" style={{ fontSize: '0.85rem' }}>
                          {ticket.id.substring(0, 8)}...
                        </strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Price</small>
                        <strong className="text-light" style={{ fontSize: '0.85rem' }}>
                          ${parseFloat(ticket.price).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="btn btn-warning w-100"
                    >
                      <i className="bi bi-qr-code me-2"></i>
                      View QR Code
                    </Link>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer" style={{backgroundColor: '#2a2a2a', borderTop: '1px solid #3a3a3a'}}>
                  <small className="text-light">
                    <i className="bi bi-calendar-check me-1 text-warning"></i>
                    Purchased on {new Date(ticket.purchasedAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {tickets.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
              <div className="card-body">
                <h5 className="card-title mb-3 text-warning">Ticket Summary</h5>
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="mb-2">
                      <i className="bi bi-ticket-perforated text-warning" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="mb-0 text-light">{tickets.length}</h3>
                    <small className="text-muted">Total Tickets</small>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-2">
                      <i className="bi bi-calendar-check text-success" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="mb-0 text-light">
                      {tickets.filter(t => t.status === 'active').length}
                    </h3>
                    <small className="text-muted">Active Tickets</small>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-2">
                      <i className="bi bi-check-circle text-info" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="mb-0 text-light">
                      {tickets.filter(t => t.status === 'used').length}
                    </h3>
                    <small className="text-muted">Used Tickets</small>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-2">
                      <i className="bi bi-currency-dollar text-warning" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="mb-0 text-light">
                      ${tickets.reduce((sum, t) => sum + parseFloat(t.price), 0).toFixed(2)}
                    </h3>
                    <small className="text-muted">Total Spent</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTicketsPage;
