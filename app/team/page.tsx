"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, Mail } from "lucide-react";

export default function TeamPage() {
    const members = [
        { name: "John Doe", email: "john@nexus.com", role: "Owner", avatar: "JD" },
        { name: "Sarah Smith", email: "sarah@nexus.com", role: "Admin", avatar: "SS" },
        { name: "Mike Johnson", email: "mike@nexus.com", role: "Editor", avatar: "MJ" },
        { name: "Emily Brown", email: "emily@nexus.com", role: "Viewer", avatar: "EB" },
    ];

    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Team Management</h1>
                            <p className="text-muted-foreground">Manage access and roles for your workspace.</p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                            <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                        </Button>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-medium text-white">Active Members (4)</h3>
                            <div className="relative">
                                <SearchInput />
                            </div>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-white/5">
                            {members.map((member, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white">
                                            {member.role}
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Invite via Link</h3>
                            <p className="text-sm text-gray-300">Share this link to let people join your team automatically.</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <Input className="bg-black/20 border-white/10 min-w-[300px]" readOnly value="https://nexus.ai/team/invite/8a9f7d..." />
                            <Button variant="secondary">Copy</Button>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

function SearchInput() {
    return <Input placeholder="Search..." className="h-9 w-64 bg-black/20 border-white/10" />
}
