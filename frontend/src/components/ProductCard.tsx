'use client';

import { useState } from "react";
import { Plus, Minus, Check, ArrowRight } from "lucide-react";
import { addToCart } from "@/lib/api";

interface ProductCardProps {
    product: any;
    handlePayment: (productId: string) => void;
    onCartUpdate?: () => void;
}

export const ProductCard = ({ product, handlePayment, onCartUpdate }: ProductCardProps) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const onAddToCart = async () => {
        setIsAdding(true);
        try {
            const res = await addToCart({ productId: product.product_id, quantity });

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
        <div className="group bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden hover:border-zinc-900 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden bg-zinc-100">
                <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-white/20">
                    <span className="text-[10px] font-light text-zinc-900 tracking-tighter uppercase">
                        {discountPercentage}% Save
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
                <div className="mb-4">
                    <h3 className="font-light text-zinc-900 text-xl tracking-tight leading-tight mb-2">{product.product_name}</h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 h-10 leading-relaxed font-medium">{product.product_description}</p>
                </div>

                <div className="mt-8 flex items-end justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-400 line-through mb-1 font-medium">₹{product.display_price}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-light text-zinc-900">₹</span>
                            <span className="text-3xl font-black text-zinc-900 tracking-tighter">{product.discount_price}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-36">
                        {/* Buy Now Button */}
                        <button
                            onClick={() => handlePayment(product.product_id)}
                            className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-2xl text-[10px] font-light tracking-widest uppercase hover:bg-zinc-200 transition-all active:scale-95"
                        >
                            Instant Buy
                        </button>

                        {/* Add to Cart Container */}
                        <div className="group/btn relative h-12">
                            <button className={`w-full h-full flex items-center justify-center gap-2 rounded-2xl text-[10px] font-light tracking-widest uppercase transition-all duration-300 ${isDone ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white group-hover/btn:opacity-0 shadow-lg shadow-zinc-200'}`}>
                                {isDone ? <Check size={16} /> : "Add to Bag"}
                            </button>

                            {!isDone && (
                                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 flex items-center justify-between bg-zinc-900 rounded-2xl px-2 transition-all duration-300 transform translate-y-2 group-hover/btn:translate-y-0 shadow-xl">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                                        className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-white font-black text-sm w-6 text-center tabular-nums">{quantity}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }} 
                                        className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onAddToCart(); }} 
                                        disabled={isAdding} 
                                        className="bg-white text-zinc-900 p-2 rounded-xl hover:scale-105 transition-transform active:scale-95 ml-1"
                                    >
                                        {isAdding ? <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div> : <ArrowRight size={14} strokeWidth={3} />}
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
