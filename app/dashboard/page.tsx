"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecentChatsGrid } from "@/components/dashboard/RecentChatsGrid";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Filter } from "lucide-react";

export default function DashboardPage() {
    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                            <p className="text-muted-foreground">Manage your chats and organize knowledge</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2">
                                <FolderPlus className="h-4 w-4" />
                                New Folder
                            </Button>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20">
                                <Plus className="h-4 w-4" />
                                New Chat
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats / Filters Mock */}
                    <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-white hover:bg-white/10 transition-colors">
                            All Chats
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-transparent px-4 py-1.5 hover:bg-white/5 transition-colors">
                            Favorites
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-transparent px-4 py-1.5 hover:bg-white/5 transition-colors">
                            Archived
                        </button>
                        <div className="ml-auto">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Filter className="h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>

                    {/* Grid */}
                    <RecentChatsGrid />
                </div>
            </div>
        </AppLayout>
    );
}
