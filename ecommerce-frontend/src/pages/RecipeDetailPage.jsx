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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    setImageError(false);
    
    const fetchRecipe = async () => {
      try {
        const response = await api.recipes.getById(recipeId);
        if (response.data) {
          setRecipe(response.data);
          setLoading(false);
        } else {
          setError("Recipe not found");
          setLoading(false);
        }
      } catch (error) {
        setError("Recipe not found");
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (isAuthenticated && currentUser && recipe.created_by_username === currentUser.username) {
        await api.recipes.delete(recipeId);
        navigate('/recipes');
      } else {
        setError('You do not have permission to delete this recipe');
        setShowDeleteModal(false);
      }
    } catch (error) {
      setError('Failed to delete recipe');
      setShowDeleteModal(false);
    }
  };
  
  const handleImageError = () => {
    setImageError(true);
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
          marginTop: 'var(--spacing-lg)',
          textDecoration: 'none',
          transition: "background-color 0.2s ease"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "var(--color-secondary)"}
        onMouseOut={(e) => e.target.style.backgroundColor = "var(--color-primary)"}
        >Back to All Recipes</Link>
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
          <button onClick={handleDeleteClick} style={{
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
        backgroundColor: imageError ? 'var(--color-background)' : undefined,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!imageError ? (
          <img 
            src={recipe.image} 
            alt={recipe.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={handleImageError}
          />
        ) : (
          <div style={{ 
            color: 'var(--color-text-light)',
            fontSize: '1.2rem'
          }}>
            {recipe.title}
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-md)',
        maxWidth: '100%'
      }}>
        {recipe.dietary && recipe.dietary.map(diet => (
          <span key={diet} style={{
            display: 'inline-block',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.875rem',
            marginBottom: 'var(--spacing-xs)'
          }}>{diet}</span>
        ))}
      </div>
      
      <p style={{ 
        marginBottom: 'var(--spacing-lg)',
        lineHeight: '1.6'
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
              <li key={index} style={{ marginBottom: 'var(--spacing-sm)', lineHeight: '1.5' }}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Instructions</h2>
          <ol style={{ listStylePosition: 'inside' }}>
            {recipe.instructions && recipe.instructions.map((step, index) => (
              <li key={index} style={{ marginBottom: 'var(--spacing-sm)', lineHeight: '1.5' }}>{step}</li>
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
          fontWeight: '500',
          textDecoration: 'none',
          transition: "background-color 0.2s ease"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "var(--color-secondary)"}
        onMouseOut={(e) => e.target.style.backgroundColor = "var(--color-primary)"}
        >Back to All Recipes</Link>
      </div>

      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--border-radius-md)',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ marginTop: 0 }}>Delete Recipe</h3>
            <p>Are you sure you want to delete "{recipe.title}"? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: 'none',
                  border: '1px solid #ccc',
                  borderRadius: 'var(--border-radius-sm)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: '#d9534f',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}