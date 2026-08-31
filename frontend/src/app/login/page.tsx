'use client';

import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login({ email, password });

            const authLogin = useAuthStore.getState().login;
            authLogin(data.user, data.accessToken, data.refreshToken);

            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#020202] text-white selection:bg-white selection:text-black font-sans relative overflow-hidden">
            
            {/* Left Side: Rich Editorial Image (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0">
                    {/* Placeholder massive hero image */}
                    <img 
                        src="/products/product_3.png" 
                        alt="Vilix Heritage" 
                        className="w-full h-full object-cover opacity-30 grayscale mix-blend-screen scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020202]" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="group inline-block">
                        <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-white transition-opacity group-hover:opacity-70" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Login
                        </h1>
                    </Link>
                </div>

                <div className="relative z-10 max-w-md">
                    <span className="text-[9px] tracking-[0.4em] uppercase font-medium text-white/50 block mb-6 border-b border-white/10 pb-4">
                        Client Portal
                    </span>
                    <h2 className="text-4xl font-light mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Enter the Inner Circle.
                    </h2>
                    <p className="text-gray-400 font-light text-sm leading-relaxed">
                        Access your curated collection, manage bespoke commissions, and enjoy priority access to highly anticipated flagship releases.
                    </p>
                </div>
            </div>

            {/* Right Side: Authentication Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 relative min-h-screen">
                
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[420px] relative z-10 mt-16 lg:mt-0"
                >
                    <div className="mb-10 md:mb-16">
                        <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Welcome Back
                        </h2>
                        <h3 className="text-[10px] tracking-[0.3em] uppercase font-light text-gray-500">
                            Secure Client Authentication
                        </h3>
                    </div>

                    <div className="bg-[#070707] p-6 sm:p-10 md:p-12 border border-white/5">
                        {error && (
                            <div className="mb-8 p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] font-light uppercase tracking-[0.2em] text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[9px] font-light text-gray-500 uppercase tracking-[0.3em]">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full pb-3 bg-transparent border-b border-white/10 text-sm font-light text-white focus:border-white outline-none transition-colors placeholder:text-gray-800"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-light text-gray-500 uppercase tracking-[0.3em]">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full pb-3 bg-transparent border-b border-white/10 text-sm font-light text-white focus:border-white outline-none transition-colors placeholder:text-gray-800"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black text-[10px] font-medium uppercase tracking-[0.3em] py-5 transition-all hover:bg-gray-200 disabled:opacity-50 mt-12 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={16} strokeWidth={1.5} />
                                ) : (
                                    <>
                                        Access Account
                                        <ArrowRight size={14} strokeWidth={1.5} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-12 flex items-center justify-between">
                        <Link href="#" className="text-gray-600 hover:text-white transition-colors text-[9px] uppercase tracking-widest underline underline-offset-4 decoration-white/10">
                            Forgot Password?
                        </Link>
                        <Link href="/register" className="text-gray-400 hover:text-white transition-colors text-[9px] uppercase tracking-widest underline underline-offset-4 decoration-white/20">
                            Request Access
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
