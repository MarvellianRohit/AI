"use client";
// Force TS update


import { Sandpack, SandpackFiles } from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useArtifactStore } from "@/lib/hooks/useArtifactStore";
import { Slider } from "@/components/ui/slider";
import { Copy, RotateCcw, Clock } from "lucide-react";

interface PreviewPanelProps {
    code: string | null;
}

export function PreviewPanel({ code }: PreviewPanelProps) {
    const { versions, currentIndex, currentVersion, addVersion, goToVersion } = useArtifactStore();
    const [renderedContent, setRenderedContent] = useState("");
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize Web Worker
        workerRef.current = new Worker("/workers/artifactWorker.js");
        workerRef.current.onmessage = (e) => {
            if (e.data.type === "rendered") {
                setRenderedContent(e.data.content);
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    useEffect(() => {
        if (code) {
            addVersion(code);
        }
    }, [code, addVersion]);

    useEffect(() => {
        if (currentVersion && workerRef.current) {
            workerRef.current.postMessage({
                type: "process",
                code: currentVersion.code
            });
        }
    }, [currentVersion]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex flex-col bg-zinc-950"
        >
            <div className="flex-none h-14 border-b border-white/5 flex items-center px-4 justify-between bg-zinc-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <h2 className="font-medium text-xs uppercase tracking-widest text-zinc-400">
                        Live Artifact Mode
                    </h2>
                </div>

                {versions.length > 1 && (
                    <div className="flex items-center gap-4 flex-1 max-w-xs px-8">
                        <Clock className="h-3 w-3 text-zinc-500" />
                        <Slider
                            value={[currentIndex]}
                            max={versions.length - 1}
                            step={1}
                            onValueChange={([val]: number[]) => goToVersion(val)}
                            className="w-full"
                        />
                        <span className="text-[10px] text-zinc-500 font-mono w-8 text-right">
                            V{currentIndex + 1}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-zinc-400">
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-zinc-400">
                        <Copy className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative">
                <iframe
                    srcDoc={renderedContent}
                    className="w-full h-full border-none bg-white"
                    title="Live Artifact Preview"
                    sandbox="allow-scripts allow-modals"
                />
            </div>
        </motion.div>
    );
}
