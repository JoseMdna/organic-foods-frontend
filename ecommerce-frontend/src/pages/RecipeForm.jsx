import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function RecipeForm() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
      api.recipes.getById(recipeId)
        .then(res => {
          if (res.data) {
            setRecipe(res.data);
          }
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
    if (recipe.ingredients.length <= 1) return;
    
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
    if (recipe.instructions.length <= 1) return;
    
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
    
    if (isEditMode) {
      delete recipeToSubmit.created_by;
      delete recipeToSubmit.created_by_username;
      delete recipeToSubmit.created_at;
      delete recipeToSubmit.updated_at;
      delete recipeToSubmit.id;
    }
    
    if (!recipeToSubmit.image || recipeToSubmit.image.trim() === '') {
      recipeToSubmit.image = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format';
    } else {
      recipeToSubmit.image = recipeToSubmit.image.trim();
    }
    
    recipeToSubmit.ingredients = recipeToSubmit.ingredients.filter(item => item.trim() !== '');
    if (recipeToSubmit.ingredients.length === 0) {
      recipeToSubmit.ingredients = ['Add your ingredients'];
    }
    
    recipeToSubmit.instructions = recipeToSubmit.instructions.filter(item => item.trim() !== '');
    if (recipeToSubmit.instructions.length === 0) {
      recipeToSubmit.instructions = ['Add your instructions'];
    }
    
    if (!Array.isArray(recipeToSubmit.dietary)) {
      recipeToSubmit.dietary = [];
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isEditMode) {
        await api.recipes.update(recipeId, recipeToSubmit);
        navigate('/recipes');
      } else {
        await api.recipes.create(recipeToSubmit);
        navigate('/recipes');
      }
    } catch (err) {
      console.error("Recipe save error:", err);
      
      if (err.response?.status === 403) {
        setError('You must be logged in to create or edit recipes');
      } else if (err.response?.data && typeof err.response.data === 'object') {
        if (err.response.data.image) {
          setError('Please enter a valid image URL or leave blank for default image');
        } else {
          const errorMessages = Object.entries(err.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          setError(errorMessages);
        }
      } else {
        setError('Failed to save recipe. Please try again.');
      }
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
            style={{ 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              borderRadius: 'var(--border-radius-sm)'
            }}
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
                  name={`diet-${diet.toLowerCase()}`}
                  id={`diet-${diet.toLowerCase()}`}
                  checked={recipe.dietary.includes(diet)}
                  onChange={() => handleDietaryChange(diet)}
                />
                {diet}
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '1rem', fontWeight: '500' }}>
            Ingredients
          </h3>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: 'var(--spacing-sm)' }}>
              <input
                type="text"
                id={`ingredient-${index}`}
                name={`ingredient-${index}`}
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required
                style={{ flex: 1, padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)' }}
                aria-label={`Ingredient ${index + 1}`}
              />
              <button
                type="button"
                id={`remove-ingredient-${index}`}
                name={`remove-ingredient-${index}`}
                onClick={() => removeIngredient(index)}
                disabled={recipe.ingredients.length <= 1}
                style={{ 
                  marginLeft: 'var(--spacing-sm)',
                  backgroundColor: recipe.ingredients.length <= 1 ? '#ccc' : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0 var(--spacing-sm)',
                  cursor: recipe.ingredients.length <= 1 ? 'not-allowed' : 'pointer'
                }}
                aria-label={`Remove ingredient ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            id="add-ingredient"
            name="add-ingredient"
            onClick={addIngredient}
            style={{ 
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--border-radius-sm)',
              cursor: 'pointer',
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(46, 107, 70, 0.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "var(--color-background)";
            }}
          >
            Add Ingredient
          </button>
        </div>
        
        <div>
          <h3 style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '1rem', fontWeight: '500' }}>
            Instructions
          </h3>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: 'var(--spacing-sm)' }}>
              <textarea
                id={`instruction-${index}`}
                name={`instruction-${index}`}
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                required
                style={{ 
                  flex: 1, 
                  padding: 'var(--spacing-sm)', 
                  borderRadius: 'var(--border-radius-sm)',
                  minHeight: '60px'
                }}
                aria-label={`Instruction ${index + 1}`}
              />
              <button
                type="button"
                id={`remove-instruction-${index}`}
                name={`remove-instruction-${index}`}
                onClick={() => removeInstruction(index)}
                disabled={recipe.instructions.length <= 1}
                style={{ 
                  marginLeft: 'var(--spacing-sm)',
                  backgroundColor: recipe.instructions.length <= 1 ? '#ccc' : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0 var(--spacing-sm)',
                  alignSelf: 'flex-start',
                  cursor: recipe.instructions.length <= 1 ? 'not-allowed' : 'pointer'
                }}
                aria-label={`Remove instruction ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            id="add-instruction"
            name="add-instruction"
            onClick={addInstruction}
            style={{ 
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--border-radius-sm)',
              cursor: 'pointer',
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(46, 107, 70, 0.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "var(--color-background)";
            }}
          >
            Add Instruction
          </button>
        </div>
        
        <button
          type="submit"
          id="save-recipe"
          name="save-recipe"
          disabled={isLoading}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius-sm)',
            marginTop: 'var(--spacing-md)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Saving...' : (isEditMode ? 'Update Recipe' : 'Create Recipe')}
        </button>
      </form>
    </div>
  );
}