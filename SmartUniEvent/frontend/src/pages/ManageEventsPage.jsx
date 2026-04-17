import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';

function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll({ status: 'all' });
      setEvents(response.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    try {
      await eventsAPI.delete(eventId);
      setEvents(events.filter(e => e.id !== eventId));
      alert('Event deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const getFilteredEvents = () => {
    let filtered = events;

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(e => e.category === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{minHeight: '100vh', backgroundColor: 'var(--background-color)'}}>
      {/* Header */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h1 className="display-5 mb-2 text-warning">Manage Events</h1>
          <p className="text-light">Create, edit, and delete university events</p>
        </div>
        <div className="col-md-6 text-md-end">
          <Link to="/admin/create-event" className="btn btn-warning">
            <i className="bi bi-plus-circle me-2"></i>
            Create New Event
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card mb-4 border-0" style={{backgroundColor: 'var(--surface-color)'}}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label text-light">Category</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div className="col-md-8">
              <label className="form-label text-light">Search</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body">
              <h3 className="mb-0 text-warning">{events.length}</h3>
              <small className="text-light">Total Events</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body">
              <h3 className="mb-0 text-warning">{events.filter(e => e.status === 'active').length}</h3>
              <small className="text-light">Active</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body">
              <h3 className="mb-0 text-warning">{events.reduce((sum, e) => sum + e.totalTickets, 0)}</h3>
              <small className="text-light">Total Tickets</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body">
              <h3 className="mb-0 text-warning">
                ${events.reduce((sum, e) => sum + (e.price * e.totalTickets), 0).toFixed(0)}
              </h3>
              <small className="text-light">Potential Revenue</small>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
        <div className="card-header text-warning" style={{backgroundColor: '#2a2a2a', borderBottom: '2px solid var(--accent-color)'}}>
          <h5 className="mb-0">
            <i className="bi bi-calendar-event me-2"></i>
            Events List ({filteredEvents.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x display-1 text-warning" style={{opacity: 0.5}}></i>
              <p className="mt-3 text-light">No events found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 table-dark">
                <thead style={{backgroundColor: '#2a2a2a', borderBottom: '2px solid var(--accent-color)'}}>
                  <tr>
                    <th className="text-warning">Title</th>
                    <th className="text-warning">Category</th>
                    <th className="text-warning">Date & Time</th>
                    <th className="text-warning">Location</th>
                    <th className="text-warning">Price</th>
                    <th className="text-warning">Tickets</th>
                    <th className="text-warning">Status</th>
                    <th className="text-warning">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-light">
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <strong className="text-light">{event.title}</strong>
                        <br />
                        <small className="text-light" style={{opacity: 0.7}}>
                          {event.description.substring(0, 60)}...
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${
                          event.category === 'academic' ? 'bg-primary' :
                          event.category === 'social' ? 'bg-success' :
                          'bg-warning'
                        }`}>
                          {event.category}
                        </span>
                      </td>
                      <td>
                        <small className="text-light">
                          {new Date(event.date).toLocaleDateString()}
                          <br />
                          {event.time}
                        </small>
                      </td>
                      <td>
                        <small className="text-light">{event.location}</small>
                      </td>
                      <td>
                        <strong className="text-warning">${parseFloat(event.price).toFixed(2)}</strong>
                      </td>
                      <td>
                        <small className="text-light">
                          {event.availableTickets} / {event.totalTickets}
                          <br />
                          <span className="text-light" style={{opacity: 0.7}}>
                            ({Math.round((event.availableTickets / event.totalTickets) * 100)}% left)
                          </span>
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${
                          event.status === 'active' ? 'bg-success' :
                          event.status === 'cancelled' ? 'bg-danger' :
                          'bg-secondary'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/admin/edit-event/${event.id}`}
                            className="btn btn-outline-warning"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id, event.title)}
                            className="btn btn-outline-danger"
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageEventsPage;
