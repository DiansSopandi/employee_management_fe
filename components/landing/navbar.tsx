"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle"; // Toggle dark/light
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-700">
          HRIS App
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link
            href="#features"
            className="text-gray-700 hover:text-indigo-600"
          >
            Features
          </Link>
          <Link href="#pricing" className="text-gray-700 hover:text-indigo-600">
            Pricing
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-indigo-600">
            About
          </Link>
          <Link
            href="/login"
            className="text-indigo-700 font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition"
          >
            Register
          </Link>

          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden px-4 pb-4 space-y-4 bg-white shadow-md"
        >
          <Link href="/" className="block text-gray-700">
            Home
          </Link>
          <Link href="#features" className="block text-gray-700">
            Features
          </Link>
          <Link href="#pricing" className="block text-gray-700">
            Pricing
          </Link>
          <Link href="#about" className="block text-gray-700">
            About
          </Link>
          <Link href="/login" className="block text-indigo-700">
            Login
          </Link>
          <Link
            href="/register"
            className="block text-white bg-indigo-700 px-4 py-2 rounded-lg"
          >
            Register
          </Link>
        </motion.div>
      )}
    </motion.nav>
    // <header className="flex justify-between items-center px-6 py-4 border-b bg-background sticky top-0 z-50">
    //   <h1 className="text-lg font-bold">HRIS</h1>
    //   <nav className="flex items-center space-x-6 text-sm">
    //     <Link href="#features" className="hover:underline">
    //       Fitur
    //     </Link>
    //     <Link href="/login" className="text-blue-600 hover:underline">
    //       Login
    //     </Link>
    //     <ThemeToggle />
    //   </nav>
    // </header>
  );
};
