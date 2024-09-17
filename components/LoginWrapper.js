"use client";
import React, { useState, useEffect } from "react";

const LoginWrapper = ({ children }) => {
  // State for managing login status and form inputs
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Effect to check login status on component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate credentials
    if (username === "khunsuek" && password === "krabi") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // If logged in, render children components
  if (isLoggedIn) {
    return (
      <div id="logged-in-container" className="flex flex-col min-h-screen">
        {/* Banner with copyright and logout button */}
        <div
          id="top-banner"
          className="bg-gray-800 text-white p-2 flex justify-between items-center"
        >
          <span id="copyright-notice" className="text-sm">
            © 2024 Irving Duran. All rights reserved. This is a sample
            website for demonstration purposes only. Unauthorized use,
            reproduction, or distribution of this content is strictly
            prohibited.
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
        {/* Main content area */}
        <div className="flex-grow">{children}</div>
      </div>
    );
  }

  // If not logged in, render login modal
  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div id="login-modal" className="bg-white p-8 rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">
          Login to Khunsuek Muay Thai Gym
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginWrapper;
