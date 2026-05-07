'use client';

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle2, CreditCard, Calendar, Hash, ArrowUpRight, Loader2 } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data.transactions || []);
            } catch (err) {
                setError("Failed to load your financial history");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

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
                <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold text-sm transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
                        </div>
                        <span className="font-black text-lg tracking-tighter uppercase">Activity</span>
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <header className="mb-16">
                    <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">Order History</h1>
                    <p className="text-zinc-500 font-medium text-lg">A detailed log of your premium transactions.</p>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-red-600 text-sm font-bold uppercase tracking-widest text-center">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 border border-zinc-200 text-center shadow-sm">
                        <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <CreditCard size={40} className="text-zinc-300" />
                        </div>
                        <h2 className="text-2xl font-black mb-4 uppercase tracking-tight text-zinc-900">No Records</h2>
                        <p className="text-zinc-500 font-medium mb-10 max-w-xs mx-auto">You haven't made any transactions yet.</p>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-transform"
                        >
                            Explore Marketplace
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="group bg-white p-8 rounded-4xl border border-zinc-200 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                                <Hash size={14} />
                                            </div>
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest truncate max-w-[200px]">
                                                {order.razorpayOrderId}
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-baseline gap-1 mb-1">
                                                <span className="text-sm font-bold text-zinc-900">₹</span>
                                                <span className="text-3xl font-black tracking-tighter text-zinc-900">
                                                    {order.amount}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar size={12} />
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'long', 
                                                    day: 'numeric', 
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
                                            order.status === 'SUCCESS' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500' 
                                                : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                        }`}>
                                            {order.status === 'SUCCESS' ? (
                                                <>
                                                    <CheckCircle2 size={14} />
                                                    Settled
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={14} />
                                                    Processing
                                                </>
                                            )}
                                        </div>
                                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                                            Secured Transaction
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Decorative Arrow */}
                                <div className="absolute -bottom-6 -right-6 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none">
                                    <ArrowUpRight size={180} strokeWidth={2} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <footer className="mt-20 text-center py-10 border-t border-zinc-100">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">
                        Financely &copy; 2026. Precision Financial Engineering.
                    </p>
                </footer>
            </main>
        </div>
    );
}