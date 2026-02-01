"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Zap, Clock } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mb-8 text-3xl font-bold text-white">Analytics Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatsCard title="Total Tokens" value="1.2M" change="+12.5%" icon={Zap} color="text-yellow-400" />
                        <StatsCard title="Active Users" value="2,543" change="+4.3%" icon={Users} color="text-blue-400" />
                        <StatsCard title="Avg. Response" value="1.2s" change="-0.3s" icon={Clock} color="text-green-400" />
                        <StatsCard title="Chats Created" value="845" change="+8.1%" icon={TrendingUp} color="text-purple-400" />
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-white mb-6">Usage Over Time</h3>
                            <div className="h-64 w-full flex items-end justify-between gap-2 px-2">
                                {/* Fake Bar Chart */}
                                {[40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 50, 75].map((h, i) => (
                                    <div key={i} className="w-full bg-blue-500/20 rounded-t-sm hover:bg-blue-500/40 transition-colors relative group">
                                        <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>Jan</span>
                                <span>Jun</span>
                                <span>Dec</span>
                            </div>
                        </Card>

                        <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-white mb-6">Cost Estimation</h3>
                            <div className="h-64 flex items-center justify-center relative">
                                {/* Fake Donut Chart */}
                                <div className="h-40 w-40 rounded-full border-[16px] border-purple-500/20 border-t-purple-500 border-r-blue-500 rotate-45" />
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-bold text-white">$42.50</span>
                                    <span className="text-xs text-muted-foreground">This Month</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                                    <span className="text-sm text-gray-400">GPT-4</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                    <span className="text-sm text-gray-400">Gemini Pro</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatsCard({ title, value, change, icon: Icon, color }: any) {
    return (
        <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h4 className="text-2xl font-bold text-white mt-2">{value}</h4>
                </div>
                <div className={`rounded-full p-2 bg-white/5 ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
                <span className="text-green-400 font-medium">{change}</span>
                <span className="text-muted-foreground ml-2">from last month</span>
            </div>
        </Card>
    )
}
