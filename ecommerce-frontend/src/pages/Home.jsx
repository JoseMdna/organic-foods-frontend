import { getCuratedProducts } from '../mockData';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './Home.css';
import heroImage from './hero-bg.jpg'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    dietary: [],
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/products/')
      .then(res => {
        const normalizedProducts = res.data.map(product => ({
          ...product,
          id: product.id || Math.random().toString(),
          name: product.name || product.product_name || "Unnamed Product",
          description: product.description || product.short_description || "",
          price: product.price || 0,
          image_url: product.image_url || product.image || "",
          organic: Boolean(product.organic),
          vegan: Boolean(product.vegan),
          glutenFree: Boolean(product.glutenFree),
          local: Boolean(product.local)
        }));
        
        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
        setLoading(false);
      })
      .catch(err => {
        const curatedProducts = getCuratedProducts();
        setProducts(curatedProducts);
        setFilteredProducts(curatedProducts);
        setLoading(false);
      });
  }, []);
  
  const applyFilters = useCallback(() => {
    let result = [...products];
    
    if (activeFilters.category !== 'all') {
      result = result.filter(product => 
        product.category === activeFilters.category || 
        (product.category_id && product.category_id.toString() === activeFilters.category)
      );
    }
    
    if (activeFilters.dietary.length > 0) {
      result = result.filter(product => 
        activeFilters.dietary.every(diet => {
          return product[diet] === true || 
                 product[diet] === "True" || 
                 product[diet] === "true" || 
                 product[diet] === 1;
        })
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        const productName = product.name || product.product_name || "";
        const productDesc = product.description || product.short_description || "";
        
        const nameMatch = productName.toLowerCase().includes(query);
        const descMatch = productDesc.toLowerCase().includes(query);
        
        return nameMatch || descMatch;
      });
    }
    
    setFilteredProducts(result);
  }, [activeFilters, searchQuery, products]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCategoryChange = (category) => {
    setActiveFilters({...activeFilters, category});
  };

  const handleDietaryChange = (diet) => {
    const newDietary = activeFilters.dietary.includes(diet)
      ? activeFilters.dietary.filter(d => d !== diet)
      : [...activeFilters.dietary, diet];
    
    setActiveFilters({...activeFilters, dietary: newDietary});
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="home-container">
      <section className="hero" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}>
        <h1 style={{ color: '#ffffff' }}>Fresh Organic Food Delivered to Your Door</h1>
        <p style={{ color: '#ffffff' }}>Locally sourced, sustainably grown, ethically harvested</p>
      </section>
      
      <section className="filters">
        <div className="search">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="category-filters">
          <button 
            className={activeFilters.category === 'all' ? 'active' : ''} 
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          <button 
            className={activeFilters.category === 'vegetables' ? 'active' : ''} 
            onClick={() => handleCategoryChange('vegetables')}
          >
            Vegetables
          </button>
          <button 
            className={activeFilters.category === 'fruits' ? 'active' : ''} 
            onClick={() => handleCategoryChange('fruits')}
          >
            Fruits
          </button>
          <button 
            className={activeFilters.category === 'dairy' ? 'active' : ''} 
            onClick={() => handleCategoryChange('dairy')}
          >
            Dairy
          </button>
          <button 
            className={activeFilters.category === 'grains' ? 'active' : ''} 
            onClick={() => handleCategoryChange('grains')}
          >
            Grains
          </button>
        </div>
        
        <div className="dietary-filters">
          <label>
            <input 
              type="checkbox" 
              checked={activeFilters.dietary.includes('organic')}
              onChange={() => handleDietaryChange('organic')}
            />
            Organic
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={activeFilters.dietary.includes('vegan')}
              onChange={() => handleDietaryChange('vegan')}
            />
            Vegan
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={activeFilters.dietary.includes('glutenFree')}
              onChange={() => handleDietaryChange('glutenFree')}
            />
            Gluten-Free
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={activeFilters.dietary.includes('local')}
              onChange={() => handleDietaryChange('local')}
            />
            Locally Sourced
          </label>
        </div>
      </section>
      
      <section className="featured">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-results">No products match your filters.</p>
          )}
        </div>
      </section>
      
      <section className="recipes-preview">
        <h2>Farm-to-Table Recipe Ideas</h2>
        <div className="recipes-grid">
          <div className="recipe-card">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format" 
              alt="Summer vegetable salad" 
              style={{ height: '200px', width: '100%', objectFit: 'cover' }}
            />
            <h3>Summer Vegetable Salad</h3>
            <p>Fresh, crisp, and perfect for warm days</p>
            <div className="recipe-nutrition">
              <span>Organic</span> • <span>Vegan</span> • <span>Gluten-Free</span>
            </div>
            <Link to="/recipes/summer-salad" className="recipe-link">View Recipe</Link>
          </div>
          
          <div className="recipe-card">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format" 
              alt="Organic quinoa bowl" 
              style={{ height: '200px', width: '100%', objectFit: 'cover' }}
            />
            <h3>Organic Quinoa Bowl</h3>
            <p>Nutrient-packed complete meal with local vegetables</p>
            <div className="recipe-nutrition">
              <span>Organic</span> • <span>Protein-Rich</span> • <span>Vegan</span>
            </div>
            <Link to="/recipes/quinoa-bowl" className="recipe-link">View Recipe</Link>
          </div>
        </div>
        <div className="view-all-recipes">
          <Link to="/recipes">View All Recipes</Link>
        </div>
      </section>
    </div>
  );
}