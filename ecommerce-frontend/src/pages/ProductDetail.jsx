import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCuratedProducts } from '../mockData';
import { useParams } from 'react-router-dom';
import api from '../api';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    setProduct(null);
    window.scrollTo(0, 0);
    
    api.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => {
        const curatedProducts = getCuratedProducts();
        const foundProduct = curatedProducts.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setProduct(curatedProducts[0]);
        }
      });
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  const getCategoryUnit = (category) => {
    switch(category) {
      case 'vegetables':
      case 'fruits':
        return 'Price per pound';
      case 'dairy':
        return 'Price per item';
      case 'meat':
        return 'Price per pound';
      case 'grains':
        return 'Price per package';
      case 'bakery':
        return 'Price per loaf';
      case 'eggs':
        return 'Price per dozen';
      default:
        return 'Price per item';
    }
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image" style={{ 
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          overflow: 'hidden',
          borderRadius: 'var(--border-radius-md)',
          position: 'relative'
        }}>
          <img 
            src={product.image_url} 
            alt={product.name} 
            style={{
              maxWidth: '95%',
              maxHeight: '95%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
            }}
          />
        </div>
  
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-badges">
            {product.organic && <span className="badge organic">Organic</span>}
            {product.local && <span className="badge local">Locally Sourced</span>}
            {product.vegan && <span className="badge vegan">Vegan</span>}
            {product.glutenFree && <span className="badge gluten-free">Gluten-Free</span>}
          </div>
          
          <div className="pricing-info">
            <p className="product-price">${product.price}</p>
            <div className="price-details">
              <span>{getCategoryUnit(product.category)}</span>
              <span className="availability">Currently Available</span>
            </div>
          </div>
          
          <div className="product-highlights">
            <h3>Product Highlights</h3>
            <ul>
              {product.organic && <li>Certified Organic</li>}
              {product.local && <li>Locally Sourced from {product.supplierLocation || "local farms"}</li>}
              {product.vegan && <li>100% Plant-based</li>}
              {product.glutenFree && <li>Gluten-Free</li>}
              <li>Fresh Quality Guaranteed</li>
            </ul>
          </div>
          
          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>          
          
          {isAuthenticated && currentUser && product.created_by === currentUser.username && (
            <div className="product-owner-actions" style={{
              marginBottom: 'var(--spacing-md)',
              display: 'flex',
              gap: 'var(--spacing-md)'
            }}>
              <button 
                className="edit-product" 
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontWeight: '500'
                }}
              >
                Edit Product
              </button>
              <button 
                className="delete-product"
                style={{
                  backgroundColor: '#d9534f',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontWeight: '500'
                }}
              >
                Delete Product
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="product-details-grid">
        <div className="supplier-info-card">
          <h3>Available From</h3>
          <div>
            <p><strong>{product.supplierName || "Local Organic Farms"}</strong></p>
            <p>{product.supplierLocation || "Within 50 miles of your location"}</p>
            <p><strong>Contact:</strong> {product.supplierContact || "info@localorganicfarms.com"}</p>
            <p><strong>Phone:</strong> {product.supplierPhone || "(555) 123-4567"}</p>
          </div>
        </div>
        
        <div className="nutrition-card">
  <h3>Nutritional Information <span className="per-serving">(per 100g serving)</span></h3>
  <div className="nutrition-grid">
    {product.nutrition && (
      <>
        <div className="nutrition-item">
          <span>Calories</span>
          <span>{product.nutrition.calories || '0'} kcal</span>
        </div>
                <div className="nutrition-item">
                  <span>Protein</span>
                  <span>{product.nutrition.protein || '0'} g</span>
                </div>
                <div className="nutrition-item">
                  <span>Carbs</span>
                  <span>{product.nutrition.carbs || '0'} g</span>
                </div>
                <div className="nutrition-item">
                  <span>Fat</span>
                  <span>{product.nutrition.fat || '0'} g</span>
                </div>
                <div className="nutrition-item">
                  <span>Fiber</span>
                  <span>{product.nutrition.fiber || '0'} g</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="sourcing-card">
          <h3>Sourcing & Sustainability</h3>
          <p>{product.sourcing || 'We partner with local farmers who practice sustainable agriculture. Our products are grown without synthetic pesticides and harvested at peak ripeness to ensure maximum nutrition and flavor.'}</p>
        </div>
        
        <div className="environmental-card">
          <h3>Environmental Impact</h3>
          <div className="environmental-impact">
            <div className="impact-item">
              <span className="impact-label">Carbon Footprint</span>
              <div className="impact-rating">
                <span className="impact-dot filled"></span>
                <span className="impact-dot filled"></span>
                <span className="impact-dot"></span>
                <span className="impact-dot"></span>
                <span className="impact-dot"></span>
              </div>
              <span className="impact-text">Low</span>
            </div>
            <div className="impact-item">
              <span className="impact-label">Water Usage</span>
              <div className="impact-rating">
                <span className="impact-dot filled"></span>
                <span className="impact-dot filled"></span>
                <span className="impact-dot filled"></span>
                <span className="impact-dot"></span>
                <span className="impact-dot"></span>
              </div>
              <span className="impact-text">Medium</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="storage-tips-container">
      <div className="storage-tips-card">
        <h3>Storage Tips</h3>
        <p>{product.storageTips || 'For best quality, store in refrigerator and consume within a few days of purchase.'}</p>
      </div>
    </div>
  </div>
  );
}