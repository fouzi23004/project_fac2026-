import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate academic email
    if (!formData.email.endsWith('.edu') && !formData.email.endsWith('.tn')) {
      setError('Please use your academic email address');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          studentId: formData.studentId,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/events');
      } else {
        const error = await response.json();
        setError(error.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <main className="main">
      <section className="section d-flex align-items-center" style={{minHeight: '100vh', paddingTop: '100px'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-10" data-aos="fade-up">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="text-warning mb-2">Register for SmartUniEvent</h2>
                    <p className="text-light">Join your university event platform</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="firstName" className="form-label text-light">
                          <i className="bi bi-person me-2"></i>First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          required
                          style={{
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #3a3a3a',
                            color: '#f8f8f8'
                          }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label text-light">
                          <i className="bi bi-person me-2"></i>Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          required
                          style={{
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #3a3a3a',
                            color: '#f8f8f8'
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-light">
                        <i className="bi bi-envelope me-2"></i>Academic Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@university.edu"
                        required
                        style={{
                          backgroundColor: '#2a2a2a',
                          border: '1px solid #3a3a3a',
                          color: '#f8f8f8'
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="studentId" className="form-label text-light">
                        <i className="bi bi-card-text me-2"></i>Student ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="123456789"
                        required
                        style={{
                          backgroundColor: '#2a2a2a',
                          border: '1px solid #3a3a3a',
                          color: '#f8f8f8'
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label text-light">
                        <i className="bi bi-lock me-2"></i>Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        required
                        style={{
                          backgroundColor: '#2a2a2a',
                          border: '1px solid #3a3a3a',
                          color: '#f8f8f8'
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label text-light">
                        <i className="bi bi-lock-fill me-2"></i>Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        required
                        style={{
                          backgroundColor: '#2a2a2a',
                          border: '1px solid #3a3a3a',
                          color: '#f8f8f8'
                        }}
                      />
                    </div>

                    <button type="submit" className="btn btn-warning w-100 btn-lg mb-3">
                      <i className="bi bi-person-plus me-2"></i>Register
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-light mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-warning text-decoration-none fw-bold">
                        Login here
                      </Link>
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

export default RegisterPage;
