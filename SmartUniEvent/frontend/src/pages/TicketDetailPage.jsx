import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ticketsAPI } from '../services/api';

function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketsAPI.getTicket(ticketId);
      setTicket(response.data.ticket);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ticket details');
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    // Create a link to download the QR code image
    const link = document.createElement('a');
    link.href = ticket.qrCodeData;
    link.download = `ticket-${ticket.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error || 'Ticket not found'}</p>
          <hr />
          <Link to="/my-tickets" className="btn btn-primary">
            Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Ticket Card */}
          <div className="card shadow-lg ticket-card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-header text-center py-4" style={{backgroundColor: '#2a2a2a', borderBottom: '2px solid var(--accent-color)'}}>
              <h2 className="mb-0 text-warning">
                <i className="bi bi-ticket-perforated-fill me-2"></i>
                Event Ticket
              </h2>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Event Information */}
              <div className="text-center mb-4">
                <h3 className="mb-3 text-warning">{ticket.event.title}</h3>
                <p className="text-light mb-0">{ticket.event.description}</p>
              </div>

              {/* Event Details Grid */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-calendar3 text-warning me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                    <div>
                      <small className="text-muted d-block">Date</small>
                      <strong className="text-light">
                        {new Date(ticket.event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-clock text-warning me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                    <div>
                      <small className="text-muted d-block">Time</small>
                      <strong className="text-light">{ticket.event.time}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-geo-alt text-warning me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                    <div>
                      <small className="text-muted d-block">Location</small>
                      <strong className="text-light">{ticket.event.location}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-currency-dollar text-warning me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                    <div>
                      <small className="text-muted d-block">Price</small>
                      <strong className="text-light">${parseFloat(ticket.price).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* QR Code Section */}
              <div className="text-center mb-4">
                <h4 className="mb-3 text-warning">Your QR Code</h4>
                <p className="text-light mb-4">
                  Present this QR code at the event entrance for validation
                </p>

                <div className="qr-code-container bg-white p-4 rounded d-inline-block" style={{ border: '2px dashed var(--accent-color)' }}>
                  {ticket.qrCodeData ? (
                    <img
                      src={ticket.qrCodeData}
                      alt="Ticket QR Code"
                      className="img-fluid"
                      style={{ maxWidth: '300px' }}
                    />
                  ) : (
                    <div className="bg-light p-5" style={{ width: '300px', height: '300px' }}>
                      <i className="bi bi-qr-code display-1 text-muted"></i>
                      <p className="text-muted mt-3">QR Code will be available soon</p>
                    </div>
                  )}
                </div>

                {/* Ticket Status Badge */}
                <div className="mt-3">
                  <span className={`badge ${ticket.status === 'active' ? 'bg-success' : ticket.status === 'used' ? 'bg-secondary' : 'bg-danger'} px-4 py-2`} style={{ fontSize: '1rem' }}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <hr className="my-4" />

              {/* Ticket Information */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <small className="text-muted d-block">Ticket ID</small>
                  <code className="px-2 py-1 rounded text-warning" style={{backgroundColor: '#2a2a2a'}}>{ticket.id}</code>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Purchase Date</small>
                  <strong className="text-light">
                    {new Date(ticket.purchasedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>
                </div>
                {ticket.usedAt && (
                  <div className="col-md-6">
                    <small className="text-muted d-block">Used At</small>
                    <strong className="text-light">
                      {new Date(ticket.usedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  onClick={handlePrint}
                  className="btn btn-outline-primary btn-lg"
                >
                  <i className="bi bi-printer me-2"></i>
                  Print Ticket
                </button>
                {ticket.qrCodeData && (
                  <button
                    onClick={handleDownloadQR}
                    className="btn btn-primary btn-lg"
                  >
                    <i className="bi bi-download me-2"></i>
                    Download QR Code
                  </button>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="card-footer bg-light text-center py-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                This ticket is secured with a unique QR code
              </small>
            </div>
          </div>

          {/* Important Notes */}
          <div className="alert alert-info mt-4" role="alert">
            <h5 className="alert-heading">
              <i className="bi bi-info-circle me-2"></i>
              Important Notes
            </h5>
            <ul className="mb-0 ps-3">
              <li>Please arrive 15 minutes before the event starts</li>
              <li>Bring a valid ID for verification</li>
              <li>This ticket is non-transferable and non-refundable</li>
              <li>Save this QR code on your phone or print it out</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;
