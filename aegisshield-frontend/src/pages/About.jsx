import React, { useState } from 'react';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="accordion-header">
        <h4>{title}</h4>
        <span>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <div className="accordion-content"><p>{content}</p></div>}
    </div>
  );
};

const About = () => {
  return (
    <div className="about-container card">
      <h1>Project Protocol: AegisShield</h1>
      <p className="typewriter">Deploying global conflict analysis via ARIMA predictive modeling...</p>
      
      <section className="accordion-section">
        <AccordionItem 
          title="01. The Mission" 
          content="AegisShield is a high-performance orchestrator designed to analyze geopolitical instability using time-series forecasting. It converts raw Excel data into actionable intelligence." 
        />
        <AccordionItem 
          title="02. The Tech Stack" 
          content="Frontend: React + Canvas API. Backend: Django 5.x + Statsmodels (ARIMA). Data: Custom GeoJSON mapping with ISO-A3 standardization." 
        />
      </section>
    </div>
  );
};

export default About;