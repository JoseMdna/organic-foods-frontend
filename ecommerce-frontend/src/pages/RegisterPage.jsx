import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const result = await register(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-md)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>Register</h1>
      
      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
          {error}
        </p>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', border: '1px solid #ddd' }}
          />
        </div>
        
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', border: '1px solid #ddd' }}
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', border: '1px solid #ddd' }}
          />
        </div>
        
        <button
          type="submit"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Register
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}