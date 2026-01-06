import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="app-shell">
        <Navbar theme={theme} setTheme={setTheme} />
        
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            {/* Add other pages here */}
          </Routes>
        </div>

<footer className="footer-bar">
  <div className="footer-segments">
    <span className="footer-tag">LAT: 6.5244° N</span>
    <span className="footer-tag">LNG: 3.3792° E</span>
    <span className="footer-tag">Uptime: 99.98%</span>
  </div>
  <div>SECURE_KERNEL_ACTIVE // {new Date().getFullYear()}</div>
</footer>
      </div>
    </Router>
  );
}

export default App;