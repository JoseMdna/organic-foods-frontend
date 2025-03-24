import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipesPage() {
  const recipes = [
    {
      id: 'summer-salad',
      title: 'Summer Vegetable Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format',
      description: 'Fresh, crisp, and perfect for warm days',
      dietary: ['Organic', 'Vegan', 'Gluten-Free']
    },
    {
      id: 'berry-smoothie',
      title: 'Berry Protein Smoothie',
      image: 'https://images.unsplash.com/photo-1553530979-572530c22dbc?w=500&auto=format',
      description: 'Start your day with antioxidants and energy',
      dietary: ['Vegetarian', 'Antioxidant-Rich']
    },
    {
      id: 'quinoa-bowl',
      title: 'Organic Quinoa Bowl',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format',
      description: 'Nutrient-packed complete meal with local vegetables',
      dietary: ['Organic', 'Protein-Rich', 'Vegan']
    },
    {
      id: 'avocado-toast',
      title: 'Avocado Toast with Microgreens',
      image: 'https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?w=500&auto=format',
      description: 'Simple, nourishing breakfast with healthy fats',
      dietary: ['Vegetarian', 'High-Protein', 'Healthy Fats']
    },
    {
      id: 'roasted-veggies',
      title: 'Roasted Root Vegetables',
      image: 'https://images.unsplash.com/photo-1675257163553-7b49d2f4ce0f?w=500&auto=format',
      description: 'Seasonal comfort food loaded with nutrients',
      dietary: ['Organic', 'Vegan', 'Gluten-Free', 'Local']
    },
    {
      id: 'lentil-soup',
      title: 'Hearty Lentil Soup',
      image: 'https://images.unsplash.com/photo-1599321989365-3d1af1d2be15?w=500&auto=format',
      description: 'Protein-rich vegan soup perfect for cool days',
      dietary: ['Organic', 'Vegan', 'High-Protein']
    }
  ];
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Farm-to-Table Recipe Collection</h1>
      
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
              {recipe.dietary.map((diet, index) => (
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