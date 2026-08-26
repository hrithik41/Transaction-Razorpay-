"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance Animation (Premium Unmask Effect)
      gsap.from([textLine1Ref.current, textLine2Ref.current], {
        y: "120%", // Starts completely pushed down
        duration: 1.6,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2
      });

      gsap.from(descriptionRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 1.2
      });

      gsap.from(imageInnerRef.current, {
        scale: 0.8,
        x: 100,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        delay: 0.6
      });

      // 2. Scroll Animation (Subtle Parallax without pinning)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top", 
          scrub: 1, 
        }
      });

      // Move text wrapper up faster (strong parallax)
      tl.to(scrollTextRef.current, {
        y: -150,
        opacity: 0,
        duration: 1,
        ease: "none"
      }, 0);

      // Watch wrapper moves up slower and scales up
      tl.to(scrollImageRef.current, {
        y: -50,
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
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-center justify-between z-10 pt-20">
        
        {/* Left Side: Premium Content */}
        <div ref={scrollTextRef} className="flex-1 flex flex-col justify-center items-start z-20 mt-20 md:mt-0">
          <h1 
            className="text-5xl sm:text-6xl md:text-[5rem] lg:text-[6rem] font-medium tracking-tight uppercase leading-[1.1] mb-6 flex flex-col"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span className="block overflow-hidden pb-1 md:pb-2">
              <span ref={textLine1Ref} className="block">The Art</span>
            </span>
            <span className="block overflow-hidden pb-2 md:pb-4">
              <span ref={textLine2Ref} className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">Of Time</span>
            </span>
          </h1>
          <p ref={descriptionRef} className="text-gray-400 font-light max-w-sm md:max-w-md text-sm md:text-base leading-relaxed">
            Experience the pinnacle of Swiss engineering. The Vilix Casino is forged in rose gold with an authentic, fully functional miniature roulette complication.
          </p>
        </div>

        {/* Right Side: Watch Image */}
        <div ref={scrollImageRef} className="flex-1 flex justify-center items-center relative h-[40vh] sm:h-[50vh] md:h-[80vh] w-full mt-8 md:mt-0 z-10">
          <div ref={imageInnerRef} className="relative w-full h-full drop-shadow-[0_0_80px_rgba(255,215,0,0.15)]">
            <Image 
              src="/hero-watch.png" 
              alt="Vilix Geneve Casino Watch" 
              fill
              className="object-contain "
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}
