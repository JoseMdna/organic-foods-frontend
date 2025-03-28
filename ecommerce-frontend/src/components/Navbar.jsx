import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
  };
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate('/?search=' + encodeURIComponent(e.target.value));
    }
  };
  
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">OrganicFoods</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="nav-actions">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for organic products..." 
            onKeyDown={handleSearch}
          />
        </div>
        
        {isAuthenticated ? (
          <div className="user-menu">
            <span>Hello, {currentUser.username}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-button">Login</Link>
        )}
      </div>
    </nav>
  );
}