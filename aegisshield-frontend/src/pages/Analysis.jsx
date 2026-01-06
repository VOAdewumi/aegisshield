import React, { useRef } from 'react';

const Analysis = () => {
  const svgRef = useRef();

  return (
    <div className="analysis-view">
      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>ARIMA Predictive Engine</h1>
        <button className="btn-export" style={{ 
          background: 'var(--secondary)', 
          color: '#000', 
          border: 'none', 
          padding: '0.8rem 1.5rem', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          EXPORT_DATA
        </button>
      </div>

      <div className="grid-dashboard" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>PROJECTED_INTENSITY_INDEX</h3>
          <svg ref={svgRef} viewBox="0 0 500 200" className="forecast-chart">
            <polyline
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1"
              points="0,150 50,130 100,140 150,100 200,120 250,80"
              opacity="0.5"
            />
            <polyline
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="3"
              strokeDasharray="8,4"
              points="250,80 300,60 350,70 400,40 450,50 500,20"
            />
          </svg>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>CONFIDENCE_LEVEL</h3>
          <h2 style={{ fontSize: '4rem', fontFamily: 'var(--font-data)', margin: '1rem 0' }}>88.4%</h2>
          <div style={{ height: '4px', background: '#1e293b', borderRadius: '2px' }}>
             <div style={{ width: '88.4%', height: '100%', background: 'var(--success)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;