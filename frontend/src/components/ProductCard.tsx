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
    variant?: 'default' | 'hero';
}

export const ProductCard = ({ product, handlePayment, onCartUpdate, variant = 'default' }: ProductCardProps) => {
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

    if (variant === 'hero') {
        return (
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-24 group">
                {/* Massive Image Block */}
                <div className="w-full lg:w-[55%] h-[50vh] lg:h-[80vh] relative overflow-hidden bg-[#050505] flex items-center justify-center p-6 sm:p-12 lg:p-24 border border-white/5 transition-colors group-hover:border-white/10">
                    <img 
                        src={product.product_image} 
                        alt={product.product_name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-[2s] ease-out drop-shadow-2xl" 
                    />
                    <div className="absolute top-8 right-8">
                        <span className="text-[9px] font-medium text-white/50 tracking-[0.3em] uppercase border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                            {discountPercentage}% Save
                        </span>
                    </div>
                </div>
                
                {/* Spacious Content Block */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center py-6 lg:py-0">
                    <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase mb-4 md:mb-6 block font-medium">Highlight Release</span>
                    <h3 className="text-3xl sm:text-4xl lg:text-6xl text-white font-light mb-6 md:mb-8 leading-[1.1]" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {product.product_name}
                    </h3>
                    <p className="text-gray-400 font-light text-sm lg:text-base leading-relaxed mb-12 max-w-lg">
                        {product.product_description}
                    </p>
                    
                    <div className="flex flex-col mb-10 md:mb-12">
                        <span className="text-xs text-gray-600 line-through mb-1 md:mb-2 tracking-wider">₹{product.display_price}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg md:text-xl font-light text-white/70">₹</span>
                            <span className="text-4xl md:text-5xl font-light text-white tracking-widest">{product.discount_price}</span>
                        </div>
                    </div>

                    {/* Action Buttons for Hero */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <button
                            onClick={() => isAuthenticated ? handlePayment(product.product_id) : router.push("/login")}
                            className="flex-1 bg-white text-black py-4 px-6 text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gray-200 flex items-center justify-center gap-2"
                        >
                            Instant Buy
                        </button>

                        <div className="group/btn relative h-[50px] flex-1">
                            <button 
                                onClick={onAddToCart}
                                disabled={isAdding}
                                className={`w-full h-full flex items-center justify-center gap-2 border border-white/20 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${isDone ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'text-white hover:border-white group-hover/btn:opacity-0'}`}
                            >
                                {isDone ? (
                                    <>
                                        <Check size={16} /> Added
                                    </>
                                ) : (isAdding ? "Adding..." : "+ Add to Bag")}
                            </button>

                            {!isDone && (
                                <div className="absolute inset-0 opacity-0 pointer-events-none group-hover/btn:opacity-100 group-hover/btn:pointer-events-auto flex items-center justify-between transition-all duration-300 border border-white bg-[#0a0a0a] px-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                                        className="text-gray-400 hover:text-white transition-colors p-2"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-white font-medium text-xs w-8 text-center tabular-nums">{quantity}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }} 
                                        className="text-gray-400 hover:text-white transition-colors p-2"
                                    >
                                        <Plus size={16} />
                                    </button>
                                    <div className="w-[1px] h-6 bg-white/20 mx-2"></div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onAddToCart(); }} 
                                        disabled={isAdding} 
                                        className="text-white hover:text-gray-300 transition-transform hover:scale-110 p-2"
                                    >
                                        {isAdding ? <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div> : <ArrowRight size={16} strokeWidth={2} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative flex flex-col transition-all duration-700 hover:-translate-y-2">
            
            {/* Image Section - No Box, Floating */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden flex items-center justify-center mb-4 md:mb-6">
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
                <div className="mb-4 md:mb-6">
                    <h3 className="font-light text-white text-xl md:text-2xl tracking-wide mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 leading-relaxed font-light">
                        {product.product_description}
                    </p>
                </div>

                <div className="flex items-end justify-between gap-4 mt-auto">
                    
                    {/* Price Section */}
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-gray-600 line-through mb-1 tracking-wider">₹{product.display_price}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] md:text-sm font-light text-white">₹</span>
                            <span className="text-xl md:text-2xl font-light text-white tracking-widest">{product.discount_price}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 w-36">
                        
                        <button
                            onClick={() => isAuthenticated ? handlePayment(product.product_id) : router.push("/login")}
                            className="w-full bg-white text-black py-2.5 px-4 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gray-200 flex items-center justify-center gap-2"
                        >
                            Instant Buy
                        </button>

                        <div className="group/btn relative h-[34px]">
                            <button 
                                onClick={onAddToCart}
                                disabled={isAdding}
                                className={`w-full h-full flex items-center justify-center gap-2 border border-white/20 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${isDone ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'text-white hover:border-white group-hover/btn:opacity-0'}`}
                            >
                                {isDone ? (
                                    <>
                                        <Check size={14} /> Added
                                    </>
                                ) : (isAdding ? "Adding..." : "+ Add to Bag")}
                            </button>

                            {!isDone && (
                                <div className="absolute inset-0 opacity-0 pointer-events-none group-hover/btn:opacity-100 group-hover/btn:pointer-events-auto flex items-center justify-between transition-all duration-300 border border-white bg-[#0a0a0a] px-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-white font-medium text-[10px] w-6 text-center tabular-nums">{quantity}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }} 
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                    <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onAddToCart(); }} 
                                        disabled={isAdding} 
                                        className="text-white hover:text-gray-300 transition-transform hover:scale-110"
                                    >
                                        {isAdding ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div> : <ArrowRight size={14} strokeWidth={2} />}
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
