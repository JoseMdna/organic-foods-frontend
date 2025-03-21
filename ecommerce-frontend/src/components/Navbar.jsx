import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">OrganicEats</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="nav-actions">
        <div className="search-bar">
          <input type="text" placeholder="Search for organic products..." />
        </div>
        <Link to="/cart" className="cart-icon">Cart (0)</Link>
      </div>
    </nav>
  );
}