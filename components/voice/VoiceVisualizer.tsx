"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, X, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VoiceVisualizer() {
    const [isListening, setIsListening] = useState(true);
    const bars = 12;

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-black/90 text-white">
            {/* Visualizer Area */}
            <div className="relative flex h-64 w-full items-center justify-center gap-2">
                {Array.from({ length: bars }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-4 rounded-full bg-gradient-to-t from-blue-500 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                        animate={{
                            height: isListening ? [20, Math.random() * 100 + 40, 20] : 10,
                            opacity: isListening ? 1 : 0.3,
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: i * 0.1,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="mt-8 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Listening...</h2>
                <p className="text-muted-foreground">Go ahead, I'm all ears.</p>
            </div>

            {/* Controls */}
            <div className="mt-16 flex items-center gap-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={() => setIsListening(!isListening)}
                >
                    {isListening ? (
                        <Mic className="h-6 w-6 text-white" />
                    ) : (
                        <MicOff className="h-6 w-6 text-red-400" />
                    )}
                </Button>

                <Button
                    variant="destructive"
                    size="icon"
                    className="h-16 w-16 rounded-full shadow-lg shadow-red-500/20"
                >
                    <PhoneOff className="h-8 w-8" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-white/10"
                >
                    <X className="h-6 w-6 scale-150 rotate-45" />
                </Button>
            </div>
        </div>
    );
}
