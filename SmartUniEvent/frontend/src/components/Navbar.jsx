import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
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
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/login" className={isActive('/login')} onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  Logout
                </a>
              </li>
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
