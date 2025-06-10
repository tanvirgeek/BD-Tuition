"use client";

import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            setMessage("Password reset link sent! Check your email.");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Forgot Password?</h2>
            <form onSubmit={handleResetPassword} className="space-y-4 flex flex-col">
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                        type="email"
                        className="grow"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <button
                    type="submit"
                    className="btn"
                >
                    Reset Password
                </button>
            </form>
            {message && <p className="text-green-500 mt-2">{message}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
