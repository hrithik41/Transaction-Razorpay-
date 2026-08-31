"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Settings2, ShieldCheck, Maximize, Sun } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Precision Engineering",
    description: "Every micro-component is meticulously crafted for absolute accuracy and chronometric performance. We push the boundaries of micro-mechanics to achieve unparalleled reliability.",
    icon: <Settings2 size={16} />,
    spec: "Calibre V-41",
    image: "/products/product_2.png",
  },
  {
    number: "02",
    title: "Heritage Materials",
    description: "Forged in Grade 5 Titanium, 18K Rose Gold, and Sapphire crystal. Our materials are chosen not just for luxury, but for unmatched durability and weightlessness.",
    icon: <ShieldCheck size={16} />,
    spec: "Grade 5 Titanium",
    image: "/products/product_3.png",
  },
  {
    number: "03",
    title: "Real Time Adjustment",
    description: "The patented deployment clasp micro-adjusts to your wrist as it expands and contracts naturally throughout the day, guaranteeing perfect comfort.",
    icon: <Maximize size={16} />,
    spec: "Patented Clasp",
    image: "/products/product_4.png",
  },
  {
    number: "04",
    title: "Luminescent Clarity",
    description: "Multiple layers of Swiss Super-LumiNova® applied by hand ensures perfect, long-lasting legibility even in the deepest darkness.",
    icon: <Sun size={16} />,
    spec: "Super-LumiNova®",
    image: "/products/product_6.png",
  }
];

export default function FeatureGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax subtle effect on the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="w-full bg-[#020202] py-16 md:py-40 px-6 md:px-12 border-t border-white/5 relative z-10">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <motion.div style={{ opacity }} className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-24 relative">
        
        {/* Left Side: Sticky Content Box */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-40 flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-500 font-sans text-[10px] tracking-[0.3em] uppercase">
              The Anatomy of Perfection
            </span>
          </div>
          
          <h2 className="text-[2.5rem] leading-[1.2] md:text-6xl lg:text-7xl text-white md:leading-[1.1] mb-6 md:mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
            Uncompromising<br />Excellence.
          </h2>
          
          <p className="text-gray-400 text-[13px] sm:text-sm md:text-base font-light leading-relaxed mb-10 md:mb-12 max-w-md">
            We don’t just build watches; we engineer legacies. Explore the rigorous craftsmanship, cutting-edge materials, and proprietary complications that define every single timepiece that leaves our Geneva manufacture.
          </p>

          <button className="group flex items-center gap-4 text-white text-[10px] md:text-xs tracking-[0.2em] uppercase pb-3 border-b border-white/20 hover:border-white transition-all w-fit">
            Explore Craftsmanship <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Right Side: Scrolling Feature Cards */}
        <div className="w-full lg:w-[60%] flex flex-col gap-8 md:gap-24 mt-8 lg:mt-0">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group flex flex-col bg-[#070707] border border-white/5 p-6 sm:p-8 md:p-12 hover:border-white/20 transition-colors"
            >
              
              <div className="flex items-center justify-between mb-8 md:mb-10 pb-6 border-b border-white/10">
                 <span className="text-white/20 font-light text-5xl md:text-6xl" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {feature.number}
                 </span>
                 <div className="flex items-center gap-2 text-gray-500 bg-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/5">
                    {feature.icon}
                    <span className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase">{feature.spec}</span>
                 </div>
              </div>

              <div className="w-full aspect-square md:aspect-[16/9] relative mb-8 md:mb-12 flex items-center justify-center overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-[1.5s] drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-2xl md:text-4xl text-white mb-4 md:mb-6 leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-[13px] sm:text-sm md:text-base font-light leading-[1.8] max-w-lg">
                  {feature.description}
                </p>
              </div>
              
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
