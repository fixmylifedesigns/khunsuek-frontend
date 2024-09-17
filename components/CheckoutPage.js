"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import styles from "../styles/Checkout.module.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (cartItems) => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cart
      .map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = async () => {
    try {
      setError(null);
      const stripe = await stripePromise;
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "An error occurred during checkout"
        );
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.title}>Your Cart</h1>
      {error && <div className={styles.error}>{error}</div>}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <Image
                  src={item.image}
                  alt={item.name}
                  className={styles.productImage}
                  loading="lazy"
                  width={100}
                  height={100}
                />
                <div className={styles.productInfo}>
                  <h3>{item.name}</h3>
                  <p>
                    {item.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: item.currency,
                    })}
                  </p>
                  {item.type === "hotel" && <p>Hotel Booking</p>}
                </div>
                <div className={styles.quantityControl}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.total}>
            Total:{" "}
            {total.toLocaleString("en-US", {
              style: "currency",
              currency: cart[0]?.currency || "USD",
            })}
          </div>
          <button onClick={handleCheckout} className={styles.checkoutButton}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
