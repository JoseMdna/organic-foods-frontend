import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>OrganicFoods</h3>
          <p>Healthy, sustainable, organic food.</p>
          <p>© 2025 OrganicFoods.</p>
        </div>
       
        <div className="footer-section">
          <h3>Learn</h3>
          <Link to="/recipes">Recipes</Link>
        </div>
      </div>
    </footer>
  );
}