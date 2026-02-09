"use client";
// Force TS update


import { Sandpack, SandpackFiles } from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PreviewPanelProps {
    code: string | null;
}

export function PreviewPanel({ code }: PreviewPanelProps) {
    const [canvasUrl, setCanvasUrl] = useState("http://localhost:5175");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex flex-col"
        >
            <div className="flex-none h-12 border-b border-border/50 flex items-center px-4 justify-between bg-card/50 backdrop-blur-sm">
                <h2 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Nexus Canvas
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        HMR ACTIVE
                    </span>
                    <div className="text-xs text-muted-foreground">
                        Local Vite Sandbox
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-hidden bg-zinc-950">
                <iframe
                    src={canvasUrl}
                    className="w-full h-full border-none"
                    title="Generative Preview"
                />
            </div>
        </motion.div>
    );
}
