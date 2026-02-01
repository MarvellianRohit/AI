"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";

export default function BillingPage() {
    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-6xl text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-muted-foreground mb-12">Choose the plan that's right for you</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Free Tier */}
                        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 flex flex-col items-center">
                            <h3 className="text-lg font-medium text-gray-300">Starter</h3>
                            <div className="my-6">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <ul className="space-y-4 text-sm text-left w-full mb-8 flex-1">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> 100 Completions/mo</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Basic Models</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Community Access</li>
                            </ul>
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Current Plan</Button>
                        </div>

                        {/* Pro Tier */}
                        <div className="relative rounded-2xl border border-purple-500 bg-slate-900/80 p-8 flex flex-col items-center shadow-2xl shadow-purple-500/20 transform md:-translate-y-4">
                            <div className="absolute top-0 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 rounded-full text-xs font-bold text-white">MOST POPULAR</div>
                            <h3 className="text-lg font-medium text-white">Pro</h3>
                            <div className="my-6">
                                <span className="text-4xl font-bold text-white">$29</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <ul className="space-y-4 text-sm text-left w-full mb-8 flex-1">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Unlimited Completions</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> GPT-4 & Gemini Ultra</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Image Generation (DALL-E 3)</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Priority Support</li>
                            </ul>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Upgrade Now</Button>
                        </div>

                        {/* Team Tier */}
                        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 flex flex-col items-center">
                            <h3 className="text-lg font-medium text-gray-300">Team</h3>
                            <div className="my-6">
                                <span className="text-4xl font-bold text-white">$99</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <ul className="space-y-4 text-sm text-left w-full mb-8 flex-1">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> 5 Team Members</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Centralized Billing</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> SSO Integration</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Analytics Dashboard</li>
                            </ul>
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Contact Sales</Button>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-10">
                        <h3 className="text-lg font-medium text-white mb-6">Payment Methods</h3>
                        <div className="flex items-center justify-between max-w-2xl mx-auto rounded-lg border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-16 bg-white rounded flex items-center justify-center">
                                    <span className="text-blue-800 font-bold italic">VISA</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-medium">Visa ending in 4242</p>
                                    <p className="text-xs text-muted-foreground">Expiry 12/28</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
