import { Link } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './Home.css';


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
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...products];
    
    // Category filter
    if (activeFilters.category !== 'all') {
      result = result.filter(product => product.category === activeFilters.category);
    }
    
    // Dietary filters
    if (activeFilters.dietary.length > 0) {
      result = result.filter(product => 
        activeFilters.dietary.every(diet => product[diet] === true)
      );
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
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
      <section className="hero">
        <h1>Fresh Organic Food Delivered to Your Door</h1>
        <p>Locally sourced, sustainably grown, ethically harvested</p>
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
      <div style={{ height: '200px', backgroundColor: 'var(--color-secondary)', opacity: 0.7 }}></div>
      <h3>Summer Vegetable Salad</h3>
      <p>Fresh, crisp, and perfect for warm days</p>
      <div className="recipe-nutrition">
        <span>Organic</span> • <span>Vegan</span> • <span>Gluten-Free</span>
      </div>
      <Link to="/recipes/summer-salad" className="recipe-link">View Recipe</Link>
    </div>
    <div className="recipe-card">
      <div style={{ height: '200px', backgroundColor: 'var(--color-accent)', opacity: 0.7 }}></div>
      <h3>Berry Protein Smoothie</h3>
      <p>Start your day with antioxidants and energy</p>
      <div className="recipe-nutrition">
        <span>Vegetarian</span> • <span>Antioxidant-Rich</span>
      </div>
      <Link to="/recipes/berry-smoothie" className="recipe-link">View Recipe</Link>
    </div>
    <div className="recipe-card">
      <div style={{ height: '200px', backgroundColor: 'var(--color-primary)', opacity: 0.7 }}></div>
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