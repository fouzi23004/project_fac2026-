import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';

function EditEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    date: '',
    time: '',
    location: '',
    price: '0.00',
    totalTickets: '',
    imageUrl: ''
  });
  const [eventInfo, setEventInfo] = useState({
    totalTickets: 0,
    availableTickets: 0,
    soldTickets: 0
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setFetchLoading(true);
      const response = await eventsAPI.getById(id);
      const event = response.data.event;

      // Format date to YYYY-MM-DD for input
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().split('T')[0];

      const soldTickets = event.totalTickets - event.availableTickets;

      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'academic',
        date: formattedDate || '',
        time: event.time || '',
        location: event.location || '',
        price: event.price ? parseFloat(event.price).toFixed(2) : '0.00',
        totalTickets: event.totalTickets || '',
        imageUrl: event.imageUrl || ''
      });

      setEventInfo({
        totalTickets: event.totalTickets || 0,
        availableTickets: event.availableTickets || 0,
        soldTickets: soldTickets
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event');
      console.error('Error fetching event:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Don't include totalTickets in update (backend doesn't allow it)
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl
      };

      await eventsAPI.update(id, eventData);
      alert('Event updated successfully!');
      navigate('/admin/manage-events');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update event');
      console.error('Error updating event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container my-5" style={{backgroundColor: 'var(--background-color)', minHeight: '100vh'}}>
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-light mt-3">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{backgroundColor: 'var(--background-color)', minHeight: '100vh'}}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="mb-4 pt-4">
            <div className="text-start">
              <button
                onClick={() => navigate('/admin/manage-events')}
                className="btn btn-link text-decoration-none text-warning p-0 mb-3"
                style={{marginLeft: '-12px'}}
              >
                <i className="bi bi-arrow-left me-1"></i> Back
              </button>
            </div>
            <div>
              <h2 className="mb-2 text-warning">Edit Event</h2>
              <p className="text-light mb-0">Update the event details</p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          {/* Form */}
          <div className="card shadow border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label text-light">
                    Event Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    minLength={5}
                    maxLength={200}
                    placeholder="e.g., Annual Research Symposium 2026"
                    style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                  />
                  <small className="text-light" style={{opacity: 0.7}}>5-200 characters</small>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label text-light">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control bg-dark text-light border-secondary"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={20}
                    maxLength={1000}
                    rows={4}
                    placeholder="Provide a detailed description of the event..."
                    style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                  ></textarea>
                  <small className="text-light" style={{opacity: 0.7}}>
                    {formData.description.length}/1000 characters (minimum 20)
                  </small>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label htmlFor="category" className="form-label text-light">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                  >
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div className="row">
                  {/* Date */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="date" className="form-label text-light">
                      Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                    />
                  </div>

                  {/* Time */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="time" className="form-label text-light">
                      Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      className="form-control bg-dark text-light border-secondary"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="mb-3">
                  <label htmlFor="location" className="form-label text-light">
                    Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., University Main Hall"
                    style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                  />
                </div>

                <div className="row">
                  {/* Price */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label text-light">
                      Price (USD) <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark text-light border-secondary" style={{backgroundColor: '#1b1a1a', borderColor: '#444'}}>$</span>
                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                      />
                    </div>
                    <small className="text-light" style={{opacity: 0.7}}>Set to 0 for free events</small>
                  </div>

                  {/* Total Tickets - Read Only */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="totalTickets" className="form-label text-light">
                      Total Tickets
                    </label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      id="totalTickets"
                      name="totalTickets"
                      value={formData.totalTickets}
                      disabled
                      style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444', opacity: 0.6}}
                    />
                    <small className="text-warning">
                      <i className="bi bi-info-circle me-1"></i>
                      Sold: {eventInfo.soldTickets} | Available: {eventInfo.availableTickets}
                    </small>
                  </div>
                </div>

                {/* Image URL (Optional) */}
                <div className="mb-4">
                  <label htmlFor="imageUrl" className="form-label text-light">
                    Image URL <small className="text-light" style={{opacity: 0.7}}>(Optional)</small>
                  </label>
                  <input
                    type="url"
                    className="form-control bg-dark text-light border-secondary"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/event-image.jpg"
                    style={{backgroundColor: '#1b1a1a', color: '#f8f8f8', borderColor: '#444'}}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update Event
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={() => navigate('/admin/manage-events')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEventPage;
