import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-badges">
            {product.organic && <span className="badge organic">Organic</span>}
            {product.local && <span className="badge local">Locally Sourced</span>}
            {product.vegan && <span className="badge vegan">Vegan</span>}
          </div>
          
          <p className="product-price">${product.price}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="add-to-cart">Add to Cart</button>
          </div>
          
          <div className="nutritional-info">
            <h3>Nutritional Information</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span>Calories</span>
                <span>{product.nutrition?.calories || 'N/A'} kcal</span>
              </div>
              <div className="nutrition-item">
                <span>Protein</span>
                <span>{product.nutrition?.protein || 'N/A'} g</span>
              </div>
              <div className="nutrition-item">
                <span>Carbs</span>
                <span>{product.nutrition?.carbs || 'N/A'} g</span>
              </div>
              <div className="nutrition-item">
                <span>Fat</span>
                <span>{product.nutrition?.fat || 'N/A'} g</span>
              </div>
              <div className="nutrition-item">
                <span>Fiber</span>
                <span>{product.nutrition?.fiber || 'N/A'} g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="product-additional">
        <h3>Sourcing & Sustainability</h3>
        <p>{product.sourcing || 'We are committed to sourcing this product in the most environmentally responsible way possible.'}</p>
        
        <h3>Storage Tips</h3>
        <p>{product.storageTips || 'For best quality, store in refrigerator and consume within a few days of purchase.'}</p>
      </div>
    </div>
  );
}