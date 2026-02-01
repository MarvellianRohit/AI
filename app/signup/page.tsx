"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join the future of AI"
        >
            <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="John"
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Doe"
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="name@example.com"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="Create a password"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 overflow-hidden relative group"
                    disabled={loading}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? "Creating Account..." : "Sign Up"}
                        {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </span>
                    <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                    />
                </Button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#0f172a] px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-white">
                        <Github className="mr-2 h-4 w-4" /> Github
                    </Button>
                    <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-white">
                        <span className="mr-2 text-lg font-bold">G</span> Google
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
