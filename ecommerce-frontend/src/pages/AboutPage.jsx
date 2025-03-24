import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>About OrganicEats</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-xxl)'
      }}>
        <div>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>Our Mission</h2>
          <p style={{ marginBottom: 'var(--spacing-md)', lineHeight: '1.7' }}>
            At OrganicEats, we believe that healthy, sustainable food should be accessible to everyone. 
            Our mission is to connect consumers directly with local organic farmers, reducing food miles 
            and supporting sustainable agriculture in our communities.
          </p>
          <p style={{ lineHeight: '1.7' }}>
            Every product we offer meets our strict standards for quality, sustainability, and ethical 
            production. We're committed to transparency about where your food comes from and how it's grown.
          </p>
        </div>
        
        <div style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&auto=format")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 'var(--border-radius-md)',
          minHeight: '300px'
        }}></div>
      </div>
      
      <div style={{ 
        backgroundColor: 'var(--color-white)', 
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--border-radius-md)',
        marginBottom: 'var(--spacing-xxl)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>
          Our Commitment to Sustainability
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-xl)'
        }}>
          <div>
            <h3 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-sm)' }}>Eco-Friendly Packaging</h3>
            <p>We use compostable packaging made from plant-based materials wherever possible, and are working toward eliminating single-use plastics entirely from our supply chain.</p>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-sm)' }}>Carbon-Neutral Delivery</h3>
            <p>We offset 100% of the carbon emissions from our delivery vehicles and are transitioning to an all-electric fleet by 2024.</p>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-sm)' }}>Supporting Regenerative Agriculture</h3>
            <p>We partner with farmers who practice regenerative techniques that improve soil health, increase biodiversity, and capture carbon.</p>
          </div>
        </div>
      </div>
            
      <div style={{ 
        backgroundColor: 'var(--color-primary)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--border-radius-md)',
        color: 'var(--color-white)',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Join Our Community</h2>
        <p style={{ marginBottom: 'var(--spacing-lg)', maxWidth: '700px', margin: '0 auto var(--spacing-lg)' }}>
          Subscribe to our newsletter for seasonal recipes, farm updates, and exclusive discounts.
        </p>
        <Link to="/" style={{
          display: 'inline-block',
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-primary)',
          borderRadius: 'var(--border-radius-sm)',
          fontWeight: '500',
          textDecoration: 'none'
        }}>Shop Our Products</Link>
      </div>
    </div>
  );
}