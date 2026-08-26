// frontend/src/components/FeatureProducts.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; 

export default function FeatureProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getProducts();
        
        // Ensure we are working with the array, then slice the first 4 for the homepage
        const allProducts = res.products || res.data || res;
        if (Array.isArray(allProducts)) {
            setProducts(allProducts.slice(0, 4)); 
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatured();
  }, []);

  const handlePayment = (productId: string) => {
    alert("Instant checkout flow coming soon!");
  };

  return (
    <section className="w-full bg-[#020202] py-20 md:py-32 px-6 md:px-12 relative z-10 border-t border-white/5">
      {/* Subtle vertical accent line for an architectural feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent" />

      <div className="max-w-[1600px] mx-auto">
        
        {/* Premium Split Header Layout with CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-12">
          <div className="max-w-2xl">
            <span className="text-gray-500 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 block">
              01 // The Collection
            </span>
            <h2 className="text-4xl md:text-6xl text-white leading-[1.1]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Featured Timepieces
            </h2>
          </div>
          
          <div className="flex flex-col md:items-end gap-6 max-w-sm">
            <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed md:text-right">
              Explore our curated selection of horological masterpieces, engineered for those who demand absolute perfection and uncompromised luxury.
            </p>
            <Link 
              href="/products" 
              className="group flex items-center gap-4 text-white text-[10px] md:text-xs tracking-[0.2em] uppercase pb-2 border-b border-white/20 hover:border-white transition-all w-fit"
            >
              Discover All <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Increased Grid Gaps for more breathing room */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-x-12 gap-y-12 md:gap-y-16">
            {products.map((product) => (
              <ProductCard 
                key={product.product_id} 
                product={product} 
                handlePayment={handlePayment} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-32 border border-white/5 rounded-2xl">
            <p className="font-light tracking-[0.2em] uppercase text-sm">No featured products available.</p>
          </div>
        )}
        
      </div>
    </section>
  );
}
