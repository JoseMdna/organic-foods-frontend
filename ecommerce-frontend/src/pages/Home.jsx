import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Featured Organic Foods</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
