import React, { useState } from 'react';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', key: '' });

  return (
    <div className="auth-overlay">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="scanner-line"></div>
          <h2>AEGIS_SHIELD_AUTH</h2>
          <p>Restricted Access: Authorized Personnel Only</p>
        </div>
        <form className="auth-form">
          <div className="input-group">
            <label>OPERATOR_ID</label>
            <input type="text" placeholder="Enter ID..." />
          </div>
          <div className="input-group">
            <label>ACCESS_KEY</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="auth-submit">INITIALIZE_SESSION</button>
        </form>
        <div className="auth-footer">
          <span>ENCRYPTION: AES-256</span>
          <span>LOCATION: UNKNOWN</span>
        </div>
      </div>
    </div>
  );
};

export default Login;