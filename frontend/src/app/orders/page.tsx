'use client';

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const data = await getOrders();
                setOrders(data.transactions || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return <CheckCircle2 size={16} className="text-emerald-500" />;
            case 'FAILED':
                return <XCircle size={16} className="text-red-500" />;
            case 'REFUNDED':
                return <Clock size={16} className="text-amber-500" />;
            default:
                return <Clock size={16} className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <main className="max-w-[1200px] mx-auto px-6 md:px-12 py-24">
                
                {/* Header */}
                <header className="mb-20">
                    <Link href="/" className="inline-flex items-center gap-3 text-gray-500 hover:text-white transition-colors mb-12 text-[10px] uppercase tracking-[0.2em] font-light">
                        <ArrowLeft size={14} />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-extralight tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Order History
                    </h1>
                    <p className="text-gray-400 font-light max-w-lg leading-relaxed">
                        Track your recent acquisitions and view the status of your premium transactions.
                    </p>
                </header>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="border border-white/10 bg-[#0f0f0f] p-16 text-center flex flex-col items-center">
                        <Package size={48} strokeWidth={1} className="text-gray-600 mb-6" />
                        <h2 className="text-xl font-extralight mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>No Orders Yet</h2>
                        <p className="text-gray-500 font-light text-sm mb-8">You have not made any purchases.</p>
                        <Link href="/" className="bg-white text-black px-8 py-3 text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors">
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, i) => (
                            <motion.div 
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-light text-gray-500 uppercase tracking-widest">
                                            Order ID: {order.razorpayOrderId}
                                        </span>
                                    </div>
                                    <div className="text-xl font-light mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        ₹{order.amount?.toLocaleString('en-IN') || '0'}
                                    </div>
                                    <div className="text-xs text-gray-500 font-light">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                                        {getStatusIcon(order.status)}
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-gray-300">
                                            {order.status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}