import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function RecipeDetailPage() {
  const { recipeId } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const hardcodedRecipes = {
    'summer-salad': {
      title: 'Summer Vegetable Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format',
      description: 'A refreshing summer salad made with fresh, organic vegetables.',
      ingredients: [
        '2 cups mixed organic greens',
        '1 organic cucumber, sliced',
        '1 organic bell pepper, diced',
        '1 cup cherry tomatoes, halved',
        '1/4 cup red onion, thinly sliced',
        '1/4 cup olive oil',
        '2 tbsp balsamic vinegar',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Wash and prepare all vegetables.',
        'Combine greens, cucumber, bell pepper, tomatoes, and onion in a large bowl.',
        'Whisk together olive oil, vinegar, salt, and pepper.',
        'Drizzle dressing over salad and toss gently.',
        'Serve immediately and enjoy!'
      ],
      dietary: ['Organic', 'Vegan', 'Gluten-Free']
    },
    'berry-smoothie': {
      title: 'Berry Protein Smoothie',
      image: 'https://images.unsplash.com/photo-1553530979-572530c22dbc?w=500&auto=format',
      description: 'Start your day with this antioxidant-rich smoothie packed with protein.',
      ingredients: [
        '1 cup mixed organic berries (strawberries, blueberries, raspberries)',
        '1 banana',
        '1 cup organic Greek yogurt',
        '1 tbsp honey or maple syrup',
        '1/2 cup almond milk',
        '1 tbsp chia seeds'
      ],
      instructions: [
        'Add all ingredients to a blender.',
        'Blend until smooth and creamy.',
        'Pour into a glass and top with additional berries if desired.',
        'Enjoy immediately!'
      ],
      dietary: ['Vegetarian', 'Antioxidant-Rich']
    },
    'quinoa-bowl': {
      title: 'Organic Quinoa Bowl',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format',
      description: 'A nutrient-packed complete meal with local vegetables and protein-rich quinoa.',
      ingredients: [
        '1 cup organic quinoa',
        '2 cups vegetable broth',
        '1 cup organic kale, chopped',
        '1 organic sweet potato, diced and roasted',
        '1/2 cup organic chickpeas, drained and rinsed',
        '1/4 cup sliced almonds',
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Rinse quinoa and cook in vegetable broth according to package instructions.',
        'Roast sweet potato with olive oil at 400°F for 25 minutes.',
        'In a large bowl, combine cooked quinoa, kale, roasted sweet potato, and chickpeas.',
        'Whisk together olive oil, lemon juice, salt, and pepper.',
        'Drizzle dressing over the bowl and top with sliced almonds.',
        'Serve warm or cold.'
      ],
      dietary: ['Organic', 'Protein-Rich', 'Vegan']
    },
    'avocado-toast': {
      title: 'Avocado Toast with Microgreens',
      image: 'https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?w=500&auto=format',
      description: 'A simple, nutritious breakfast loaded with healthy fats and protein.',
      ingredients: [
        '2 slices organic whole grain bread',
        '1 ripe avocado',
        '1/4 cup microgreens',
        '2 eggs (optional)',
        'Red pepper flakes',
        'Salt and pepper to taste',
        'Lemon juice'
      ],
      instructions: [
        'Toast the bread until golden brown.',
        'Mash the avocado in a bowl with a fork, adding salt, pepper and a squeeze of lemon juice.',
        'Spread the mashed avocado on the toast.',
        'Top with microgreens and red pepper flakes.',
        'For extra protein, add a poached or fried egg on top.'
      ],
      dietary: ['Vegetarian', 'High-Protein', 'Healthy Fats']
    }
  };

  useEffect(() => {
    setLoading(true);
    
    if (!isNaN(parseInt(recipeId))) {
      api.get(`/recipes/${recipeId}/`)
        .then(res => {
          setRecipe(res.data);
          setLoading(false);
        })
        .catch(err => {
          if (hardcodedRecipes[recipeId]) {
            setRecipe(hardcodedRecipes[recipeId]);
          } else {
            setError("Recipe not found");
          }
          setLoading(false);
        });
    } else if (hardcodedRecipes[recipeId]) {
      setRecipe(hardcodedRecipes[recipeId]);
      setLoading(false);
    } else {
      setError("Recipe not found");
      setLoading(false);
    }
  }, [recipeId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${recipeId}/`);
        navigate('/recipes');
      } catch (error) {
        alert('Failed to delete recipe');
      }
    }
  };
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading recipe...</div>;
  }
  
  if (error || !recipe) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <p>Sorry, we couldn't find that recipe.</p>
        <Link to="/recipes" style={{
          display: 'inline-block',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)',
          borderRadius: 'var(--border-radius-sm)',
          marginTop: 'var(--spacing-lg)'
        }}>Back to All Recipes</Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'var(--spacing-xl) var(--spacing-md)'
    }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>{recipe.title}</h1>
      
      {isAuthenticated && currentUser && recipe.created_by_username === currentUser.username && (
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <Link to={`/recipes/edit/${recipeId}`} style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            borderRadius: 'var(--border-radius-sm)',
            textDecoration: 'none'
          }}>
            Edit Recipe
          </Link>
          <button onClick={handleDelete} style={{
            backgroundColor: '#d9534f',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer'
          }}>
            Delete Recipe
          </button>
        </div>
      )}
      
      <div style={{ 
        height: '300px',
        borderRadius: 'var(--border-radius-md)',
        overflow: 'hidden',
        marginBottom: 'var(--spacing-lg)',
        background: `url(${recipe.image}) center/cover no-repeat` 
      }}></div>
      
      <div style={{ 
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-md)'
      }}>
        {recipe.dietary && recipe.dietary.map(diet => (
          <span key={diet} style={{
            display: 'inline-block',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.875rem'
          }}>{diet}</span>
        ))}
      </div>
      
      <p style={{ 
        marginBottom: 'var(--spacing-lg)'
      }}>{recipe.description}</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Ingredients</h2>
          <ul style={{ listStylePosition: 'inside' }}>
            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
              <li key={index} style={{ marginBottom: 'var(--spacing-sm)' }}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Instructions</h2>
          <ol style={{ listStylePosition: 'inside' }}>
            {recipe.instructions && recipe.instructions.map((step, index) => (
              <li key={index} style={{ marginBottom: 'var(--spacing-sm)' }}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
        <Link to="/recipes" style={{
          display: 'inline-block',
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)',
          borderRadius: 'var(--border-radius-sm)',
          fontWeight: '500'
        }}>Back to All Recipes</Link>
      </div>
    </div>
  );
}