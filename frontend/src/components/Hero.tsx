"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { PlayCircle, ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Outer containers for Scroll Parallax
  const scrollTextRef = useRef<HTMLDivElement>(null);
  const scrollImageRef = useRef<HTMLDivElement>(null);

  // Inner elements for Entrance Animation
  const textLine1Ref = useRef<HTMLSpanElement>(null);
  const textLine2Ref = useRef<HTMLSpanElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance Animation (Premium Unmask Effect)
      const tl = gsap.timeline();

      // Label fades in
      tl.from(labelRef.current, {
        opacity: 0,
        x: -20,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      });

      // Massive text masks up
      tl.from([textLine1Ref.current, textLine2Ref.current], {
        y: "120%",
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
      }, "-=0.6");

      // Watch image scales and slides in
      tl.from(imageInnerRef.current, {
        scale: 0.85,
        x: 80,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
      }, "-=1");

      // Description fades up
      tl.from(descriptionRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      }, "-=1.5");

      // Buttons fade up
      tl.from(buttonsRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=1");

      // Specs stagger fade up
      if (specsRef.current) {
        tl.from(specsRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        }, "-=0.8");
      }

      // Scroll Indicator fades in
      tl.from(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 1,
      }, "-=0.5");

      // Continuous bounce for scroll arrow
      gsap.to(".scroll-arrow", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut"
      });

      // 2. Scroll Animation (Subtle Parallax without pinning)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top", 
          scrub: 1, 
        }
      });

      // Move text wrapper up faster (strong parallax)
      scrollTl.to(scrollTextRef.current, {
        y: -150,
        opacity: 0,
        duration: 1,
        ease: "none"
      }, 0);

      // Watch wrapper moves up slower and scales up
      scrollTl.to(scrollImageRef.current, {
        y: -30,
        scale: 1.05,
        duration: 1,
        ease: "none"
      }, 0);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-[100dvh] overflow-hidden bg-[#020202] text-white flex items-center justify-center pt-20 md:pt-0 pb-16 md:pb-0">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-[#020202] to-[#020202]" />

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-center justify-center md:justify-between z-10 pt-4 md:py-0">
        
        {/* Left Side: Premium Content */}
        <div ref={scrollTextRef} className="flex-1 flex flex-col justify-center items-start z-20 md:pr-10 w-full md:mt-0">
          
          {/* Label */}
          <div ref={labelRef} className="flex items-center gap-4 mb-6 md:mb-10 w-full">
            <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/60 font-medium">Flagship Release</span>
          </div>

          <h1 
            className="text-[3.5rem] sm:text-6xl md:text-[5.5rem] lg:text-[7.5rem] font-medium tracking-tighter uppercase leading-[1.05] mb-6 md:mb-8 flex flex-col"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span className="block overflow-hidden pb-1 md:pb-2">
              <span ref={textLine1Ref} className="block">The Art</span>
            </span>
            <span className="block overflow-hidden pb-2 md:pb-4">
              <span ref={textLine2Ref} className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-700">Of Time</span>
            </span>
          </h1>
          
          <p ref={descriptionRef} className="text-gray-400 font-light max-w-lg text-[13px] sm:text-sm md:text-base leading-[1.8] mb-10 md:mb-12">
            Experience the pinnacle of Swiss engineering. The Vilix Casino is meticulously forged in solid 18k rose gold, featuring an authentic, fully functional miniature roulette complication visible through the sapphire case back.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10 mb-16 md:mb-20 w-full">
             <button className="bg-white text-black px-10 py-5 text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto">
                Discover Collection
             </button>
             <button className="flex items-center gap-3 text-white text-[10px] md:text-xs tracking-[0.2em] uppercase hover:text-gray-300 transition-colors group">
                <PlayCircle size={20} className="text-gray-400 group-hover:text-white transition-colors" strokeWidth={1.5} /> 
                <span className="border-b border-transparent group-hover:border-white transition-all pb-0.5">Watch Film</span>
             </button>
          </div>
          
          {/* Spec Grid */}
          <div ref={specsRef} className="grid grid-cols-3 gap-4 md:gap-12 w-full pt-8 border-t border-white/10">
            <div className="flex flex-col gap-1 md:gap-2">
              <span className="text-white text-xl sm:text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)'}}>18K</span>
              <span className="text-gray-500 text-[8px] md:text-[9px] tracking-[0.2em] uppercase">Rose Gold Case</span>
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <span className="text-white text-xl sm:text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)'}}>72H</span>
              <span className="text-gray-500 text-[8px] md:text-[9px] tracking-[0.2em] uppercase">Power Reserve</span>
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <span className="text-white text-xl sm:text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)'}}>30M</span>
              <span className="text-gray-500 text-[8px] md:text-[9px] tracking-[0.2em] uppercase">Water Resistant</span>
            </div>
          </div>
        </div>

        {/* Right Side: Watch Image */}
        <div ref={scrollImageRef} className="absolute inset-0 md:relative md:flex-1 flex justify-center items-center h-full md:h-[85vh] w-full z-0 md:z-10 opacity-15 md:opacity-100 pointer-events-none md:pointer-events-auto">
          <div ref={imageInnerRef} className="relative w-[150%] md:w-full h-[80vh] md:h-full -right-[25%] md:right-0 drop-shadow-[0_0_120px_rgba(255,215,0,0.15)] mix-blend-lighten md:mix-blend-normal">
            <Image 
              src="/hero-watch.png" 
              alt="Vilix Geneve Casino Watch" 
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60">
        <span className="text-[8px] tracking-[0.3em] uppercase font-light text-gray-400">Scroll</span>
        <ArrowDown size={14} className="scroll-arrow text-gray-400" strokeWidth={1.5} />
      </div>
    </div>
  );
}
