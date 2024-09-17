"use client";

import { useState, useEffect } from "react";
import ProductCard from "./reusableComponents/ProductCard";
import styles from "../styles/ProductList.module.css";

// ProductList component with new productType prop for filtering
export default function ProductList({ productType }) {
  // State variables
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(["All"]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState(null);

  // Fetch products and initialize filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Filter products based on productType prop
        const typeFilteredProducts = data.filter(
          (product) =>
            product.price &&
            product.image &&
            product.metadata &&
            product.metadata.product_type &&
            product.metadata.product_type.includes(productType)
        );

        setProducts(typeFilteredProducts);
        setFilteredProducts(typeFilteredProducts);

        // Extract unique filter values from the 'filter' metadata
        const filterSet = new Set(["All"]);
        typeFilteredProducts.forEach((product) => {
          if (product.metadata && product.metadata.filter) {
            product.metadata.filter
              .split(",")
              .forEach((filter) => filterSet.add(filter.trim()));
          }
        });
        setFilters(Array.from(filterSet));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Load cart from local storage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    fetchProducts();
  }, [productType]);

  // Handle filter click
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.metadata &&
          product.metadata.filter &&
          product.metadata.filter
            .split(",")
            .map((f) => f.trim())
            .includes(filter)
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"));
      // Trigger button effect
      setAddedToCart(product.id);
      return newCart;
    });
  };

  // Render component
  return (
    <div>
      {/* Sub-navigation for filters */}
      <div className={styles.subNav}>
        <span>{loading ? "0" : filteredProducts.length} Items</span>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`${styles.filterButton} ${
              activeFilter === filter ? styles.active : ""
            }`}
          >
            {filter} (
            {filter === "All"
              ? products.length
              : products.filter(
                  (p) =>
                    p.metadata &&
                    p.metadata.filter &&
                    p.metadata.filter
                      .split(",")
                      .map((f) => f.trim())
                      .includes(filter)
                ).length}
            )
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className={styles.productGrid}>
        {loading ? (
          // Render skeleton loaders while loading
          Array(3)
            .fill()
            .map((_, index) => <ProductCard key={index} loading={true} />)
        ) : filteredProducts.length === 0 ? (
          <div>No products available.</div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.name}
              description={product.description}
              price={product.price}
              currency={product.currency}
              buttonText="Add to Cart"
              onButtonClick={() => handleAddToCart(product)}
              addedToCart={addedToCart === product.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
