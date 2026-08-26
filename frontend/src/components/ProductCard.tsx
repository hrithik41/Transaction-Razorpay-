// frontend/src/components/ProductCard.tsx
'use client';

import { useState } from "react";
import { Plus, Minus, Check, ArrowRight } from "lucide-react";
import { addToCart as apiAddToCart } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: any;
    handlePayment: (productId: string) => void;
    onCartUpdate?: () => void;
}

export const ProductCard = ({ product, handlePayment, onCartUpdate }: ProductCardProps) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    
    // Hook into our new global Zustand store
    const storeAddToCart = useCartStore((state) => state.addToCart);

    const onAddToCart = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setIsAdding(true);
        try {
            // Keep your existing backend API call
            await apiAddToCart({ productId: product.product_id, quantity });
            
            // Instantly update our global frontend store!
            storeAddToCart({
                product_id: product.product_id,
                product_name: product.product_name,
                display_price: product.display_price,
                discount_price: product.discount_price,
                product_image: product.product_image,
                quantity: quantity
            });

            setIsDone(true);
            if (onCartUpdate) onCartUpdate();
            setTimeout(() => setIsDone(false), 2000);
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    const discountPercentage = Math.round(((product.display_price - product.discount_price) / product.display_price) * 100);

    return (
        <div className="group relative flex flex-col transition-all duration-700 hover:-translate-y-2">
            
            {/* Image Section - No Box, Floating */}
            <div className="relative h-80 w-full overflow-hidden flex items-center justify-center mb-6">
                <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-[1.5s] ease-out drop-shadow-2xl"
                />
                
                {/* Subtle Discount Tag */}
                <div className="absolute top-0 right-0">
                    <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase">
                        {discountPercentage}% Save
                    </span>
                </div>
            </div>

            {/* Content Section - No Box, Clean Typography */}
            <div className="flex flex-col flex-1">
                <div className="mb-6">
                    <h3 className="font-light text-white text-2xl tracking-wide mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 leading-relaxed font-light">
                        {product.product_description}
                    </p>
                </div>

                <div className="flex items-end justify-between gap-4 mt-auto">
                    
                    {/* Price Section */}
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-600 line-through mb-1 tracking-wider">₹{product.display_price}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-light text-white">₹</span>
                            <span className="text-2xl font-light text-white tracking-widest">{product.discount_price}</span>
                        </div>
                    </div>

                    {/* Action Buttons - Redesigned to be sleek lines instead of boxes */}
                    <div className="flex flex-col gap-3 w-32">
                        
                        <button
                            onClick={() => isAuthenticated ? handlePayment(product.product_id) : router.push("/login")}
                            className="w-full text-white text-[9px] pb-1 border-b border-white/20 font-light tracking-widest uppercase hover:border-white transition-all text-left"
                        >
                            Instant Buy
                        </button>

                        <div className="group/btn relative h-6">
                            <button className={`w-full h-full flex items-center justify-start gap-2 border-b text-[9px] font-light tracking-widest uppercase transition-all duration-300 ${isDone ? 'border-emerald-500 text-emerald-500' : 'border-white/20 text-white group-hover/btn:opacity-0'}`}>
                                {isDone ? <Check size={12} /> : "+ Add to Bag"}
                            </button>

                            {!isDone && (
                                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 flex items-center justify-between transition-all duration-300 border-b border-white">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-white font-light text-xs w-6 text-center tabular-nums">{quantity}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }} 
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus size={12} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onAddToCart(); }} 
                                        disabled={isAdding} 
                                        className="text-white hover:scale-110 transition-transform ml-2"
                                    >
                                        {isAdding ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div> : <ArrowRight size={12} strokeWidth={2} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
