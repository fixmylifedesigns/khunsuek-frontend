"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/Accommodation.module.css";
import ProductCard from "../../components/reusableComponents/ProductCard";

function getLargerImageUrl(originalUrl) {
  if (!originalUrl) return null;

  // Parse the original URL
  const url = new URL(originalUrl);

  // Extract the path
  const pathParts = url.pathname.split("/");

  // Find the part with the size (e.g., 'square60')
  const sizeIndex = pathParts.findIndex((part) => part.startsWith("square"));

  if (sizeIndex !== -1) {
    pathParts[sizeIndex] = "square300";

    // Reconstruct the URL
    url.pathname = pathParts.join("/");
  }

  return url.toString();
}

function toLowercase(input) {
  if (typeof input !== "string") {
    console.warn("Input is not a string. Returning original input.");
    return input;
  }
  return input.toLowerCase();
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Helper function to get tomorrow's date
function getTomorrow(date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function getToday(date) {
  const today = new Date(date);
  today.setDate(today.getDate() + 1);
  return today;
}

export default function Accommodation() {
  const yesterday = new Date();
  const today = getToday(yesterday);
  const tomorrow = getTomorrow(today);

  // Form input states with default values
  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
  const [adults, setAdults] = useState(1);

  // Current search parameters
  const [currentCheckIn, setCurrentCheckIn] = useState("");
  const [currentCheckOut, setCurrentCheckOut] = useState("");
  const [currentAdults, setCurrentAdults] = useState(1);
  const [currentNights, setCurrentNights] = useState(0);

  const [hotels, setHotels] = useState(null);
  const [searchStart, setSearchStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Add this line to define the addedToCart state
  const [addedToCart, setAddedToCart] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const calculateNights = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    // Update currentNights whenever checkIn or checkOut changes
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    setCurrentNights(nights);
  }, [checkIn, checkOut]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchStart(true);
    setLoading(true);
    setError(null);
    setHotels(null);

    try {
      const response = await fetch("/api/searchHotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checkIn, checkOut, adults }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }

      const data = await response.json();

      if (data.status === false) {
        throw new Error(data.message || "Failed to fetch hotels");
      }

      // Ensure hotels is an array
      const hotelResults = Array.isArray(data.data?.result)
        ? data.data.result
        : [];

      setHotels(hotelResults);

      if (hotelResults.length === 0) {
        setError("No hotels found for the given criteria.");
      } else {
        // Update current search parameters only on successful search
        setCurrentCheckIn(checkIn);
        setCurrentCheckOut(checkOut);
        setCurrentAdults(adults);
        setCurrentNights(calculateNights(checkIn, checkOut));
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError(
        err.message ||
          "An error occurred while fetching hotels. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (hotel) => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === hotel.hotel_id
    );

    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = currentCart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const simplifiedHotel = {
        id: hotel.hotel_id,
        name: hotel.hotel_name,
        price: hotel.min_total_price,
        currency: toLowercase(hotel.currencycode),
        image: getLargerImageUrl(hotel.main_photo_url),
        quantity: 1,
        type: "hotel",
        nights: currentNights,
        checkIn: currentCheckIn,
        checkOut: currentCheckOut,
        adults: currentAdults,
      };
      updatedCart = [...currentCart, simplifiedHotel];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("storage"));

    // Trigger button effect
    setAddedToCart(hotel.hotel_id);
    setTimeout(() => setAddedToCart(null), 1000); // Reset after 1 second
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Find Accommodation</h1>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
          className={styles.input}
          min={formatDate(today)}
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
          className={styles.input}
          min={formatDate(getTomorrow(new Date(checkIn)))}
        />
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          min="1"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>

      {loading && <p>Searching for hotels...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.hotelGrid}>
        {loading ? (
          Array(6)
            .fill()
            .map((_, index) => <ProductCard key={index} loading={true} />)
        ) : hotels && hotels.length > 0 ? (
          hotels.map((hotel) => (
            <ProductCard
              key={hotel.hotel_id}
              image={getLargerImageUrl(hotel.main_photo_url)}
              title={hotel.hotel_name}
              description={`${hotel.city}, ${hotel.hotel_name_trans}`}
              price={hotel.min_total_price}
              currency={hotel.currencycode}
              buttonText="Add to Cart"
              onButtonClick={() => handleAddToCart(hotel)}
              priceSubtext={`for ${currentNights} night${
                currentNights !== 1 ? "s" : ""
              }, ${currentAdults} adult${currentAdults > 1 ? "s" : ""}`}
              addedToCart={addedToCart === hotel.hotel_id}
            />
          ))
        ) : searchStart ? (
          <p>No hotels available. Please try your search again.</p>
        ) : (
          <p>Please select some dates</p>
        )}
      </div>
    </div>
  );
}
