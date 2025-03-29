import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function RecipeForm() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: '',
    dietary: [],
    ingredients: [''],
    instructions: [''],
  });
  
  const isEditMode = !!recipeId;
  
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      api.get(`/recipes/${recipeId}/`)
        .then(res => {
          setRecipe(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          setError('Failed to load recipe');
          setIsLoading(false);
        });
    }
  }, [recipeId, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDietaryChange = (diet) => {
    setRecipe(prev => {
      const newDietary = prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet];
      return { ...prev, dietary: newDietary };
    });
  };
  
  const handleIngredientChange = (index, value) => {
    setRecipe(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };
  
  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };
  
  const removeIngredient = (index) => {
    setRecipe(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients.splice(index, 1);
      return { ...prev, ingredients: newIngredients };
    });
  };
  
  const handleInstructionChange = (index, value) => {
    setRecipe(prev => {
      const newInstructions = [...prev.instructions];
      newInstructions[index] = value;
      return { ...prev, instructions: newInstructions };
    });
  };
  
  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };
  
  const removeInstruction = (index) => {
    setRecipe(prev => {
      const newInstructions = [...prev.instructions];
      newInstructions.splice(index, 1);
      return { ...prev, instructions: newInstructions };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to create or edit recipes');
      return;
    }
    
    const recipeToSubmit = { ...recipe };
    if (!recipeToSubmit.image || recipeToSubmit.image.trim() === '') {
      recipeToSubmit.image = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format';
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isEditMode) {
        await api.put(`/recipes/${recipeId}/`, recipeToSubmit);
        navigate(`/recipes/${recipeId}`);
      } else {
        const response = await api.post('/recipes/', recipeToSubmit);
        navigate(`/recipes/${response.data.id}`);
      }
    } catch (err) {
      setError('Failed to save recipe. Please try again.');
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h2>Please log in</h2>
        <p>You need to be logged in to create or edit recipes.</p>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <h1>{isEditMode ? 'Edit Recipe' : 'Create Recipe'}</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: 'var(--spacing-md)', 
          borderRadius: 'var(--border-radius-sm)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Recipe Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)' }}
          />
        </div>
        
        <div>
          <label htmlFor="image" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Image URL (optional)
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={recipe.image}
            onChange={handleChange}
            style={{ width: '100%', padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)' }}
            placeholder="Enter image URL (optional)"
          />
        </div>
        
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              borderRadius: 'var(--border-radius-sm)',
              minHeight: '100px'
            }}
          />
        </div>
        
        <div>
          <p style={{ marginBottom: 'var(--spacing-sm)' }}>Dietary Options</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
            {['Organic', 'Vegan', 'Vegetarian', 'Gluten-Free', 'High-Protein', 'Low-Carb'].map(diet => (
              <label key={diet} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <input
                  type="checkbox"
                  checked={recipe.dietary.includes(diet)}
                  onChange={() => handleDietaryChange(diet)}
                />
                {diet}
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
            Ingredients
          </label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: 'var(--spacing-sm)' }}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                style={{ flex: 1, padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)' }}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                style={{ 
                  marginLeft: 'var(--spacing-sm)',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0 var(--spacing-sm)'
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            style={{ 
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--border-radius-sm)'
            }}
          >
            Add Ingredient
          </button>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
            Instructions
          </label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: 'var(--spacing-sm)' }}>
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: 'var(--spacing-sm)', 
                  borderRadius: 'var(--border-radius-sm)',
                  minHeight: '60px'
                }}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                style={{ 
                  marginLeft: 'var(--spacing-sm)',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0 var(--spacing-sm)',
                  alignSelf: 'flex-start'
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            style={{ 
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--border-radius-sm)'
            }}
          >
            Add Instruction
          </button>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius-sm)',
            marginTop: 'var(--spacing-md)'
          }}
        >
          {isLoading ? 'Saving...' : (isEditMode ? 'Update Recipe' : 'Create Recipe')}
        </button>
      </form>
    </div>
  );
}