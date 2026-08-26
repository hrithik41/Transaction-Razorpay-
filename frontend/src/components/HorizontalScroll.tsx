// frontend/src/components/HorizontalScroll.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Precision Engineering",
    description: "Every micro-component is meticulously crafted for absolute accuracy and chronometric performance.",
    image: "/products/product_2.png",
  },
  {
    number: "02",
    title: "Heritage Materials",
    description: "Forged in Grade 5 Titanium and Sapphire crystal for unmatched durability and weightlessness.",
    image: "/products/product_3.png",
  },
  {
    number: "03",
    title: "Real Time Adjustment",
    description: "The patented clasp micro-adjusts to your wrist as it expands and contracts throughout the day.",
    image: "/products/product_4.png",
  },
  {
    number: "04",
    title: "Luminescent Clarity",
    description: "Swiss Super-LumiNova® applied by hand ensures perfect legibility in the deepest darkness.",
    image: "/products/product_6.png",
  }
];

export default function FeatureGrid() {
  return (
    <section className="w-full bg-[#050505] py-24 md:py-32 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20 md:mb-32">
          <span className="text-gray-500 font-sans text-xs tracking-[0.3em] uppercase mb-4 block">
            The Anatomy of Perfection
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Uncompromising Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-32">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
              <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden group bg-[#0a0a0a] border border-white/5 mb-8 flex items-center justify-center p-12">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain transition-transform duration-1000 group-hover:scale-110 p-8 drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
              
              <div className="px-2">
                <span className="text-gray-600 font-sans text-xs tracking-[0.5em] mb-4 block">
                  {feature.number}
                </span>
                <h3 className="text-2xl md:text-3xl text-white mb-4 leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
