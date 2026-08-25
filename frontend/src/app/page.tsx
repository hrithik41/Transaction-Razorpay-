import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section containing the Pinned GSAP ScrollTrigger */}
      <Hero />
      
      {/* Filler content to allow scrolling after the pinned section */}
      <div className="w-full bg-black text-white py-32 px-8 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">The Journey Continues</h2>
        <p className="max-w-2xl text-center text-gray-400 text-lg">
          Keep scrolling to see the rest of the enterprise e-commerce features. 
          The previous section is pinned using GSAP ScrollTrigger, and this content flows smoothly right underneath once the timeline finishes.
        </p>
        <div className="h-screen" />
      </div>
    </main>
  );
}
