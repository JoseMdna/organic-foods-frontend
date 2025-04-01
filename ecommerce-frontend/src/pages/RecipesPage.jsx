import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import './RecipesPage.css';

export default function RecipesPage() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await api.recipes.getAll();
        setRecipes(response.data);
      } catch (error) {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [location.key]);
  
  if (loading) return <div className="loading">Loading recipes...</div>;
  
  return (
    <div className="recipes-container">
      <h1>Community Recipe Collection</h1>
      
      {isAuthenticated && (
        <div className="create-recipe">
          <Link to="/recipes/create" className="create-button">
            Create New Recipe
          </Link>
        </div>
      )}
      
      <div className="recipes-grid">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=800&fit=crop&q=80";
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
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
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <p>No recipes found. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}