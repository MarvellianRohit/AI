"use client";

import React from 'react';
import { X, RefreshCw, ExternalLink } from 'lucide-react';

interface WorkbenchPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WorkbenchPanel: React.FC<WorkbenchPanelProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="flex h-full flex-col bg-background border-l border-border shadow-2xl transition-all duration-300 animate-in slide-in-from-right overflow-hidden w-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-lg font-semibold">Generative UI Workbench</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground"
                        title="Reload"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Iframe Viewport */}
            <div className="flex-1 bg-muted/5 relative group">
                <iframe
                    src="http://localhost:3000"
                    className="w-full h-full border-none"
                    title="Vite Preview"
                />

                {/* Overlay Controls */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                        href="http://localhost:3000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full shadow-lg text-xs font-medium hover:bg-muted transition-colors"
                    >
                        <ExternalLink size={12} />
                        Open in Browser
                    </a>
                </div>
            </div>

            {/* Status Footer */}
            <div className="p-3 border-t border-border bg-muted/30 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                <span>Model: Gemma-2-9B (FP16)</span>
                <span>Latency: ~280ms</span>
            </div>
        </div>
    );
};
