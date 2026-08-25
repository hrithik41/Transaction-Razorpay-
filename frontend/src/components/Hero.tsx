"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !visualRef.current) return;

    // Split text into characters and words
    const splitText = new SplitType(textRef.current, { types: 'words,chars' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000", // 3000px of scrolling for the whole sequence
        scrub: 1, // Smooth scrubbing
        pin: true, // Pin the section while scrolling
        anticipatePin: 1,
      }
    });

    // 1. Parallax background moves slightly
    tl.to(parallaxBgRef.current, {
      y: -200,
      ease: "none",
      duration: 1,
    }, 0);

    // 2. Text Reveal & Split Animation
    tl.from(splitText.chars, {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power4.out",
    }, 0);

    // 3. Visual Element transitions (Simulating Apple-style product morph/fade)
    tl.to(visualRef.current, {
      scale: 1.5,
      rotation: 15,
      borderRadius: "50%",
      duration: 2,
    }, 0.5);

    // 4. Text moves away
    tl.to(splitText.words, {
      y: -150,
      opacity: 0,
      stagger: 0.02,
      duration: 1,
    }, 2);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      splitText.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Parallax Background Layer */}
      <div 
        ref={parallaxBgRef} 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #3b82f6 0%, transparent 70%)',
          transform: 'scale(1.5)'
        }}
      />

      <div className="z-10 flex flex-col items-center justify-center text-center w-full max-w-5xl mx-auto px-4">
        {/* Main Split Text Heading */}
        <h1 
          ref={textRef} 
          className="text-6xl md:text-8xl font-extrabold tracking-tighter uppercase font-sans mb-12"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
        >
          Creation <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Without Limitation</span>
        </h1>

        {/* Central Visual Element (Placeholder for Morphing Image / 3D Model) */}
        <div 
          ref={visualRef}
          className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tr from-blue-600 to-purple-600 shadow-[0_0_50px_rgba(59,130,246,0.5)] rounded-2xl relative"
        >
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium tracking-widest text-white/50 uppercase">
                [ Dynamic Product State ]
            </div>
        </div>
      </div>
    </div>
  );
}
