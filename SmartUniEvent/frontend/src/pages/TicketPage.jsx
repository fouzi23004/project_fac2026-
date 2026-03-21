import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

function TicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();

      // Mock data
      const mockTicket = {
        id: ticketId,
        eventTitle: 'Spring Gala 2024',
        eventDate: '2024-04-15',
        eventTime: '19:00',
        location: 'Main Campus Hall',
        price: 25,
        ticketNumber: 'TKT-2024-001234',
        purchaseDate: new Date().toISOString(),
        holderName: 'John Doe',
        holderEmail: 'john.doe@university.edu',
        qrData: JSON.stringify({
          ticketId: ticketId,
          eventId: '1',
          userId: 'user123',
          timestamp: Date.now(),
          signature: 'encrypted_signature_hash'
        })
      };

      setTicket(mockTicket);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Create a download link for the QR code SVG
    const svg = document.querySelector('.qr-code-canvas svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = `ticket-${ticketId}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <main className="main">
        <section className="section">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" style={{width: '4rem', height: '4rem'}}>
                <span className="visually-hidden">Loading ticket...</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="main">
        <section className="section">
          <div className="container">
            <div className="text-center py-5">
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Ticket not found
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="section" style={{minHeight: '100vh', paddingTop: '100px'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-4" data-aos="fade-up">
                <i className="bi bi-trophy-fill text-warning mb-3" style={{fontSize: '4rem'}}></i>
                <h2 className="text-warning mb-2">Ticket Purchased Successfully!</h2>
                <p className="text-light">Your ticket has been confirmed and is ready to use</p>
              </div>

              <div className="card border-0 mb-4" style={{backgroundColor: 'var(--surface-color)'}} data-aos="fade-up" data-aos-delay="100">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h3 className="text-warning mb-2">{ticket.eventTitle}</h3>
                    <span className="badge bg-warning text-dark fs-6">{ticket.ticketNumber}</span>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-start p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
                        <i className="bi bi-calendar3 text-warning fs-4 me-3"></i>
                        <div>
                          <div className="text-light small mb-1">Date</div>
                          <div className="text-light fw-bold">
                            {new Date(ticket.eventDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex align-items-start p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
                        <i className="bi bi-clock text-warning fs-4 me-3"></i>
                        <div>
                          <div className="text-light small mb-1">Time</div>
                          <div className="text-light fw-bold">{ticket.eventTime}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex align-items-start p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
                        <i className="bi bi-geo-alt text-warning fs-4 me-3"></i>
                        <div>
                          <div className="text-light small mb-1">Location</div>
                          <div className="text-light fw-bold">{ticket.location}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex align-items-start p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
                        <i className="bi bi-person text-warning fs-4 me-3"></i>
                        <div>
                          <div className="text-light small mb-1">Ticket Holder</div>
                          <div className="text-light fw-bold">{ticket.holderName}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-4 px-3 rounded mb-4" style={{backgroundColor: '#2a2a2a'}}>
                    <h5 className="text-warning mb-2">Your Entry QR Code</h5>
                    <p className="text-light small mb-3">Show this at the entrance</p>
                    <div className="d-inline-block p-3 bg-white rounded">
                      <QRCodeSVG
                        value={ticket.qrData}
                        size={250}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-light small mt-3 mb-0">
                      <i className="bi bi-shield-lock text-warning me-2"></i>
                      This QR code is encrypted and unique to your ticket
                    </p>
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-md-6">
                      <button onClick={handleDownload} className="btn btn-warning w-100">
                        <i className="bi bi-download me-2"></i>Download QR Code
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button onClick={() => navigate('/events')} className="btn btn-outline-warning w-100">
                        <i className="bi bi-arrow-left me-2"></i>Browse More Events
                      </button>
                    </div>
                  </div>

                  <div className="alert alert-dark border-warning" role="alert">
                    <p className="mb-2 small">
                      <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                      Please arrive 15 minutes before the event starts
                    </p>
                    <p className="mb-2 small">
                      <i className="bi bi-envelope text-warning me-2"></i>
                      A confirmation email has been sent to {ticket.holderEmail}
                    </p>
                    <p className="mb-0 small text-light">
                      Purchased on {new Date(ticket.purchaseDate).toLocaleString()}
                    </p>
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

export default TicketPage;
