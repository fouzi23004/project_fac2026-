import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, queueAPI, ticketsAPI } from '../services/api';

function QueuePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [queueStatus, setQueueStatus] = useState('joining'); // joining, waiting, purchasing, completed
  const [position, setPosition] = useState(null);
  const [totalInQueue, setTotalInQueue] = useState(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchEventInfo();
    joinQueue();
  }, [eventId]);

  const fetchEventInfo = async () => {
    try {
      const response = await eventsAPI.getById(eventId);
      const event = response.data.event;
      setEventInfo({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        availableTickets: event.availableTickets,
        totalTickets: event.totalTickets
      });
    } catch (error) {
      console.error('Error fetching event info:', error);
      setError('Failed to load event information');
    }
  };

  const joinQueue = async () => {
    try {
      const response = await queueAPI.join(eventId);
      setQueueStatus('waiting');
      setPosition(response.data.position || 1);
      setTotalInQueue(response.data.totalInQueue || 1);
      setEstimatedWaitTime(response.data.estimatedWaitTime || 2);

      // Start polling queue status
      startQueuePolling();
    } catch (error) {
      console.error('Error joining queue:', error);
      setError(error.response?.data?.message || 'Failed to join queue');
      // If queue system isn't working, go straight to purchasing
      setTimeout(() => {
        setQueueStatus('purchasing');
      }, 1000);
    }
  };

  const startQueuePolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await queueAPI.getStatus(eventId);
        setPosition(response.data.position);
        setTotalInQueue(response.data.totalInQueue);
        setEstimatedWaitTime(response.data.estimatedWaitTime);

        if (response.data.position === 0 || response.data.canPurchase) {
          clearInterval(interval);
          setQueueStatus('purchasing');
        }
      } catch (error) {
        console.error('Error polling queue:', error);
        // If polling fails, simulate progress as fallback
        setPosition(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setQueueStatus('purchasing');
            return 0;
          }
          return prev - 1;
        });
        setEstimatedWaitTime(prev => Math.max(0, prev - 0.5));
      }
    }, 3000);

    // Store interval ID for cleanup
    return interval;
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      setError(null);

      const response = await ticketsAPI.purchase(eventId, {
        // Payment data can be added here if needed
        paymentMethod: 'free' // or actual payment method
      });

      setQueueStatus('completed');

      setTimeout(() => {
        navigate(`/tickets/${response.data.ticket.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      setError(error.response?.data?.message || 'Failed to purchase ticket');
      setPurchasing(false);
    }
  };

  const getQueuePercentage = () => {
    if (!position || !totalInQueue) return 0;
    return ((totalInQueue - position) / totalInQueue) * 100;
  };

  return (
    <main className="main">
      <section className="section" style={{minHeight: '100vh', paddingTop: '100px'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {eventInfo && (
                <div className="text-center mb-4" data-aos="fade-up">
                  <h2 className="text-warning">{eventInfo.title}</h2>
                  <p className="text-light">{new Date(eventInfo.date).toLocaleDateString()} at {eventInfo.time}</p>
                </div>
              )}

              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}} data-aos="fade-up" data-aos-delay="100">
                <div className="card-body p-5">
                  {queueStatus === 'joining' && (
                    <div className="text-center py-5">
                      <div className="spinner-border text-warning mb-4" role="status" style={{width: '4rem', height: '4rem'}}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h3 className="text-light mb-3">Joining Queue...</h3>
                      <p className="text-light">Please wait while we add you to the queue</p>
                    </div>
                  )}

                  {queueStatus === 'waiting' && (
                    <div className="text-center">
                      <div className="position-relative d-inline-block mb-4">
                        <div className="spinner-grow text-warning" style={{width: '200px', height: '200px', opacity: '0.1'}}></div>
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <div className="display-1 text-warning fw-bold">{position}</div>
                          <div className="text-light fs-5">in queue</div>
                        </div>
                      </div>

                      <h3 className="text-light mb-3">You're in the Queue!</h3>
                      <p className="text-light mb-4">Your position is being updated in real-time</p>

                      <div className="row g-3 mb-4">
                        <div className="col-md-4">
                          <div className="p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
                            <div className="text-warning small mb-1">Your Position</div>
                            <div className="text-light fs-4 fw-bold">{position}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
                            <div className="text-warning small mb-1">Total in Queue</div>
                            <div className="text-light fs-4 fw-bold">{totalInQueue}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
                            <div className="text-warning small mb-1">Estimated Wait</div>
                            <div className="text-light fs-4 fw-bold">{Math.ceil(estimatedWaitTime)} min</div>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-dark border-warning" role="alert">
                        <p className="mb-2"><i className="bi bi-clock-history text-warning me-2"></i>The queue moves in waves to ensure fair distribution</p>
                        <p className="mb-2"><i className="bi bi-shield-lock text-warning me-2"></i>Your spot is secured - don't refresh the page</p>
                        <p className="mb-0"><i className="bi bi-bell text-warning me-2"></i>You'll be notified when it's your turn</p>
                      </div>
                    </div>
                  )}

                  {queueStatus === 'purchasing' && (
                    <div className="text-center">
                      <div className="mb-4">
                        <i className="bi bi-check-circle-fill text-success" style={{fontSize: '5rem'}}></i>
                      </div>
                      <h3 className="text-warning mb-3">It's Your Turn!</h3>
                      <p className="text-light mb-4">You can now purchase your ticket</p>

                      {error && (
                        <div className="alert alert-danger mb-4">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {error}
                        </div>
                      )}

                      {eventInfo && (
                        <div className="mb-4">
                          <div className="list-group">
                            <div className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a'}}>
                              <span className="text-light">Event</span>
                              <span className="text-warning fw-bold">{eventInfo.title}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a'}}>
                              <span className="text-light">Date</span>
                              <span className="text-light">{new Date(eventInfo.date).toLocaleDateString()}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a'}}>
                              <span className="text-light">Time</span>
                              <span className="text-light">{eventInfo.time}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a'}}>
                              <span className="text-light">Location</span>
                              <span className="text-light">{eventInfo.location}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a'}}>
                              <span className="text-warning fw-bold fs-5">Total</span>
                              <span className="text-warning fw-bold fs-5">${eventInfo.price === 0 ? 'FREE' : eventInfo.price}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handlePurchase}
                        className="btn btn-warning btn-lg w-100 mb-3"
                        disabled={purchasing}
                      >
                        {purchasing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-credit-card me-2"></i>Confirm Purchase
                          </>
                        )}
                      </button>
                      <div className="alert alert-warning" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>Complete your purchase within 5 minutes
                      </div>
                    </div>
                  )}

                  {queueStatus === 'completed' && (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="bi bi-trophy-fill text-warning" style={{fontSize: '5rem'}}></i>
                      </div>
                      <h3 className="text-warning mb-3">Purchase Successful!</h3>
                      <p className="text-light mb-4">Redirecting to your ticket...</p>
                      <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default QueuePage;
