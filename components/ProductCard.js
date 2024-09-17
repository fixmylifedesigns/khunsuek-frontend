import React from "react";
import Image from "next/image";
import { useStripe } from "@stripe/react-stripe-js";

export default function ProductCard({ product }) {
  const stripe = useStripe();

  const handleBuyNow = async () => {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: product.id }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-red-600">
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: product.currency,
            })}
          </span>
          <button
            onClick={handleBuyNow}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
