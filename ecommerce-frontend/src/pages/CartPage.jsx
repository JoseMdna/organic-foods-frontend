import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

export default function CartPage() { 
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/" className="button-primary">Continue Shopping</Link>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image_url} alt={item.name} />
            </div>
            
            <div className="cart-item-details">
              <Link to={`/products/${item.id}`} className="item-name">{item.name}</Link>
              <p className="item-price">${item.price}</p>
            </div>
            
            <div className="cart-item-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  aria-label="Decrease quantity"
                >-</button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >+</button>
              </div>
              
              <button 
                className="remove-item" 
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
            
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
        
        <div className="cart-totals">
          <div className="subtotal">
            <span>Subtotal</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="shipping">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          
          <button className="checkout-button">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}