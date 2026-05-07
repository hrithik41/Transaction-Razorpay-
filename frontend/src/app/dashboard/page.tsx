'use client';

import { useEffect, useState } from "react";
import { dashboard, createOrder, verifyPayment, getProducts } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
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
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard:", error);
                router.push('/login');
                // Keep loading as true to prevent dashboard content from rendering
            }
        };

        fetchDashboard();
    }, [router]);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            router.push('/login');
        }
    };

    const handlePayment = async (productId: string) => {
        setIsProcessing(true);
        try {
            // 1. Create order on backend
            const order = await createOrder(productId);
            console.log('order=>', order);
            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Financely",
                description: "Wallet Top-up",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify payment on backend
                        const payresult = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: order.amount,
                        });
                        console.log('payresult=>', payresult);
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
                <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            {/* Minimalist Top Nav */}
            <nav className="bg-white border-b border-zinc-200">
                <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
                        </div>
                        <span className="font-semibold text-zinc-900 tracking-tight">Financely</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
                    <p className="text-zinc-500 mt-2">Here is what's happening with your account today.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Account Status</p>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <p className="text-lg font-medium text-zinc-900">Active</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Verified</p>
                        <p className="mt-4 text-lg font-medium text-zinc-900 truncate">{user?.email}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">System Security</p>
                        <p className="mt-4 text-lg font-medium text-zinc-900">JWT Protected</p>
                    </div>
                </div>

                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Available Products</h2>
                        <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
                            {products?.length} Items
                        </span>
                    </div>

                    <div className="grid grid-cols-1 mb-10 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product: any) => (
                            <div key={product.product_id} className="group bg-white border border-zinc-200 rounded-3xl overflow-hidden hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-zinc-100">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={product.product_image}
                                        alt={product.product_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                        <span className="text-xs font-bold text-zinc-900">
                                            {Math.round(((product.display_price - product.discount_price) / product.display_price) * 100)}% OFF
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-semibold text-zinc-900 text-lg">{product.product_name}</h3>
                                    <p className="text-sm text-zinc-500 mt-2 line-clamp-2 h-10">{product.product_description}</p>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-400 line-through">₹{product.display_price}</span>
                                            <span className="text-xl font-bold text-zinc-900">₹{product.discount_price}</span>
                                        </div>

                                        <button
                                            onClick={() => handlePayment(product.product_id)}
                                            disabled={isProcessing}
                                            className="bg-zinc-900 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-zinc-800 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                        <h2 className="font-semibold text-zinc-900">Recent Activity</h2>
                        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View all</button>
                    </div>
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm text-zinc-500">No transactions recorded yet.</p>
                        <button
                            onClick={() => handlePayment('testProduct1')}
                            disabled={isProcessing} 
                            className="mt-6 inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200 disabled:opacity-50"
                        >
                            {isProcessing ? "Processing..." : "Top-up ₹500"}
                        </button>
                    </div>
                </section>

            </main>
        </div>
    );
}
