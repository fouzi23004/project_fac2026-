import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('mobile-nav-active');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header id="header" className={`header d-flex align-items-center fixed-top ${isScrolled ? 'sticked' : ''}`}>
      <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        <Link to="/" className="logo d-flex align-items-center">
          <h1 className="sitename">SmartUniEvent</h1>
        </Link>

        <nav id="navmenu" className={`navmenu ${isMobileMenuOpen ? 'mobile-nav-active' : ''}`}>
          <ul>
            <li>
              <Link to="/" className={isActive('/')} onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/events" className={isActive('/events')} onClick={() => setIsMobileMenuOpen(false)}>
                Events
              </Link>
            </li>
            {isAuthenticated && isAdmin && (
              <li>
                <Link to="/admin" className={isActive('/admin')} onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
            )}
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/login" className={isActive('/login')} onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.firstName || 'Account'}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/my-tickets" onClick={() => setIsMobileMenuOpen(false)}>
                        <i className="bi bi-ticket-perforated me-2"></i>My Tickets
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
          <i className={`mobile-nav-toggle d-xl-none bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`} onClick={toggleMobileMenu}></i>
        </nav>

        {!isAuthenticated && (
          <Link to="/register" className="btn-getstarted">
            Get Started
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
