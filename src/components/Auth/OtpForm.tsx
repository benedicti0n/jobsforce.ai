"use client"

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AuthService from "@/services/AuthService";
import Cookies from "js-cookie";

const OtpForm = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { pageType } = useParams();

    const handleVerifyOtp = async () => {
        try {
            let response;
            if (pageType === "login") {
                response = await AuthService.loginWithOtp(otp);
            } else {
                response = await AuthService.verifyOtp(otp);
            }

            console.log("OTP verified successfully", response);

            // Store the token and user information in local storage
            if (response?.token) {
                Cookies.set("token", response.token);
                Cookies.set("userName", response.userName);
                Cookies.set("email", response.email);
            }

            router.push("/userDetails");
        } catch (error) {
            console.error("OTP verification failed", error);
            setError(error.message || "Verification failed");
        }
    };

    const handleResendOtp = async () => {
        try {
            await AuthService.resendOtp();
            console.log("OTP resend request successful");
        } catch (error) {
            console.error("Resending OTP failed", error);
            setError(error.message || "Resending OTP failed");
        }
    };

    // Prevent form submission on Enter key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission
        }
    };

    return (
        <div className="min-h-screen min-w-full">
            <div className="p-3">
                <button
                    onClick={() => router.push(`/${pageType}`)}
                    className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
                >
                    Back
                </button>
            </div>
            <div className="max-w-md mx-auto pt-20">
                <form className="bg-white shadow-md border rounded px-8 py-6">
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="otp"
                        >
                            OTP:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="otp"
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            onKeyDown={handleKeyDown} // Add this handler
                        />
                    </div>
                    {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleVerifyOtp}
                        >
                            Verify
                        </button>
                        <a
                            className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800"
                            href="#"
                            onClick={handleResendOtp}
                        >
                            Resend OTP
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OtpForm;
