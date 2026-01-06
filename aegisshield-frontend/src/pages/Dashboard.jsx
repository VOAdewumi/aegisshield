import React from 'react';
import WorldMap from '../components/WorldMap'; // We will build this next

/* Dashboard.jsx */
const Dashboard = () => {
  return (
    <div className="dashboard-view content-container">
      <header>
        <h1 style={{ fontSize: '3rem' }}>Global Conflict Hotspots</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Live regional intensity tracking powered by <span style={{ color: 'var(--secondary)' }}>AegisShield</span>.
        </p>
      </header>

      {/* Large Map Container */}
      <WorldMap />

      {/* Bottom Metrics Section */}
      <div className="grid-dashboard" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>INTEL_REPORTS</h3>
            <h2>Regional Metrics</h2>
          </div>
          <div className="card-body">
            <ul className="stats-list" style={{ listStyle: 'none' }}>
               <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                 Eastern Europe: <span className="intensity-high">High_Threat</span>
               </li>
               <li style={{ padding: '1rem 0' }}>
                 Southeast Asia: <span className="intensity-med">Medium_Risk</span>
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;