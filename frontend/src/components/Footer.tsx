// frontend/src/components/Footer.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#020202] text-white pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      
      {/* Background glow for depth */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-white/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
          
          {/* Brand & Newsletter */}
          <div className="flex-1 max-w-xl">
            <h2 className="text-4xl tracking-widest uppercase font-light mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              VILIX
            </h2>
            <p className="text-gray-400 font-light leading-relaxed mb-8 text-sm">
              Join our exclusive inner circle. Subscribe to receive updates on limited editions, bespoke commissions, and private events.
            </p>
            
            <form className="flex items-end border-b border-white/20 pb-2 group focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="bg-transparent border-none outline-none w-full text-xs tracking-widest text-white placeholder:text-gray-600 font-light"
              />
              <button type="submit" className="text-gray-400 group-focus-within:text-white transition-colors p-2 hover:scale-110 active:scale-95">
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-16 lg:gap-32">
            
            <div className="flex flex-col gap-6">
              <h4 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">Collections</h4>
              <Link href="/products" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Casino Edition</Link>
              <Link href="/products" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Obsidian Black</Link>
              <Link href="/products" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Sapphire Chrono</Link>
              <Link href="/products" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Deep Diver</Link>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">Maison</h4>
              <Link href="#" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Heritage</Link>
              <Link href="#" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Bespoke</Link>
              <Link href="#" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Boutiques</Link>
              <Link href="#" className="text-sm font-light text-gray-300 hover:text-white transition-colors">Contact</Link>
            </div>
            
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
          <p className="text-[10px] tracking-widest uppercase text-gray-500">
            © {new Date().getFullYear()} VILIX GENEVE. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">X</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>

          <div className="flex gap-6 text-[10px] tracking-widest uppercase text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
