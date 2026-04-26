<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);
=======
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, removeToken, getUser, isGuestMode } from '../utils/authUtils';
import './Navbar.css';

function Navbar() {
  const [isAuth, setIsAuth]           = useState(false);
  const [isGuest, setIsGuest]         = useState(false);
  const [user, setUser]               = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const location    = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setShowDropdown(false); }, [location]);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isAuthenticated();
      const guest = isGuestMode();
      setIsAuth(loggedIn);
      setIsGuest(guest);
      setUser(loggedIn ? getUser() : null);
    };
    checkAuth();

    const handleStorageChange = () => { checkAuth(); setShowDropdown(false); };
    const handleAuthChange    = () => checkAuth();

    window.addEventListener('storage',       handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);
    return () => {
      window.removeEventListener('storage',       handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
>>>>>>> 39f9fce (Production ready frontend with GIS and backend URL updates)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

<<<<<<< HEAD
=======
  const handleLogout = () => {
    removeToken();
    setIsAuth(false);
    setIsGuest(false);
    setUser(null);
    setShowDropdown(false);
    setMenuOpen(false);
    navigate('/login');
  };

>>>>>>> 39f9fce (Production ready frontend with GIS and backend URL updates)
  const navLinks = [
    { to: '/',            label: 'Home' },
    { to: '/ask',         label: 'Ask' },
    { to: '/songs',       label: 'Songs' },
    { to: '/song-search', label: 'Search' },
    { to: '/about',       label: 'About' },
  ];

  return (
    <>
      <nav className="navbar">
        {/* Brand / logo text */}
        <Link to="/" className="navbar-brand">
          திருமந்திரம் AI
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar-link${location.pathname === to ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

<<<<<<< HEAD
        {/* Removed auth section for demo mode */}
        <div className="navbar-auth" />
=======
        {/* Desktop auth */}
        <div className="navbar-auth" ref={dropdownRef}>
          {isAuth ? (
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                <span className="profile-icon">👤</span>
                <span className="profile-name">{userName}</span>
                <span className="profile-caret">▾</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-email">{user?.email || 'User'}</div>
                  <button className="dropdown-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : isGuest ? (
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                <span className="profile-icon">👤</span>
                <span className="profile-name">Guest</span>
                <span className="profile-caret">▾</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-email">Guest Mode</div>
                  <button className="dropdown-logout" onClick={handleLogout}>
                    🚪 Exit Guest Mode
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login"  className="auth-link">Login</Link>
              <Link to="/signup" className="auth-link auth-link--primary">Sign Up</Link>
            </div>
          )}
        </div>
>>>>>>> 39f9fce (Production ready frontend with GIS and backend URL updates)

        {/* Hamburger button (mobile only) */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Mobile drawer */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
        <div className="mobile-drawer-inner">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-link${location.pathname === to ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
<<<<<<< HEAD
=======

          <div className="mobile-drawer-divider" />

          {isAuth ? (
            <>
              <div className="mobile-user-info">Logged in as <strong>{user?.email}</strong></div>
              <button className="mobile-logout-btn" onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : isGuest ? (
            <>
              <div className="mobile-user-info">Logged in as <strong>Guest</strong></div>
              <button className="mobile-logout-btn" onClick={handleLogout}>🚪 Exit Guest Mode</button>
            </>
          ) : (
            <div className="mobile-auth-links">
              <Link to="/login"  className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="mobile-link mobile-link--primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
>>>>>>> 39f9fce (Production ready frontend with GIS and backend URL updates)
        </div>
      </div>
    </>
  );
}

export default Navbar;