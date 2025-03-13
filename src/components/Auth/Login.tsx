"use client"

import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../Loading";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../../../src/components/ui/card";
import { Label } from "../../../src/components/ui/label";
import { Input } from "../../../src/components/ui/input";
import { Button } from "../ui/Button";
import { Users, Sparkles, Rocket, Heart } from 'lucide-react';
import Gtihub from "../../../public/icons/Gtihub";
import Google from "../../../public/icons/Google";
import useAuth from "@/hooks/useAuth";

const Login = () => {
    const { loading, error, handleLogin, googleLogin } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin(formData);
    };

    return (
        <div className="min-h-screen flex">
            <ToastContainer />
            {loading && <Loading work="Logging in" />}

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleFormSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="text-right mt-2">
                                <Link
                                    href="/enter-email"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Button variant={"default"} type="submit">
                                Login
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={googleLogin}
                                className="hover:bg-yellow-50"
                            >
                                <Google />
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                disabled
                                className="hover:bg-yellow-50"
                            >
                                <Gtihub />
                                GitHub
                            </Button>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-primary underline-offset-4 transition-colors hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>

            <div className="hidden lg:flex w-1/2 bg-[#efbf04] items-center justify-center">
                <div className="max-w-md text-center p-8">
                    <div className="flex justify-center mb-6">
                        <Sparkles className="w-12 h-12" />
                    </div>

                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>

                    <p className="text-lg text-black/60 mb-8">
                        Sign in to access your account and continue your journey with us.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="flex flex-col items-center">
                            <Users className="w-8 h-8 mb-2" />
                            <span className="text-sm text-black/60">Connect</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Rocket className="w-8 h-8 mb-2" />
                            <span className="text-sm text-black/60">Explore</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Heart className="w-8 h-8 mb-2" />
                            <span className="text-sm text-black/60">Engage</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <p className="text-text-black/60 italic">
                            "Welcome back to your journey of growth and discovery"
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Login;