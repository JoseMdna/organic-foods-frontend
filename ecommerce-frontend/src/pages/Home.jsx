import { getCuratedProducts } from '../mockData';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../api';
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
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      setRecipesLoading(true);
      try {
        const response = await api.recipes.getAll();
        if (response.data && response.data.length > 0) {
          setFeaturedRecipes(response.data.slice(0, 2));
        }
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
      } finally {
        setRecipesLoading(false);
      }
    };
    
  fetchFeaturedRecipes();
}, []);

useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchQuery(search);
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
    const value = e.target.value;
    setSearchQuery(value);
    
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    const newSearch = params.toString() ? `?${params.toString()}` : '';
    navigate(`/${newSearch}`, { replace: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
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
            onKeyDown={handleKeyDown}
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
          {recipesLoading ? (
            <div className="recipe-card">
              <div className="recipe-image" style={{ 
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-background)'
              }}>
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading recipes...</div>
              </div>
              <h3>Loading Recipes</h3>
              <p>Please wait while we fetch our delicious recipes</p>
            </div>
          ) : featuredRecipes.length > 0 ? (
            featuredRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image" style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=800&fit=crop&q=80";
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="recipe-nutrition">
                  {recipe.dietary && recipe.dietary.map((diet, index) => (
                    <React.Fragment key={diet}>
                      <span>{diet}</span>
                      {index < recipe.dietary.length - 1 && <span className="divider">•</span>}
                    </React.Fragment>
                  ))}
                </div>
                <Link to={`/recipes/${recipe.id}`} className="recipe-link">View Recipe</Link>
              </div>
            ))
          ) : (
            <div className="recipe-card">
              <div className="recipe-image" style={{ 
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-background)'
              }}>
                <div style={{ padding: '20px', textAlign: 'center' }}>No Recipes Available</div>
              </div>
              <h3>Create Your First Recipe</h3>
              <p>Head to the recipes page to create and share your culinary creations</p>
              <Link to="/recipes" className="recipe-link">View Recipes</Link>
            </div>
          )}
        </div>
        <div className="view-all-recipes">
          <Link to="/recipes">View All Recipes</Link>
        </div>
      </section>
    </div>
  );
}