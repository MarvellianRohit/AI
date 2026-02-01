"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const images = [
    "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1695653422287-c37cc4354ee2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1709664402636-6966f3531621?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop",
];

export default function GenerationPage() {
    return (
        <AppLayout>
            <div className="flex h-full flex-col bg-slate-950">

                {/* Gallery Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <h1 className="mb-2 text-3xl font-bold text-white">Image Generation</h1>
                    <p className="mb-8 text-muted-foreground">Create stunning visuals with AI</p>

                    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 space-y-4">
                        {images.map((src, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                            >
                                <img
                                    src={src}
                                    alt="AI Generated"
                                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 p-4">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white bg-white/20 hover:bg-white/30 rounded-full">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white bg-white/20 hover:bg-white/30 rounded-full">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Floating Input Bar */}
                <div className="border-t border-white/10 bg-slate-900/80 backdrop-blur-xl p-6">
                    <div className="mx-auto max-w-4xl flex gap-3">
                        <Input
                            placeholder="Describe the image you want to generate..."
                            className="h-12 border-white/10 bg-black/40 text-lg shadow-inner"
                        />
                        <Button className="h-12 px-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20 font-semibold gap-2">
                            <Sparkles className="h-5 w-5" /> Generate
                        </Button>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
