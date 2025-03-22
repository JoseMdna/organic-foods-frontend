import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>OrganicEats</h3>
          <p>Healthy, sustainable, organic food delivered to your doorstep.</p>
          <p>© 2023 OrganicEats. All rights reserved.</p>
        </div>
        
        <div className="footer-section">
          <h3>Shop</h3>
          <Link to="/categories/fruits">Fruits</Link>
          <Link to="/categories/vegetables">Vegetables</Link>
          <Link to="/categories/dairy">Dairy</Link>
          <Link to="/categories/grains">Grains</Link>
        </div>
        
        <div className="footer-section">
          <h3>Learn</h3>
          <Link to="/recipes">Recipes</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/sustainability">Our Sustainability Efforts</Link>
        </div>
        
        <div className="footer-section">
          <h3>Connect</h3>
          <Link to="/contact">Contact Us</Link>
          <div className="social-links">
            <a href="https://instagram.com" aria-label="Instagram">Instagram</a>
            <a href="https://facebook.com" aria-label="Facebook">Facebook</a>
            <a href="https://twitter.com" aria-label="Twitter">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}