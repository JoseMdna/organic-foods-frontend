import React, { useEffect, useState } from 'react';
import { getCuratedProducts } from '../mockData';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../contexts/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    setProduct(null);
    
    api.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        const curatedProducts = getCuratedProducts();
        const foundProduct = curatedProducts.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setProduct(curatedProducts[0]);
        }
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

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
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
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
  <p>{product.sourcing || 'We partner with local farmers who practice sustainable agriculture. Our products are grown without synthetic pesticides and harvested at peak ripeness to ensure maximum nutrition and flavor. By choosing this product, you\'re supporting environmentally responsible farming practices and reducing food miles.'}</p>
  
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
  
  <h3>Storage Tips</h3>
  <p>{product.storageTips || 'For best quality, store in refrigerator and consume within a few days of purchase.'}</p>
</div>
    </div>
  );
}