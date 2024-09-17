"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/KSM_LOGO_header.png";
import {
  Instagram,
  MapPin,
  Phone,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";

// Main layout component for the Muay Thai gym website
const Layout = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const user = auth?.user;
  const login = auth?.login;
  const logout = auth?.logout;

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = isMobileMenuOpen ? "auto" : "hidden";
  };

  // Navigation links component
  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <ul
      className={`flex ${
        mobile ? "flex-col items-center space-y-6" : "space-x-6"
      }`}
    >
      <li>
        <Link
          href="/"
          className={`hover:text-red-500 ${mobile ? "text-white" : ""}`}
          onClick={onItemClick}
        >
          HOME
        </Link>
      </li>
      <li>
        <Link
          href="/courses"
          className={`hover:text-red-500 ${mobile ? "text-white" : ""}`}
          onClick={onItemClick}
        >
          COURSE
        </Link>
      </li>
      <li>
        <Link
          href="/store"
          className={`hover:text-red-500 ${mobile ? "text-white" : ""}`}
          onClick={onItemClick}
        >
          STORE
        </Link>
      </li>
      <li>
        <Link
          href="/accommodation"
          className={`hover:text-red-500 ${mobile ? "text-white" : ""}`}
          onClick={onItemClick}
        >
          ACCOMMODATION
        </Link>
      </li>
      <li>
        <Link
          href="/facilities"
          className={`hover:text-red-500 ${mobile ? "text-white" : ""}`}
          onClick={onItemClick}
        >
          FACILITIES
        </Link>
      </li>
      <li>
        <Link
          href="/our-team"
          className={`hover:text-red-500 ${mobile ? "text-white" : ""}`}
          onClick={onItemClick}
        >
          OUR TEAM
        </Link>
      </li>
      <li>
        <Link
          href="/checkout"
          className={`hover:text-red-500 relative ${
            mobile ? "text-white" : ""
          }`}
          onClick={onItemClick}
        >
          <ShoppingCart size={24} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartItemCount}
            </span>
          )}
        </Link>
      </li>
      <li>
        <button
          onClick={() => {
            handleAuthClick();
            onItemClick();
          }}
          className={`flex items-center hover:text-red-500 ${
            mobile ? "text-white" : ""
          }`}
        >
          <User size={24} className="mr-2" />
          {user ? "Logout" : "Login"}
        </button>
      </li>
    </ul>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar with contact information */}
      <div className="bg-red-900 text-white py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-4">
            <span className="font-bold">Contact us</span> | 08:00 A.M. - 08:00
            P.M.
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="https://www.instagram.com/"
            className="hover:text-gray-300"
          >
            <Instagram size={20} />
          </Link>
          <Link href="/location" className="hover:text-gray-300">
            <MapPin size={20} />
          </Link>
          <Link href="tel:+1234567890" className="hover:text-gray-300">
            <Phone size={20} />
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-black text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <Image
              src={logo}
              alt="Muay Thai training"
              width="100"
              sizes="50%"
              loading="lazy"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none z-50"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-90 z-40 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <NavLinks mobile onItemClick={toggleMobileMenu} />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto text-center">
          <p>
            &copy; 2024 Irving Duran. All rights reserved. This is a sample
            website for demonstration purposes only. Unauthorized use,
            reproduction, or distribution of this content is strictly
            prohibited.
          </p>

          {/* <p>&copy; 2023 KHUNSUEK Muay Thai Gym. All rights reserved.</p> */}
        </div>
      </footer>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
