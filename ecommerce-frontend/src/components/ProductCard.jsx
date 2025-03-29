import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image_url} 
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
          }}
        />
      </div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Link to={`/products/${product.id}`}>View Details</Link>
    </div>
  );
}