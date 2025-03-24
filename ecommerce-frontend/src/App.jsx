import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AboutPage from './pages/AboutPage';
import Navbar from './components/Navbar';
import PlaceholderPage from './components/PlaceholderPage';
import Footer from './components/Footer';
import { CartProvider } from './contexts/CartContext';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
          <Route path="/categories" element={<PlaceholderPage title="Product Categories" />} />
          <Route path="/categories/:category" element={<PlaceholderPage title="Category Products" />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}