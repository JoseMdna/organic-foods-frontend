import { getCuratedProducts } from '../mockData';
import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const curatedProducts = getCuratedProducts();
    setProducts(curatedProducts);
    setFilteredProducts(curatedProducts);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    if (activeFilters.category !== 'all') {
      result = result.filter(product => 
        product.category === activeFilters.category
      );
    }
    
    if (activeFilters.dietary.length > 0) {
      result = result.filter(product => 
        activeFilters.dietary.every(diet => {
          return product[diet] === true;
        })
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        const productName = (product.name || "").toLowerCase();
        const productDesc = (product.description || "").toLowerCase();
        
        return productName.includes(query) || productDesc.includes(query);
      });
    }
    
    setFilteredProducts(result);
  }, [activeFilters, searchQuery, products]);

  const handleCategoryChange = (category) => {
    setActiveFilters({...activeFilters, category});
  };

  const handleDietaryChange = (diet) => {
    const newDietary = activeFilters.dietary.includes(diet)
      ? activeFilters.dietary.filter(d => d !== diet)
      : [...activeFilters.dietary, diet];
    
    setActiveFilters({...activeFilters, dietary: newDietary});
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  
  return (
    <div className="home-container">
      <section className="hero" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${process.env.PUBLIC_URL}/images/hero-bg.jpg)`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}>
        <h1 style={{ color: '#ffffff' }}>Fresh Organic Food.</h1>
        <p style={{ color: '#ffffff' }}>Locally sourced, sustainably grown, ethically harvested</p>
      </section>
      
      <section className="filters">
        <div className="search">
          <input 
            type="text" 
            id="product-search"
            name="product-search"
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="category-filters">
          <button 
            id="filter-all"
            name="filter-all"
            className={activeFilters.category === 'all' ? 'active' : ''} 
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          <button 
            id="filter-vegetables"
            name="filter-vegetables"
            className={activeFilters.category === 'vegetables' ? 'active' : ''} 
            onClick={() => handleCategoryChange('vegetables')}
          >
            Vegetables
          </button>
          <button 
            id="filter-fruits"
            name="filter-fruits"
            className={activeFilters.category === 'fruits' ? 'active' : ''} 
            onClick={() => handleCategoryChange('fruits')}
          >
            Fruits
          </button>
          <button 
            id="filter-dairy"
            name="filter-dairy"
            className={activeFilters.category === 'dairy' ? 'active' : ''} 
            onClick={() => handleCategoryChange('dairy')}
          >
            Dairy
          </button>
          <button 
            id="filter-grains"
            name="filter-grains"
            className={activeFilters.category === 'grains' ? 'active' : ''} 
            onClick={() => handleCategoryChange('grains')}
          >
            Grains
          </button>
          <button 
            id="filter-meat"
            name="filter-meat"
            className={activeFilters.category === 'meat' ? 'active' : ''} 
            onClick={() => handleCategoryChange('meat')}
          >
            Meat
          </button>
        </div>
        
        <div className="dietary-filters">
          <label>
            <input 
              type="checkbox" 
              id="filter-organic"
              name="filter-organic"
              checked={activeFilters.dietary.includes('organic')}
              onChange={() => handleDietaryChange('organic')}
            />
            Organic
          </label>
          <label>
            <input 
              type="checkbox" 
              id="filter-vegan"
              name="filter-vegan"
              checked={activeFilters.dietary.includes('vegan')}
              onChange={() => handleDietaryChange('vegan')}
            />
            Vegan
          </label>
          <label>
            <input 
              type="checkbox" 
              id="filter-gluten-free"
              name="filter-gluten-free"
              checked={activeFilters.dietary.includes('glutenFree')}
              onChange={() => handleDietaryChange('glutenFree')}
            />
            Gluten-Free
          </label>
          <label>
            <input 
              type="checkbox" 
              id="filter-local"
              name="filter-local"
              checked={activeFilters.dietary.includes('local')}
              onChange={() => handleDietaryChange('local')}
            />
            Locally Sourced
          </label>
        </div>
      </section>
      
      <section className="featured">
        <h2>Featured Foods</h2>
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-results">No products match your filters. Try adjusting your search criteria.</p>
          )}
        </div>
      </section>
      
      <section className="recipes-preview">
        <h2>Tasty Recipe Ideas</h2>
        <div className="recipes-grid">
          <div className="recipe-card">
          <div className="recipe-image" style={{ height: '200px', overflow: 'hidden' }}>
  <img 
    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop&q=80" 
    alt="Summer vegetable salad" 
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>
            <h3>Summer Vegetable Salad</h3>
            <p>Fresh, crisp, and perfect for warm days</p>
            <div className="recipe-nutrition">
              <span>Organic</span> <span className="divider">•</span> <span>Vegan</span> <span className="divider">•</span> <span>Gluten-Free</span>
            </div>
            <Link to="/recipes/summer-salad" className="recipe-link">View Recipe</Link>
          </div>
          
          <div className="recipe-card">
          <div className="recipe-image" style={{ height: '200px', overflow: 'hidden' }}>
  <img 
    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop&q=80" 
    alt="Organic quinoa bowl" 
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>
            <h3>Organic Quinoa Bowl</h3>
            <p>Nutrient-packed complete meal with local vegetables</p>
            <div className="recipe-nutrition">
              <span>Organic</span> <span className="divider">•</span> <span>Protein-Rich</span> <span className="divider">•</span> <span>Vegan</span>
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