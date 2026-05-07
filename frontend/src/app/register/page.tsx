'use client';

import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2, Sparkles, Shield } from "lucide-react";

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
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration encountered an error. Please try a different identifier.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 selection:bg-zinc-900 selection:text-white font-sans p-6">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-zinc-200/50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-zinc-200/50 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-zinc-200 mb-6 -rotate-3">
                        <div className="w-5 h-5 bg-white rounded-sm rotate-45"></div>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase mb-2">Request Access</h1>
                    <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Join the Elite Network</p>
                </div>

                <div className="bg-white p-10 rounded-4xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 backdrop-blur-sm">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-zinc-900 transition-colors">
                                    <User size={18} strokeWidth={2.5} />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white outline-none transition-all placeholder:text-zinc-300"
                                    placeholder="Johnathan Doe" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-zinc-900 transition-colors">
                                    <Mail size={18} strokeWidth={2.5} />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white outline-none transition-all placeholder:text-zinc-300"
                                    placeholder="your@email.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-zinc-900 transition-colors">
                                    <Lock size={18} strokeWidth={2.5} />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white outline-none transition-all placeholder:text-zinc-300"
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <Shield size={20} className="text-zinc-900" strokeWidth={2.5} />
                            <p className="text-[9px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tighter">
                                By joining, you agree to our <span className="text-zinc-900">Terms of Service</span> and <span className="text-zinc-900">Privacy Protocols</span>.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 mt-2 shadow-xl shadow-zinc-200 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    Create Profile
                                    <ArrowRight size={16} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center space-y-4">
                    <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                        Already authenticated?{" "}
                        <Link href="/login" className="text-zinc-900 hover:underline underline-offset-4 decoration-2">
                            Secure Login
                        </Link>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-zinc-300">
                        <Sparkles size={12} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encryption Grade Security</span>
                    </div>
                </div>
            </div>
        </div>
    );
}