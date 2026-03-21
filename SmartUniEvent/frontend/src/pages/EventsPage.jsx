import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:5000/api/events');
      // const data = await response.json();

      // Mock data for now
      const mockEvents = [
        {
          id: 1,
          title: 'Spring Gala 2024',
          description: 'Annual university spring gala with live music, food, and entertainment',
          date: '2024-04-15',
          time: '19:00',
          location: 'Main Campus Hall',
          availableTickets: 150,
          totalTickets: 500,
          price: 25,
          imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
          category: 'gala'
        },
        {
          id: 2,
          title: 'Tech Conference 2024',
          description: 'Cutting-edge technology conference featuring industry leaders',
          date: '2024-04-20',
          time: '09:00',
          location: 'Engineering Building',
          availableTickets: 200,
          totalTickets: 300,
          price: 15,
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
          category: 'conference'
        },
        {
          id: 3,
          title: 'Football Championship',
          description: 'Inter-university football championship finals',
          date: '2024-04-22',
          time: '15:00',
          location: 'University Stadium',
          availableTickets: 500,
          totalTickets: 1000,
          price: 10,
          imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
          category: 'sports'
        },
        {
          id: 4,
          title: 'Music Festival',
          description: 'Two-day music festival featuring student bands and special guests',
          date: '2024-05-01',
          time: '17:00',
          location: 'Campus Green',
          availableTickets: 800,
          totalTickets: 1000,
          price: 20,
          imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
          category: 'festival'
        },
        {
          id: 5,
          title: 'Career Fair 2024',
          description: 'Meet top employers and explore career opportunities',
          date: '2024-04-25',
          time: '10:00',
          location: 'Student Center',
          availableTickets: 300,
          totalTickets: 500,
          price: 0,
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
          category: 'career'
        }
      ];

      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
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
              className={`btn ${filter === 'gala' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('gala')}
            >
              Galas
            </button>
            <button
              className={`btn ${filter === 'conference' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('conference')}
            >
              Conferences
            </button>
            <button
              className={`btn ${filter === 'sports' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('sports')}
            >
              Sports
            </button>
            <button
              className={`btn ${filter === 'festival' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('festival')}
            >
              Festivals
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
