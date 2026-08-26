"use client";

import React, { useState, useEffect } from "react";
import { Menu, Search, User, LogOut, ShoppingBag, PhoneCall, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { isAuthenticated, initialize, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
            ? "bg-black/90 backdrop-blur-lg border-b border-white/5 py-4"
            : "bg-transparent py-8"
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Left: Collapsable Menu & Search */}
          <div className="flex items-center gap-8 flex-1">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-white hover:text-gray-400 transition-colors flex items-center gap-3"
              aria-label="Open Menu"
            >
              <Menu size={28} strokeWidth={1.2} />
              <span className="hidden md:block text-xs tracking-[0.2em] uppercase font-light">Menu</span>
            </button>
            <button className="hidden md:flex text-white hover:text-gray-400 transition-colors items-center gap-3" aria-label="Search">
              <Search size={22} strokeWidth={1.2} />
              <span className="text-xs tracking-[0.2em] uppercase font-light">Search</span>
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="group">
              <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.25em] text-white uppercase" style={{ fontFamily: 'var(--font-playfair)' }}>
                Vilix
              </h1>
            </Link>
          </div>

          {/* Right: Contact, Profile, Cart */}
          <div className="flex items-center justify-end gap-8 flex-1">
            <Link href="/contact" className="hidden lg:flex items-center gap-3 text-white hover:text-gray-400 transition-colors">
              <PhoneCall size={20} strokeWidth={1.2} />
              <span className="text-xs tracking-[0.2em] uppercase font-light">Contact</span>
            </Link>
            {isAuthenticated ? (
              <button 
                onClick={() => {
                  logout();
                  router.push("/login");
                }} 
                className="text-white hover:text-red-400 transition-colors" 
                aria-label="Sign Out"
              >
                <LogOut size={22} strokeWidth={1.2} />
              </button>
            ) : (
              <Link href="/login" className="text-white hover:text-gray-400 transition-colors" aria-label="Profile">
                <User size={24} strokeWidth={1.2} />
              </Link>
            )}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-gray-400 transition-colors relative" 
              aria-label="Cart"
            >
              <ShoppingBag size={24} strokeWidth={1.2} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Collapsable Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 0% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 0% 0%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 0% 0%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a] text-white flex flex-col"
          >
            <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between px-6 md:px-12 py-8">
              <h2 className="text-xs tracking-[0.3em] uppercase text-gray-500">Navigation</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-400 transition-colors flex items-center gap-3"
              >
                <span className="text-xs tracking-[0.2em] uppercase font-light">Close</span>
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 md:px-24 max-w-[1600px] w-full mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                <div className="flex flex-col gap-6">
                  {['Timepieces', 'New Arrivals', 'Grand Complications', 'Heritage Collection', 'Boutiques'].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                    >
                      <Link
                        href={`/collections/${item.toLowerCase().replace(' ', '-')}`}
                        className="text-4xl md:text-6xl font-extralight tracking-tight text-gray-300 hover:text-white transition-colors block w-fit"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="hidden md:flex flex-col justify-center gap-8 pl-12 border-l border-white/10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">Featured</h3>
                    <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer">
                      {/* Placeholder for featured watch image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <div className="absolute bottom-6 left-6 z-20">
                        <p className="text-white font-light text-xl">The Chronograph Pro</p>
                        <p className="text-gray-400 text-sm mt-1">Discover the collection</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
