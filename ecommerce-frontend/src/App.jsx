import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeForm from './pages/RecipeForm';
import AboutPage from './pages/AboutPage';
import Navbar from './components/Navbar';
import PlaceholderPage from './components/PlaceholderPage';
import Footer from './components/Footer';

export default function App() {
  return (
   <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
          <Route path="/categories" element={<PlaceholderPage title="Product Categories" />} />
          <Route path="/categories/:category" element={<PlaceholderPage title="Category Products" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/recipes/create" element={<RecipeForm />} />
          <Route path="/recipes/edit/:recipeId" element={<RecipeForm />} />
        </Routes>
        <Footer />
      </BrowserRouter>
  </AuthProvider>
  );
}