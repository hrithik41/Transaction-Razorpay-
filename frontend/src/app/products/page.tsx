// frontend/src/app/products/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Calling your backend API!
                const res = await getProducts();

                // Sometimes Axios returns the array directly, sometimes inside a 'data' or 'products' object.
                console.log("Backend response:", res);

                setProducts(res.products || res.data || res);
            } catch (error) {
                console.error("Failed to load products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Simple placeholder for instant buy
    const handlePayment = (productId: string) => {
        console.log("Proceeding to instant checkout for", productId);
        alert("Instant checkout flow coming soon!");
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="mb-16 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight uppercase" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Our Collections
                    </h1>
                    <p className="text-gray-400 mt-4 text-lg font-light max-w-xl">
                        Explore the pinnacle of horology. Each timepiece is meticulously crafted to redefine precision and luxury.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                    </div>
                )}

                {/* Product Grid */}
                {!loading && products?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                handlePayment={handlePayment}
                            />
                        ))}
                    </div>
                ) : !loading ? (
                    <div className="text-center text-gray-500 py-32 border border-white/5 rounded-2xl bg-[#0a0a0a]">
                        <h3 className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>No timepieces found.</h3>
                        <p>Please check back soon for our latest arrivals or ensure your backend server is running.</p>
                    </div>
                ) : (null)}

            </div>
        </div>
    );
}
