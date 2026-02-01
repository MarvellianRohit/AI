"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Palette, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-8 text-3xl font-bold text-white">Settings</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                        {/* Sidebar */}
                        <div className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start bg-white/10 text-white">
                                <User className="mr-2 h-4 w-4" /> Profile
                            </Button>
                            <Button variant="ghost" className="w-full justify-start hover:bg-white/5 text-muted-foreground">
                                <Bell className="mr-2 h-4 w-4" /> Notifications
                            </Button>
                            <Button variant="ghost" className="w-full justify-start hover:bg-white/5 text-muted-foreground">
                                <Palette className="mr-2 h-4 w-4" /> Appearance
                            </Button>
                            <Button variant="ghost" className="w-full justify-start hover:bg-white/5 text-muted-foreground">
                                <Shield className="mr-2 h-4 w-4" /> Security
                            </Button>
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" /> Log out
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {/* Profile Section */}
                            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
                                <h2 className="text-xl font-semibold text-white mb-4">Public Profile</h2>
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
                                        JD
                                    </div>
                                    <div>
                                        <Button variant="outline" className="border-white/10 hover:bg-white/5">Change Avatar</Button>
                                        <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max 1MB.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Display Name</label>
                                        <Input defaultValue="John Doe" className="bg-black/20 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email</label>
                                        <Input defaultValue="john@example.com" className="bg-black/20 border-white/10" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Bio</label>
                                        <textarea className="w-full rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white focus:outline-none h-24" defaultValue="AI enthusiast and developer." />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button>Save Changes</Button>
                                </div>
                            </div>

                            {/* Appearance Section Mock */}
                            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
                                <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
                                <div className="flex gap-4">
                                    <div className="h-24 w-1/3 rounded-lg border-2 border-primary bg-slate-950 p-2 cursor-pointer">
                                        <div className="h-full w-full rounded bg-slate-800" />
                                        <p className="text-center text-xs mt-2 text-primary font-medium">Dark System</p>
                                    </div>
                                    <div className="h-24 w-1/3 rounded-lg border border-white/10 bg-white p-2 cursor-pointer opacity-50">
                                        <div className="h-full w-full rounded bg-gray-100" />
                                        <p className="text-center text-xs mt-2 text-gray-400">Light Mode</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
