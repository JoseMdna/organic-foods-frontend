import React from 'react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title }) {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '3rem auto', 
      padding: '2rem', 
      textAlign: 'center',
      backgroundColor: 'var(--color-white)',
      borderRadius: 'var(--border-radius-md)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      <h1>{title}</h1>
      <p style={{ marginBottom: '2rem' }}>
        This feature is coming soon! We're working hard to bring you the best organic food experience.
      </p>
      <Link to="/" className="button-primary" style={{
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        borderRadius: 'var(--border-radius-sm)',
        textDecoration: 'none'
      }}>
        Return to Home
      </Link>
    </div>
  );
}