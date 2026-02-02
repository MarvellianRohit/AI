"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, MoreVertical, Pin, Clock } from "lucide-react";

const recentChats = [
    { id: 1, title: "React Architecture Plan", date: "2 mins ago", preview: "Let's discuss the folder structure...", pinned: true, type: 'favorites' as const, color: "from-blue-500/20 to-cyan-500/20" },
    { id: 2, title: "Python Data Analysis", date: "4 hours ago", preview: "Import pandas as pd...", pinned: true, type: 'favorites' as const, color: "from-purple-500/20 to-pink-500/20" },
    { id: 3, title: "Email Drafts", date: "Yesterday", preview: "Subject: Project update...", pinned: false, type: 'all' as const, color: "from-green-500/20 to-emerald-500/20" },
    { id: 4, title: "Debugging Login", date: "2 days ago", preview: "Error: 500 Internal Server Error...", pinned: false, type: 'all' as const, color: "from-orange-500/20 to-red-500/20" },
    { id: 5, title: "Marketing Ideas", date: "Last Week", preview: "1. Social Media Campaign...", pinned: false, type: 'archived' as const, color: "from-indigo-500/20 to-violet-500/20" },
    { id: 6, title: "Recipe: Lasagna", date: "Last Week", preview: "Ingredients needed: ...", pinned: false, type: 'all' as const, color: "from-gray-500/20 to-slate-500/20" },
];

type FilterType = 'all' | 'favorites' | 'archived';

interface RecentChatsGridProps {
    filter: FilterType;
}

export function RecentChatsGrid({ filter }: RecentChatsGridProps) {
    const filteredChats = filter === 'all'
        ? recentChats.filter(chat => chat.type === 'all' || chat.type === 'favorites')
        : recentChats.filter(chat => chat.type === filter);

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredChats.map((chat, index) => (
                <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-primary/5"
                >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${chat.color} opacity-0 transition-opacity group-hover:opacity-100`} />

                    <div className="relative p-5">
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            {chat.pinned && <Pin className="h-4 w-4 rotate-45 text-primary" />}
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-white line-clamp-1">{chat.title}</h3>
                        <p className="mb-4 text-sm text-gray-400 line-clamp-2">{chat.preview}</p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-white/5 pt-4">
                            <Clock className="h-3 w-3" />
                            <span>{chat.date}</span>
                        </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="rounded-full p-1 hover:bg-white/20">
                            <MoreVertical className="h-4 w-4 text-white" />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
