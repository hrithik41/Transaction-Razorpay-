import Hero from "@/components/Hero";
import HorizontalScroll from "@/components/HorizontalScroll";
import FeatureProducts from "@/components/FeatureProducts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <HorizontalScroll />
      <FeatureProducts />
      <Footer />
    </main>
  );
}
