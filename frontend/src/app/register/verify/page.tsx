'use client';

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtp, register } from "@/lib/api";
import Link from "next/link";
import { Loader2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

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

    // Handle typing digits and shifting focus forward
    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    // Handle moving focus backward on backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // Support copying and pasting a 4-digit code directly
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

            // Save access/refresh tokens in localStorage upon successful verification
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);

            setSuccess('Verification successful! Access granted.');
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid OTP code. Please try again.');
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
            // Re-call registration endpoint with email. 
            // The backend detects they exist (unverified) and just sends a new OTP.
            await register({ name: 'Resend', email, password: 'ResendPassword123' });
            setSuccess('A new security code has been sent to your email.');
            setCooldown(60); // 60 seconds resend limit
            setOtp(['', '', '', '']);
            inputRefs[0].current?.focus();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md relative z-10">
            {/* Header */}
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-zinc-200 mb-6 -rotate-3">
                    <div className="w-5 h-5 bg-white rounded-sm rotate-45"></div>
                </div>
                <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase mb-2">Verify Access</h1>
                <p className="text-zinc-400 font-light text-xs uppercase tracking-widest">Enter the 4-digit code sent to:</p>
                <p className="text-zinc-600 font-medium text-xs mt-2 truncate max-w-xs">{email}</p>
            </div>

            <div className="bg-white p-10 rounded-4xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 backdrop-blur-sm">
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* OTP Inputs */}
                    <div className="flex justify-between items-center gap-4 px-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength={1}
                                className="w-16 h-20 text-center text-3xl font-light bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white outline-none transition-all"
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
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-zinc-200 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                Authenticate Code
                                <ArrowRight size={16} strokeWidth={3} />
                            </>
                        )}
                    </button>
                </form>

                {/* Resend Action */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleResend}
                        disabled={cooldown > 0 || resendLoading}
                        className="text-zinc-500 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        {resendLoading ? (
                            <Loader2 className="animate-spin" size={12} />
                        ) : (
                            <RefreshCw size={12} className={cooldown > 0 ? "animate-pulse" : ""} />
                        )}
                        {cooldown > 0 ? `Resend Code in ${cooldown}s` : "Resend Security Code"}
                    </button>
                </div>
            </div>

            <div className="mt-12 text-center space-y-4">
                <p className="text-zinc-400 text-[10px] font-light uppercase tracking-widest">
                    Wrong email?{" "}
                    <Link href="/register" className="text-zinc-900 hover:underline underline-offset-4 decoration-2">
                        Change Details
                    </Link>
                </p>
                <div className="flex items-center justify-center gap-2 text-zinc-300">
                    <Sparkles size={12} />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encryption Grade Security</span>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtp() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 selection:bg-zinc-900 selection:text-white font-sans p-6">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-zinc-200/50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-zinc-200/50 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Suspense is required for next.js static rendering when using useSearchParams */}
            <Suspense fallback={
                <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin text-zinc-900" size={32} />
                </div>
            }>
                <VerifyOtpContent />
            </Suspense>
        </div>
    );
}
