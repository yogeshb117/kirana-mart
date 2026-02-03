"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Phone } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send OTP");

            setStep("OTP");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                phone,
                otp,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error); // NextAuth error
            } else {
                // Check if user is admin
                const session = await getSession();
                if (session?.user?.role === 'ADMIN') {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {step === "PHONE" ? "Login / Sign Up" : "Verify OTP"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === "PHONE"
                            ? "Enter your mobile number to continue"
                            : `Enter the code sent to +91 ${phone}`}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={step === "PHONE" ? handleSendOtp : handleVerifyOtp}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {step === "PHONE" ? (
                            <div>
                                <label htmlFor="phone" className="sr-only">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Phone className="h-5 w-5" />
                                        <span className="ml-2 text-gray-500">+91</span>
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        maxLength={10}
                                        className="appearance-none rounded-lg relative block w-full pl-20 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "");
                                            if (val.length <= 10) setPhone(val);
                                        }}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="otp" className="sr-only">OTP</label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 text-center tracking-[0.5em] text-2xl font-bold"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val.length <= 6) setOtp(val);
                                    }}
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading || (step === "PHONE" ? phone.length !== 10 : otp.length !== 6)}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center">
                                    {step === "PHONE" ? "Get OTP" : "Verify & Login"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </button>
                    </div>

                    {step === "OTP" && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setStep("PHONE")}
                                className="text-sm text-gray-600 hover:text-green-600 underline"
                            >
                                Change Phone Number
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
