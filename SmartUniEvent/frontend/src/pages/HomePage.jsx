import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
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

  return (
    <main className="main">
      {/* Hero Section */}
      <section id="hero" className="hero section dark-background">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center" data-aos="zoom-out">
              <h1>SmartUniEvent</h1>
              <p className="mb-4">High-Performance Ticketing System for Campus Events</p>
              <p>Fair, transparent, and secure ticket distribution for university events. No more crashed servers, opaque queues, or bot problems.</p>
              <div className="d-flex mt-4">
                <Link to="/events" className="btn-get-started me-3">Browse Events</Link>
                <Link to="/register" className="btn-watch-video d-flex align-items-center">
                  <span>Get Started</span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-out" data-aos-delay="200">
              <div className="hero-animated">
                <i className="bi bi-ticket-perforated" style={{fontSize: '10rem', color: 'var(--accent-color)'}}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Why SmartUniEvent?</h2>
          <p>Revolutionary features designed for the modern student</p>
        </div>

        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <h3>High Performance</h3>
                <p>Handle thousands of simultaneous connections without server crashes. Built to support massive demand during ticket sales openings.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="bi bi-balance-scale"></i>
                </div>
                <h3>Fair & Transparent</h3>
                <p>Dynamic queue system with wave-based entry. See your real position and get tickets on a fair first-come, first-served basis.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="bi bi-shield-lock"></i>
                </div>
                <h3>Secure & Protected</h3>
                <p>Anti-bot protection, JWT authentication, and encrypted QR codes for reliable physical access control.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="bi bi-mortarboard"></i>
                </div>
                <h3>Academic Verification</h3>
                <p>Academic email validation ensures only verified students can access campus events.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="bi bi-qr-code"></i>
                </div>
                <h3>Digital Tickets</h3>
                <p>Unique encrypted QR codes for each ticket. No printing required, just show your phone at the entrance.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
              <div className="service-item position-relative">
                <div className="icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h3>Real-Time Updates</h3>
                <p>Live queue position updates and instant notifications. Always know where you stand in line.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats section light-background">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="10000" data-purecounter-duration="1" className="purecounter"></span>
                <p>Students</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="500" data-purecounter-duration="1" className="purecounter"></span>
                <p>Events Hosted</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="50000" data-purecounter-duration="1" className="purecounter"></span>
                <p>Tickets Sold</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="99" data-purecounter-duration="1" className="purecounter"></span>
                <p>% Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section id="call-to-action" className="call-to-action section dark-background">
        <div className="container">
          <div className="row" data-aos="zoom-in" data-aos-delay="100">
            <div className="col-xl-9 text-center text-xl-start">
              <h3>Ready to Experience Better Ticketing?</h3>
              <p>Join thousands of students already using SmartUniEvent for their campus events</p>
            </div>
            <div className="col-xl-3 cta-btn-container text-center">
              <Link to="/register" className="cta-btn align-middle">Create Your Account</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
