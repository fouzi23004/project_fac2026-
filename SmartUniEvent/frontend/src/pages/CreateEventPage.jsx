import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';

function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      const eventData = {
        ...formData,
        price: parseFloat(formData.price),
        totalTickets: parseInt(formData.totalTickets)
      };

      await eventsAPI.create(eventData);
      alert('Event created successfully!');
      navigate('/admin/manage-events');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create event');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button
              onClick={() => navigate('/admin/manage-events')}
              className="btn btn-link text-decoration-none me-3 text-warning"
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <div>
              <h1 className="display-5 mb-1 text-warning">Create New Event</h1>
              <p className="text-light mb-0">Fill in the details to create a new event</p>
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
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    minLength={5}
                    maxLength={200}
                    placeholder="e.g., Annual Research Symposium 2026"
                  />
                  <small className="text-muted">5-200 characters</small>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label text-light">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={20}
                    maxLength={1000}
                    rows={4}
                    placeholder="Provide a detailed description of the event..."
                  ></textarea>
                  <small className="text-muted">
                    {formData.description.length}/1000 characters (minimum 20)
                  </small>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label htmlFor="category" className="form-label text-light">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
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
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Time */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="time" className="form-label text-light">
                      Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
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
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., University Main Hall"
                  />
                </div>

                <div className="row">
                  {/* Price */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label text-light">
                      Price (USD) <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <small className="text-muted">Set to 0 for free events</small>
                  </div>

                  {/* Total Tickets */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="totalTickets" className="form-label text-light">
                      Total Tickets <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="totalTickets"
                      name="totalTickets"
                      value={formData.totalTickets}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                {/* Image URL (Optional) */}
                <div className="mb-4">
                  <label htmlFor="imageUrl" className="form-label text-light">
                    Image URL <small className="text-muted">(Optional)</small>
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/event-image.jpg"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Event
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning btn-lg"
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

export default CreateEventPage;
