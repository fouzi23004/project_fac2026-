import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();

    // Initialize AOS animations
    if (window.AOS) {
      window.AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      setEvents(response.data.events || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      // Fallback to empty array
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };


  const filteredEvents = filter === 'all'
    ? events
    : events.filter(event => event.category === filter);

  const getAvailabilityStatus = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'bg-success';
    if (percentage > 20) return 'bg-warning';
    return 'bg-danger';
  };

  if (loading) {
    return (
      <main className="main">
        <section className="section">
          <div className="container">
            <div className="text-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading events...</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section id="events" className="services section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Upcoming Events</h2>
          <p>Discover and book tickets for campus events</p>
        </div>

        <div className="container mb-4">
          <div className="d-flex flex-wrap justify-content-center gap-2" data-aos="fade-up" data-aos-delay="100">
            <button
              className={`btn ${filter === 'all' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button
              className={`btn ${filter === 'academic' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('academic')}
            >
              Academic
            </button>
            <button
              className={`btn ${filter === 'social' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('social')}
            >
              Social
            </button>
            <button
              className={`btn ${filter === 'sports' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('sports')}
            >
              Sports
            </button>
          </div>
        </div>
        <div className="container">
          <div className="row gy-4">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card h-100 border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                  <div className="position-relative">
                    <img
                      src={event.imageUrl}
                      className="card-img-top"
                      alt={event.title}
                      style={{height: '200px', objectFit: 'cover'}}
                    />
                    <span className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark fs-6">
                      {event.price === 0 ? 'FREE' : `$${event.price}`}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-warning">{event.title}</h5>
                    <p className="card-text text-light mb-3">{event.description}</p>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2 text-light">
                        <i className="bi bi-calendar3 me-2"></i>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 text-light">
                        <i className="bi bi-clock me-2"></i>
                        <span>{event.time}</span>
                      </div>
                      <div className="d-flex align-items-center text-light">
                        <i className="bi bi-geo-alt me-2"></i>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="progress" style={{height: '8px', backgroundColor: '#2a2a2a'}}>
                        <div
                          className={`progress-bar ${getAvailabilityStatus(event.availableTickets, event.totalTickets)}`}
                          role="progressbar"
                          style={{ width: `${(event.availableTickets / event.totalTickets) * 100}%` }}
                          aria-valuenow={(event.availableTickets / event.totalTickets) * 100}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <small className="text-light">
                        {event.availableTickets} / {event.totalTickets} tickets available
                      </small>
                    </div>

                    <Link to={`/queue/${event.id}`} className="btn btn-warning mt-auto w-100">
                      Book Ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-5" data-aos="fade-up">
              <p className="text-light fs-5">No events found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default EventsPage;
