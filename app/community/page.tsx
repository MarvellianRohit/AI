"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ThumbsUp, Heart, Share2 } from "lucide-react";

const prompts = [
    { title: "React Expert", desc: "Act as a senior React developer...", tags: ["Coding", "React"], votes: 1240 },
    { title: "Story Writer", desc: "Write a compelling mystery novel...", tags: ["Creative", "Writing"], votes: 850 },
    { title: "Fitness Coach", desc: "Create a 30-day workout plan...", tags: ["Health", "Lifestyle"], votes: 620 },
    { title: "SEO Optimizer", desc: "Analyze this blog post for SEO...", tags: ["Marketing", "SEO"], votes: 540 },
    { title: "Math Tutor", desc: "Explain calculus concepts simply...", tags: ["Education", "Math"], votes: 430 },
    { title: "Email Drafter", desc: "Write a professional follow-up...", tags: ["Business", "Email"], votes: 310 },
];

export default function CommunityPage() {
    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">Prompt Library</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Discover and share powerful system prompts from the community. Vote for your favorites!
                        </p>
                        <div className="mt-8 relative max-w-xl mx-auto">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search prompts..."
                                className="pl-10 h-12 bg-white/5 border-white/10 rounded-full text-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prompts.map((prompt, i) => (
                            <div key={i} className="group relative rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-800/80 hover:shadow-xl hover:-translate-y-1">
                                <div className="mb-4 flex gap-2">
                                    {prompt.tags.map(tag => (
                                        <span key={tag} className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{prompt.title}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 bg-black/20 p-3 rounded-lg border border-white/5 font-mono">
                                    {prompt.desc}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <ThumbsUp className="h-4 w-4 text-green-400" />
                                        <span>{prompt.votes}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-400">
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-blue-400">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" className="h-8 bg-white/10 hover:bg-white/20">
                                            Try
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
