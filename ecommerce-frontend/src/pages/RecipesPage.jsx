import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import './RecipesPage.css';

export default function RecipesPage() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const hardcodedRecipes = useMemo(() => [
    {
      id: 'summer-salad',
      title: 'Summer Vegetable Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format',
      description: 'Fresh, crisp, and perfect for warm days',
      dietary: ['Organic', 'Vegan', 'Gluten-Free']
    },
    {
      id: 'quinoa-bowl',
      title: 'Organic Quinoa Bowl',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format',
      description: 'Nutrient-packed complete meal with local vegetables',
      dietary: ['Organic', 'Protein-Rich', 'Vegan']
    }
  ], []);
  
  useEffect(() => {
    setLoading(true);
    
    api.get('/recipes/')
      .then(res => {
        const apiRecipes = res.data.map(recipe => ({
          ...recipe,
          id: recipe.id.toString()
        }));
        
        setRecipes([...apiRecipes, ...hardcodedRecipes]);
        setLoading(false);
      })
      .catch(err => {
        setRecipes(hardcodedRecipes);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }
  
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
        {recipes.map(recipe => (
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
        ))}
      </div>
    </div>
  );
}