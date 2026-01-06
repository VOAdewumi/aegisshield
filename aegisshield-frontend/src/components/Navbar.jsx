import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <nav className="navbar-container">
      <div className="nav-brand">
        <span className="brand-icon">🛡️</span>
        <span className="brand-name">AegisShield</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Dashboard
        </NavLink>
        <NavLink to="/analysis" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          ARIMA Engine
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Protocol
        </NavLink>
      </div>

      <div className="nav-actions">
        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Visual Mode">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="user-badge">
          <span className="status-indicator"></span>
          Operator_01
        </div>
      </div>
    </nav>
  );
};

export default Navbar;