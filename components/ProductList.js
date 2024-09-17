"use client";

import { useState, useEffect } from "react";
import ProductCard from "./reusableComponents/ProductCard";
import styles from "../styles/ProductList.module.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(["All"]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [cart, setCart] = useState([]);

  // Add this line to define the addedToCart state
  const [addedToCart, setAddedToCart] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const productsWithMetadata = data.filter(
          (product) => product.price && product.image
        );
        setProducts(productsWithMetadata);
        setFilteredProducts(productsWithMetadata);

        const metadataFields = new Set(["All"]);
        productsWithMetadata.forEach((product) => {
          if (product.metadata) {
            Object.keys(product.metadata).forEach((key) =>
              metadataFields.add(key)
            );
          }
        });
        setFilters(Array.from(metadataFields));
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
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.metadata && product.metadata.hasOwnProperty(filter)
      );
      setFilteredProducts(filtered);
    }
  };

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

  return (
    <div>
      <div className={styles.subNav}>
        <span>{loading ? "0" : filteredProducts.length} Classes</span>
        <button
          onClick={() => handleFilterClick("All")}
          className={`${styles.filterButton} ${
            activeFilter === "All" ? styles.active : ""
          }`}
        >
          All ({loading ? "0" : products.length})
        </button>
        {!loading &&
          filters.slice(1).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`${styles.filterButton} ${
                activeFilter === filter ? styles.active : ""
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} (
              {
                products.filter(
                  (p) => p.metadata && p.metadata.hasOwnProperty(filter)
                ).length
              }
              )
            </button>
          ))}
      </div>
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
