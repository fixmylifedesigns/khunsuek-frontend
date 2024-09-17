import React from 'react';
import ProductList from '../../components/ProductList';

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Courses and Products</h1>
      <ProductList />
    </div>
  );
}