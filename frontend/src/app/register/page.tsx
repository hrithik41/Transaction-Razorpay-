'use client';

import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
    const [name, setName] = useState('');
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
            await register({ name, email, password });
            router.push(`/register/verify?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration encountered an error. Please try a different identifier.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white selection:bg-white selection:text-black font-sans p-6 relative overflow-hidden">
            
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="mb-12 text-center flex flex-col items-center">
                    <Link href="/" className="mb-6 group">
                        <h1 className="text-4xl font-extralight tracking-[0.25em] uppercase text-white transition-opacity group-hover:opacity-70" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Register
                        </h1>
                    </Link>
                    <h2 className="text-[10px] tracking-[0.4em] uppercase font-light text-gray-500">
                        Client Registration
                    </h2>
                </div>

                <div className="bg-[#0f0f0f] p-10 md:p-14 border border-white/5">
                    {error && (
                        <div className="mb-8 p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] font-light uppercase tracking-[0.2em] text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[9px] font-light text-gray-500 uppercase tracking-[0.3em]">Full Legal Name</label>
                            <input
                                type="text"
                                required
                                className="w-full pb-3 bg-transparent border-b border-white/10 text-sm font-light text-white focus:border-white outline-none transition-colors placeholder:text-gray-800"
                                placeholder="Johnathan Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

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
                            <label className="text-[9px] font-light text-gray-500 uppercase tracking-[0.3em]">Secure Password</label>
                            <input
                                type="password"
                                required
                                className="w-full pb-3 bg-transparent border-b border-white/10 text-sm font-light text-white focus:border-white outline-none transition-colors placeholder:text-gray-800"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <p className="text-[9px] font-light text-gray-500 leading-relaxed uppercase tracking-tighter">
                            By joining, you agree to our <span className="text-white">Terms of Service</span> and <span className="text-white">Privacy Protocols</span>.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black text-[10px] font-medium uppercase tracking-[0.3em] py-5 transition-all hover:bg-gray-200 disabled:opacity-50 mt-12 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={16} strokeWidth={1.5} />
                            ) : (
                                <>
                                    Request Access
                                    <ArrowRight size={14} strokeWidth={1.5} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500 font-light text-[10px] uppercase tracking-widest">
                        Already authenticated?{" "}
                        <Link href="/login" className="text-white hover:text-gray-300 transition-colors underline underline-offset-4 decoration-white/20">
                            Secure Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}