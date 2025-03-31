import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchValue(search);
  }, [location.search]);
  
  const handleLogout = async () => {
    await logout();
  };
  
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams();
      if (searchValue.trim()) {
        params.set('search', searchValue.trim());
      }
      
      navigate(`/?${params.toString()}`);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">OrganicFoods</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="nav-actions">
        <div className="search-bar">
          <input 
            type="text"
            id="nav-search"
            name="nav-search" 
            placeholder="Search..." 
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
    
        <div className="nav-auth-container">
          {isAuthenticated ? (
            <div className="user-menu">
              <span>{currentUser.username}</span>
              <button onClick={handleLogout} className="auth-button logout-button">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="auth-button login-button">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}