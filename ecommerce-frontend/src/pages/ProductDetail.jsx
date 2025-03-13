import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`products/${id}/`).then(res => {
      setProduct(res.data);
    });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <img src={product.image_url} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}
