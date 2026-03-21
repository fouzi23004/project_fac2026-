import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function QueuePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [queueStatus, setQueueStatus] = useState('joining'); // joining, waiting, purchasing, completed
  const [position, setPosition] = useState(null);
  const [totalInQueue, setTotalInQueue] = useState(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);

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
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
      // const data = await response.json();

      // Mock data
      const mockEvent = {
        id: eventId,
        title: 'Spring Gala 2024',
        date: '2024-04-15',
        time: '19:00',
        location: 'Main Campus Hall',
        price: 25,
        availableTickets: 150
      };

      setEventInfo(mockEvent);
    } catch (error) {
      console.error('Error fetching event info:', error);
    }
  };

  const joinQueue = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/queue/join/${eventId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();

      // Simulate joining queue
      setTimeout(() => {
        setQueueStatus('waiting');
        setPosition(Math.floor(Math.random() * 100) + 1);
        setTotalInQueue(Math.floor(Math.random() * 200) + 100);
        setEstimatedWaitTime(Math.floor(Math.random() * 10) + 2);

        // Simulate queue updates
        simulateQueueProgress();
      }, 2000);
    } catch (error) {
      console.error('Error joining queue:', error);
    }
  };

  const simulateQueueProgress = () => {
    const interval = setInterval(() => {
      setPosition(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setQueueStatus('purchasing');
          return 0;
        }
        return prev - 1;
      });
      setEstimatedWaitTime(prev => Math.max(0, prev - 0.5));
    }, 3000);
  };

  const handlePurchase = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/tickets/purchase/${eventId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();

      // Simulate purchase
      setQueueStatus('completed');
      setTimeout(() => {
        navigate('/ticket/123'); // Replace with actual ticket ID
      }, 2000);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
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
                              <span className="text-warning fw-bold fs-5">${eventInfo.price}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <button onClick={handlePurchase} className="btn btn-warning btn-lg w-100 mb-3">
                        <i className="bi bi-credit-card me-2"></i>Confirm Purchase
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
