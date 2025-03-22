import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

const loadInitialState = () => {
  try {
    const savedCart = localStorage.getItem('organicEatsCart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    return initialState;
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return initialState;
  }
};

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        
        newState = {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.price * action.payload.quantity)
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.price * action.payload.quantity)
        };
      }
      break;
      
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      
      if (!itemToRemove) return state;
      
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
      };
      break;
      
    case 'UPDATE_QUANTITY':
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (itemIndex === -1) return state;
      
      const oldQuantity = state.items[itemIndex].quantity;
      const quantityDiff = action.payload.quantity - oldQuantity;
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: action.payload.quantity
      };
      
      newState = {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (state.items[itemIndex].price * quantityDiff)
      };
      break;
      
    case 'CLEAR_CART':
      newState = initialState;
      break;
      
    default:
      return state;
  }
  
  try {
    localStorage.setItem('organicEatsCart', JSON.stringify(newState));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
  
  return newState;
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState, loadInitialState);
  
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        price: product.price,
        quantity
      }
    });
  };
  
  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId
    });
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        id: productId,
        quantity
      }
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};