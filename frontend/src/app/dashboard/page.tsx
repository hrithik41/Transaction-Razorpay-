'use client';

import { useEffect, useState } from "react";
import { dashboard, createOrder, verifyPayment, getProducts, getCart } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ShoppingBag, LogOut, ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboard = async () => {
            if (typeof window === 'undefined') return;

            const token = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const data = await dashboard();
                setUser(data.user);
                const productData = await getProducts();
                setProducts(productData.products);
                const cartData = await getCart();
                setCart(cartData.cart || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard:", error);
                router.push('/login');
            }
        };

        fetchDashboard();
    }, [router]);

    const refreshCartBadge = async () => {
        const cartData = await getCart();
        setCart(cartData.cart || []);
    };


    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            router.push('/login');
        }
    };

    const handleCart = () => {
        if (typeof window !== 'undefined') {
            router.push('/cart');
        }
    };

    const handlePayment = async (productId: string) => {
        setIsProcessing(true);
        try {
            const order = await createOrder(productId);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Financely",
                description: "Purchase",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: order.amount,
                        });
                        alert("Payment Successful!");
                        // window.location.reload();
                    } catch (err) {
                        alert("Verification failed!");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: "#09090b" }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Could not initialize payment");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
            {/* Minimalist Top Nav */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-xl shadow-zinc-200 rotate-3 group hover:rotate-0 transition-transform duration-500 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
                        </div> */}
                        <span className="font-black text-2xl tracking-tighter uppercase">Financely</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCart}
                            className="p-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all relative group"
                        >
                            <ShoppingBag size={22} strokeWidth={2.5} />
                            <span className="absolute top-2 right-2 w-5 h-5 bg-zinc-900 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                                {cart?.length}
                            </span>
                        </button>

                        <div className="h-6 w-px bg-zinc-200 mx-2"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 pl-4 pr-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
                        >
                            <LogOut size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <header className="mb-20">
                    <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Zap size={12} fill="currentColor" />
                        Live Dashboard
                    </div>
                    <h1 className="text-6xl font-black text-zinc-900 tracking-tighter leading-none mb-6">
                        Good morning, <br />
                        <span className="text-zinc-400">{user?.name?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium max-w-md leading-relaxed">
                        Explore our curated collection of premium digital assets and services.
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {[
                        { label: "Account Status", val: "Active", icon: <Activity className="text-emerald-500" size={20} />, sub: "All systems operational" },
                        { label: "Identity", val: user?.email, icon: <ShieldCheck className="text-indigo-500" size={20} />, sub: "Verified Account" },
                        { label: "Security", val: "JWT Shield", icon: <Zap className="text-amber-500" size={20} />, sub: "256-bit Encryption" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-4xl border border-zinc-200 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-500">
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <p className="text-xl font-black text-zinc-900 truncate mb-1 tracking-tight">{stat.val}</p>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                <section className="mb-32">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2 uppercase">Marketplace</h2>
                            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Premium Selection</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-[2px] w-12 bg-zinc-900"></div>
                            <span className="text-sm font-black tabular-nums">{products?.length} AVAILABLE</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products?.map((product: any) => (
                            <ProductCard key={product.product_id} product={product} handlePayment={handlePayment} onCartUpdate={refreshCartBadge} />
                        ))}
                    </div>
                </section>

                <section className="relative">
                    <div className="absolute inset-0 bg-zinc-900 rounded-[3rem] -rotate-1"></div>
                    <div className="relative bg-zinc-900 text-white p-16 rounded-[3rem] overflow-hidden border border-zinc-800">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="max-w-md">
                                <h2 className="text-4xl font-black tracking-tighter mb-4 leading-none">Ready to check your history?</h2>
                                <p className="text-zinc-400 font-medium leading-relaxed">View all your previous transactions and order status in one secure place.</p>
                            </div>
                            <button
                                onClick={() => router.push('/orders')}
                                className="group flex items-center gap-4 bg-white text-zinc-900 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 whitespace-nowrap shadow-2xl shadow-white/10"
                            >
                                View Order History
                                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-zinc-800 rounded-full blur-3xl opacity-50"></div>
                    </div>
                </section>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-200 text-center">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">
                    &copy; 2026 Financely Inc. Built with Precision.
                </p>
            </footer>
        </div>
    );
}
