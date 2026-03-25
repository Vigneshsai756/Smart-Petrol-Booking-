import React from 'react';

const Landing = ({ setPage }) => {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1 className="title-gradient hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem'}}>
          Fueling Your Journey, Smartly.
        </h1>
        <p className="hero-subtitle">
          Experience seamless, 24/7 petrol booking with smart location routing and guaranteed availability.
        </p>
        <div className="cta-buttons">
          <button className="primary" onClick={() => setPage('register')}>Get Started</button>
          <button className="secondary" onClick={() => setPage('login')}>Login to Dashboard</button>
        </div>
      </div>
      
      <div className="features-grid">
        <div className="glass-panel feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant Booking</h3>
          <p>Reserve fuel in seconds. Skip the queue and secure your petrol instantly.</p>
        </div>
        <div className="glass-panel feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>Smart Routing</h3>
          <p>Find the nearest petrol bunks with real-time stock availability tracking.</p>
        </div>
        <div className="glass-panel feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure & Reliable</h3>
          <p>Guaranteed supply. Safe digital payments, transparent pricing.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
