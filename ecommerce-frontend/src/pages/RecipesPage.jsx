import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function RecipesPage() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const hardcodedRecipes = [
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
  ];
  
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
    return <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading recipes...</div>;
  }
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Delicious Community Recipe Collection</h1>
      
      {isAuthenticated && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <Link to="/recipes/create" style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            borderRadius: 'var(--border-radius-sm)',
            textDecoration: 'none'
          }}>
            Create New Recipe
          </Link>
        </div>
      )}
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--spacing-lg)'
      }}>
        {recipes.map(recipe => (
          <div key={recipe.id} style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-md)',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ 
              height: '200px',
              background: `url(${recipe.image}) center/cover no-repeat`
            }}></div>
            <h3 style={{ margin: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)' }}>{recipe.title}</h3>
            <p style={{ margin: '0 var(--spacing-md) var(--spacing-md)', color: 'var(--color-text-light)' }}>
              {recipe.description}
            </p>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-xs)',
              margin: '0 var(--spacing-md)',
              color: 'var(--color-text-light)',
              fontSize: '0.8rem'
            }}>
              {recipe.dietary && recipe.dietary.map((diet, index) => (
                <React.Fragment key={diet}>
                  <span>{diet}</span>
                  {index < recipe.dietary.length - 1 && <span>•</span>}
                </React.Fragment>
              ))}
            </div>
            <Link to={`/recipes/${recipe.id}`} style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-sm) 0',
              marginTop: 'var(--spacing-md)',
              transition: 'background-color 0.2s ease',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>View Recipe</Link>
          </div>
        ))}
      </div>
    </div>
  );
}