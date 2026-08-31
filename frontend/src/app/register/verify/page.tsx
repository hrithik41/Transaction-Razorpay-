'use client';

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtp, register } from "@/lib/api";
import Link from "next/link";
import { Loader2, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

function VerifyOtpContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const router = useRouter();

    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    // Resend countdown timer logic
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim();
        if (pasteData.length === 4 && !isNaN(Number(pasteData))) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            inputRefs[3].current?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const fullOtp = otp.join('');
        if (fullOtp.length !== 4) {
            setError('Please enter all 4 digits');
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtp({ email, otp: fullOtp });
            
            // Log the user into the global state (as it was working before)
            const authLogin = useAuthStore.getState().login;
            authLogin(res.user, res.accessToken, res.refreshToken);

            setIsComplete(true);
            setSuccess('Verification successful! Access granted.');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setError('');
        setSuccess('');
        setResendLoading(true);

        try {
            await register({ name: 'Resend', email, password: 'ResendPassword123' });
            setSuccess('A new security code has been dispatched.');
            setCooldown(60);
            setOtp(['', '', '', '']);
            inputRefs[0].current?.focus();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 relative min-h-screen">
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[420px] relative z-10 mt-16 lg:mt-0"
            >
                {/* Onboarding Progress */}
                <div className="flex items-center justify-between mb-10 md:mb-12">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="w-full h-[2px] bg-white/20 relative">
                            <div className="absolute top-0 left-0 h-full bg-white w-full"></div>
                        </div>
                        <span className="text-[8px] tracking-[0.2em] uppercase text-gray-500">1. Profile</span>
                    </div>
                    <div className="w-2 md:w-4"></div>
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="w-full h-[2px] bg-white/20 relative">
                            <div className="absolute top-0 left-0 h-full bg-white w-full"></div>
                        </div>
                        <span className="text-[8px] tracking-[0.2em] uppercase text-white">2. Verification</span>
                    </div>
                    <div className="w-2 md:w-4"></div>
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="w-full h-[2px] bg-white/20 relative">
                            <div className={`absolute top-0 left-0 h-full bg-white transition-all duration-1000 ${isComplete ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <span className={`text-[8px] tracking-[0.2em] uppercase transition-colors duration-1000 ${isComplete ? 'text-white' : 'text-gray-500'}`}>3. Complete</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!isComplete ? (
                        <motion.div 
                            key="verification-form"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-10 md:mb-12">
                                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-6 bg-white/5">
                                    <ShieldCheck size={18} strokeWidth={1} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    Verify Identity
                                </h2>
                                <p className="text-gray-400 font-light text-sm mb-1">Enter the 4-digit code sent to:</p>
                                <p className="text-white font-medium text-xs tracking-wider border-b border-white/10 pb-4 inline-block">{email}</p>
                            </div>

                            <div className="bg-[#070707] p-6 sm:p-10 md:p-12 border border-white/5 relative">
                                {/* Security Watermark */}
                                <div className="absolute top-4 right-4 pointer-events-none opacity-10">
                                    <ShieldCheck size={40} />
                                </div>
                                
                                {error && (
                                    <div className="mb-8 p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] font-light uppercase tracking-[0.2em] text-center">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-8 p-4 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-light uppercase tracking-[0.2em] text-center">
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="flex justify-between items-center gap-4">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={inputRefs[index]}
                                                type="text"
                                                maxLength={1}
                                                className="w-14 h-16 text-center text-2xl font-light bg-transparent border-b border-white/20 focus:border-white text-white outline-none transition-colors relative z-10"
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={index === 0 ? handlePaste : undefined}
                                                required
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-black text-[10px] font-medium uppercase tracking-[0.3em] py-5 transition-all hover:bg-gray-200 disabled:opacity-50 mt-12 flex items-center justify-center gap-3 relative z-10"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={16} strokeWidth={1.5} />
                                        ) : (
                                            <>
                                                Authenticate
                                                <ArrowRight size={14} strokeWidth={1.5} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 text-center relative z-10">
                                    <button
                                        onClick={handleResend}
                                        disabled={cooldown > 0 || resendLoading}
                                        className="text-gray-500 hover:text-white text-[9px] uppercase tracking-widest disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        {resendLoading ? (
                                            <Loader2 className="animate-spin" size={12} strokeWidth={1.5} />
                                        ) : (
                                            <RefreshCw size={12} strokeWidth={1.5} className={cooldown > 0 ? "animate-pulse" : ""} />
                                        )}
                                        {cooldown > 0 ? `Resend Code in ${cooldown}s` : "Resend Code"}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-4">
                                    Wrong email?{" "}
                                    <Link href="/register" className="text-gray-400 hover:text-white underline underline-offset-4 decoration-white/20 transition-colors">
                                        Start Over
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-message"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col items-center justify-center text-center mt-20"
                        >
                            <div className="w-16 h-16 border border-emerald-500/30 flex items-center justify-center mb-8 bg-emerald-500/10 rounded-full">
                                <CheckCircle2 size={32} strokeWidth={1.5} className="text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Access Granted
                            </h2>
                            <p className="text-gray-400 font-light text-sm max-w-xs leading-relaxed">
                                Your client profile has been securely verified and authenticated. Redirecting you to the portal...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default function VerifyOtp() {
    return (
        <div className="min-h-screen flex bg-[#020202] text-white selection:bg-white selection:text-black font-sans relative overflow-hidden">
            
            {/* Left Side: Rich Editorial Image (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 border-r border-white/5">
                <div className="absolute inset-0">
                    <img 
                        src="/hero-watch.png" 
                        alt="Vilix Security" 
                        className="w-full h-full object-cover opacity-20 mix-blend-screen scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020202]" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="group inline-block">
                        <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-white transition-opacity group-hover:opacity-70" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Vilix
                        </h1>
                    </Link>
                </div>

                <div className="relative z-10 max-w-md">
                    <span className="text-[9px] tracking-[0.4em] uppercase font-medium text-white/50 block mb-6 border-b border-white/10 pb-4">
                        Security Verification
                    </span>
                    <h2 className="text-4xl font-light mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Uncompromised Security.
                    </h2>
                    <p className="text-gray-400 font-light text-sm leading-relaxed">
                        To protect the integrity of our inner circle and client data, we employ strict cryptographic verification for all new profile establishments.
                    </p>
                </div>
            </div>

            <Suspense fallback={
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={32} />
                </div>
            }>
                <VerifyOtpContent />
            </Suspense>
        </div>
    );
}
