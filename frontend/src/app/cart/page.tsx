'use client';

import { useEffect, useState } from "react";
import { getCart, removeFromCart, addToCart, createOrder, verifyPayment } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import { checkoutCart, clearCart, markPaymentFailed } from "@/lib/api";

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const fetchCart = async () => {
        try {
            const data = await getCart();
            setCart(data.cart || []);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (productId: string) => {
        try {
            await removeFromCart({productId});
            fetchCart();
        } catch (error) {
            alert("Failed to remove item");
        }
    };

    const handleUpdateQuantity = async (productId: string, delta: number) => {
        try {
            await addToCart({ productId, quantity: delta });
            fetchCart();
        } catch (error) {
            console.error(error);
        }
    };

    const subtotal = cart.reduce((acc, cart) => acc + (cart.product.discount_price * cart.cart_quantity), 0);

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            if (cart.length === 0) return;
            const response = await checkoutCart();
            const { order } = response;
            const order_id = order.id;
            const amount = order.amount;
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: "INR",
                name: "Financely",
                description: "Premium Product Purchase",
                image: "/logo.png",
                order_id: order_id,
                handler: async function (response: any) {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: amount / 100
                        });
                        await clearCart();
                        setCart([]);
                        router.push('/dashboard');
                    } catch (error) {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com"
                },
                notes: {
                    address: "User Address"
                },
                theme: {
                    color: "#000000"
                }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', async function (response: any) {
                try {
                    await markPaymentFailed({ orderId: response.error.metadata.order_id });
                } catch (e) {
                    console.error("Failed to mark payment as failed", e);
                }
                alert("Payment Failed");
            });
            rzp.open();
        } catch (error) {
            alert("Checkout failed");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="w-8 h-8 text-zinc-900 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
            {/* Header */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-light text-sm transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Shop
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
                        </div>
                        <span className="font-black text-lg tracking-tighter uppercase">Cart</span>
                    </div>
                    <div className="w-20"></div> {/* Spacer for symmetry */}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="text-5xl font-black tracking-tighter mb-12 uppercase">Your Bag</h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 border border-zinc-200 text-center shadow-sm">
                        <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag size={40} className="text-zinc-300" />
                        </div>
                        <h2 className="text-4xl font-light mb-4 uppercase tracking-tight text-zinc-900">Empty Bag</h2>
                        <p className="text-zinc-500 font-medium mb-10 max-w-xs mx-auto">Looks like you haven't added any premium items yet.</p>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-transform"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* List Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item) => (
                                <div key={item.cart_id} className="group bg-white p-6 rounded-4xl border border-zinc-200 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500">
                                    <div className="w-full md:w-40 h-40 bg-zinc-100 rounded-2xl overflow-hidden shrink-0">
                                        <img src={item.product.product_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-2">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-black tracking-tight text-zinc-900">{item.product.product_name}</h3>
                                                <button 
                                                    onClick={() => handleRemove(item.product.product_id)}
                                                    className="text-zinc-300 hover:text-red-500 transition-colors p-2"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-zinc-500 font-medium line-clamp-1">{item.product.product_description}</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.product.product_id, -1)}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-black tabular-nums text-zinc-900">{item.cart_quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.product.product_id, 1)}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors text-zinc-900"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div className="text-right font-black">
                                                <span className="text-[10px] font-light text-zinc-400 block mb-1 uppercase tracking-widest">Total Price</span>
                                                <span className="text-4xl font-light tracking-tighter text-zinc-900">₹{item.product.discount_price * item.cart_quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white sticky top-28 shadow-2xl shadow-zinc-200">
                            <h2 className="text-4xl font-light mb-10 tracking-tighter uppercase">Order Summary</h2>
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-zinc-400 font-light text-xs uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white tabular-nums">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400 font-light text-xs uppercase tracking-widest">
                                    <span>Shipping Charge</span>
                                    <span className="text-emerald-400 font-black">FREE</span>
                                </div>
                                <div className="flex justify-between text-zinc-400 font-light text-xs uppercase tracking-widest">
                                    <span>Estimated Tax</span>
                                    <span className="text-white tabular-nums">₹0</span>
                                </div>
                                <div className="h-px bg-zinc-800 my-8"></div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-light text-zinc-500 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                                        <p className="text-4xl font-light tracking-tighter tabular-nums">₹{subtotal}</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full bg-white text-zinc-900 py-5 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        <CreditCard size={18} />
                                        Complete Payment
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 mt-8 opacity-50">
                                <ShoppingBag size={12} />
                                <p className="text-[9px] font-light uppercase tracking-[0.2em]">
                                    Secure & Encrypted Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}