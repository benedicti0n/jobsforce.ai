"use client"

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Users, Sparkles, Rocket, Heart } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Google from "../../../public/icons/Google";
import Gtihub from "../../../public/icons/Gtihub";
import useAuth from "@/hooks/useAuth";

const SignUp = () => {
    const router = useRouter()
    const { loading, error, handleSignUp, googleLogin } = useAuth();
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSignUp(formData);
    };

    return (
        <div className="min-h-screen flex">
            <ToastContainer />
            {loading && <Loading work="Signing Up" />}


            <div className="hidden lg:flex w-1/2 bg-[#efbf04] items-center justify-center">
                <div className="max-w-md text-center p-8">
                    <div className="flex justify-center mb-6">
                        <Sparkles className="w-12 h-12 text-black" />
                    </div>

                    <h1 className="text-4xl font-bold mb-6">Welcome to Our Platform</h1>

                    <p className="text-lg text-black/60 mb-8">
                        Join our community and discover amazing features and opportunities.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-8 text-black">
                        <div className="flex flex-col items-center">
                            <Users className="w-8 h-8 mb-2" />
                            <span className="text-sm text-black/60">Connect</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Rocket className="w-8 h-8 mb-2" />
                            <span className="text-sm text-black/60">Grow</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Heart className="w-8 h-8 mb-2" />
                            <span className="text-sm text-black/60">Thrive</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <p className="text-black italic">
                            "Join thousands of users who have already transformed their experience with our platform"
                        </p>
                    </div>
                </div>
            </div>


            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
                        <CardDescription className="text-center">Create your account to get started</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleFormSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="userName">Username</Label>
                                <Input
                                    id="userName"
                                    name="userName"
                                    placeholder="Enter your username"
                                    required
                                    value={formData.userName}
                                    onChange={handleChange}
                                />
                            </div>
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
                                    placeholder="Create a password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black"
                            >
                                Sign Up
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
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
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary underline-offset-4 transition-colors hover:underline"
                            >
                                Log In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SignUp;