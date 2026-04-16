import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithOAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/events');
    }

    // Initialize AOS animations
    if (window.AOS) {
      window.AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate academic email
    if (!formData.email.endsWith('.edu') && !formData.email.endsWith('.tn')) {
      setError('Please use your academic email address');
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/events');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    loginWithOAuth(provider);
  };

  return (
    <main className="main">
      <section className="section d-flex align-items-center" style={{minHeight: '100vh', paddingTop: '100px'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8" data-aos="fade-up">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="text-warning mb-2">Login to SmartUniEvent</h2>
                    <p className="text-light">Access your university events</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label text-light">
                        <i className="bi bi-envelope me-2"></i>Academic Email
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
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

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label text-light">
                        <i className="bi bi-lock me-2"></i>Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        style={{
                          backgroundColor: '#2a2a2a',
                          border: '1px solid #3a3a3a',
                          color: '#f8f8f8'
                        }}
                      />
                    </div>

                    <button type="submit" className="btn btn-warning w-100 btn-lg mb-3" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>Login
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center my-3">
                    <span className="text-light">or continue with</span>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <button
                        onClick={() => handleOAuthLogin('google')}
                        className="btn btn-outline-light w-100"
                        disabled={loading}
                      >
                        <i className="bi bi-google me-2"></i>Google
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        onClick={() => handleOAuthLogin('microsoft')}
                        className="btn btn-outline-light w-100"
                        disabled={loading}
                      >
                        <i className="bi bi-microsoft me-2"></i>Microsoft
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-light mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-warning text-decoration-none fw-bold">
                        Register here
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

export default LoginPage;
