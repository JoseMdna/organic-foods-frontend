import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Za-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (password.length >= 12) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    
    if (!hasLetter) {
      setError('Password must include at least one letter');
      return;
    }
    
    if (!hasNumber) {
      setError('Password must include at least one number');
      return;
    }
    
    if (!hasSymbol) {
      setError('Password must include at least one special character');
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

  const getStrengthColor = (strength) => {
    const colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50'];
    return colors[strength - 1] || '#e0e0e0';
  };

  const getStrengthText = (strength) => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return strength > 0 ? texts[strength - 1] : '';
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>

      <div className="auth-requirements" style={{
        backgroundColor: 'rgba(46, 107, 70, 0.1)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--border-radius-sm)',
        marginBottom: 'var(--spacing-md)',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: '500' }}>Account Requirements:</p>
        <ul style={{ margin: '0', paddingLeft: 'var(--spacing-lg)' }}>
          <li>Username: At least 3 characters (letters, numbers, underscores)</li>
          <li>Password: At least 8 characters</li>
          <li>Password must include at least one letter, one number, and one special character</li>
          <li>Passwords must match</li>
        </ul>
      </div>
      
      {error && (
        <p className="auth-error">{error}</p>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />
          <div style={{ marginTop: 'var(--spacing-xs)' }}>
            <div style={{ 
              display: 'flex', 
              height: '5px', 
              width: '100%', 
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '6px'
            }}>
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    height: '100%', 
                    flex: 1,
                    backgroundColor: i < passwordStrength 
                      ? getStrengthColor(passwordStrength) 
                      : '#e0e0e0',
                    marginRight: i < 4 ? '2px' : 0
                  }}
                />
              ))}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              textAlign: 'right',
              color: getStrengthColor(passwordStrength)
            }}>
              {getStrengthText(passwordStrength)}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        
        <button type="submit" className="form-auth-button">
          Register
        </button>
      </form>
      
      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}