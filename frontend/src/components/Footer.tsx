"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#020202] text-white pt-16 md:pt-40 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-white/[0.01] blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 lg:mb-32">
          
          {/* Column 1: Newsletter & Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 lg:pr-12">
            <h2 className="text-3xl md:text-4xl tracking-[0.2em] uppercase font-light mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
              VILIX
            </h2>
            <p className="text-gray-400 font-light leading-relaxed mb-8 text-xs md:text-sm">
              Join our exclusive inner circle. Subscribe to receive updates on limited editions, bespoke commissions, and private events in Geneva and worldwide.
            </p>
            
            <form className="flex items-end border-b border-white/20 pb-2 group focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="bg-transparent border-none outline-none w-full text-[10px] md:text-xs tracking-widest text-white placeholder:text-gray-600 font-light"
              />
              <button type="submit" className="text-gray-400 group-focus-within:text-white transition-colors p-2 hover:scale-110 active:scale-95">
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
            <p className="text-[#444] text-[8px] mt-4 tracking-widest uppercase">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>

          {/* Column 2: Collections */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 mb-4 border-b border-white/10 pb-4">Collections</h4>
            <Link href="/products" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Casino Rose Gold</Link>
            <Link href="/products" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Chronograph Pro</Link>
            <Link href="/products" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Heritage Classic</Link>
            <Link href="/products" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Deep Sea Diver</Link>
            <Link href="/products" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Grand Complications</Link>
          </div>

          {/* Column 3: The Maison */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 mb-4 border-b border-white/10 pb-4">The Maison</h4>
            <Link href="#" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Our History</Link>
            <Link href="#" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Swiss Manufacture</Link>
            <Link href="#" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Bespoke Services</Link>
            <Link href="#" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Sustainability</Link>
            <Link href="#" className="text-xs md:text-sm font-light text-gray-400 hover:text-white transition-colors">Careers</Link>
          </div>
          
          {/* Column 4: Contact & Boutiques */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 mb-4 border-b border-white/10 pb-4">Client Care</h4>
            
            <div className="flex items-start gap-4 text-gray-400 group">
               <MapPin size={16} strokeWidth={1} className="mt-1 group-hover:text-white transition-colors" />
               <div className="flex flex-col">
                  <span className="text-white text-sm font-light">Geneva Boutique</span>
                  <span className="text-xs font-light mt-1">Rue du Rhône 14<br/>1204 Genève, Switzerland</span>
               </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400 group mt-4">
               <Phone size={16} strokeWidth={1} className="group-hover:text-white transition-colors" />
               <span className="text-xs font-light tracking-wider">+41 22 123 45 67</span>
            </div>

            <div className="flex items-center gap-4 text-gray-400 group">
               <Mail size={16} strokeWidth={1} className="group-hover:text-white transition-colors" />
               <span className="text-xs font-light">concierge@vilix.ch</span>
            </div>
          </div>

        </div>

        {/* Massive Typography Branding */}
        <div className="w-full flex items-center justify-center opacity-[0.03] select-none pointer-events-none mb-8 md:mb-12">
            <span className="text-[15vw] leading-none font-bold tracking-widest text-white whitespace-nowrap overflow-hidden">
                VILIX
            </span>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-3 w-full md:w-auto">
             <div className="hidden md:block w-4 h-[1px] bg-white/30"></div>
             <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-medium">
               © {new Date().getFullYear()} VILIX GENEVE
             </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-10 text-[9px] tracking-[0.2em] uppercase text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">YouTube</a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[9px] tracking-[0.2em] uppercase text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
          
        </div>

      </div>
    </footer>
  );
}
