"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Play, X, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
const theme = "dark";

interface ArtifactVersion {
    id: string;
    content: string;
    timestamp: number;
}

interface Artifact {
    id: string;
    title: string;
    content: string;
    language: string;
    versions: ArtifactVersion[];
}

interface ArtifactPanelProps {
    artifact: Artifact | null;
    onClose: () => void;
}

export const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ artifact, onClose }) => {
    const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

    useEffect(() => {
        if (artifact?.versions) {
            setCurrentVersionIndex(artifact.versions.length - 1);
        }
    }, [artifact]);

    if (!artifact) return null;

    const currentVersion = artifact.versions[currentVersionIndex] || { content: artifact.content };

    const handleCopy = () => {
        navigator.clipboard.writeText(currentVersion.content);
    };

    return (
        <div className="flex h-full flex-col bg-card border-l border-border shadow-2xl transition-all duration-300 animate-in slide-in-from-right overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold truncate capitalize">{artifact.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <History size={12} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Version {currentVersionIndex + 1} of {artifact.versions.length}</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Version Slider */}
            {artifact.versions.length > 1 && (
                <div className="px-4 py-2 border-b border-border flex items-center gap-4 bg-muted/10">
                    <button
                        disabled={currentVersionIndex === 0}
                        onClick={() => setCurrentVersionIndex(prev => prev - 1)}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <input
                        type="range"
                        min="0"
                        max={artifact.versions.length - 1}
                        value={currentVersionIndex}
                        onChange={(e) => setCurrentVersionIndex(parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <button
                        disabled={currentVersionIndex === artifact.versions.length - 1}
                        onClick={() => setCurrentVersionIndex(prev => prev + 1)}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Content / Preview */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <SandpackProvider
                    theme={theme}
                    template="react"
                    files={{
                        "/App.js": currentVersion.content,
                        "/styles.css": {
                            code: `
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
                            hidden: true
                        }
                    }}
                    customSetup={{
                        dependencies: {
                            "lucide-react": "^0.263.1",
                            "framer-motion": "^10.12.16",
                            "clsx": "^1.2.1",
                            "tailwind-merge": "^1.13.2"
                        }
                    }}
                    options={{
                        classes: {
                            "sp-wrapper": "h-full flex-1",
                            "sp-layout": "h-full border-none",
                        },
                        externalResources: ["https://cdn.tailwindcss.com"]
                    }}
                >
                    <SandpackLayout>
                        <div className="flex flex-col h-full w-full">
                            <div className="h-1/2 overflow-auto border-b border-border">
                                <SandpackCodeEditor
                                    showLineNumbers
                                    showTabs={false}
                                />
                            </div>
                            <div className="h-1/2 bg-white relative">
                                <SandpackPreview showOpenInCodeSandbox={false} />
                                <div className="absolute top-2 right-2 z-10">
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 bg-black/50 backdrop-blur rounded-md text-white hover:bg-black/70 transition-colors"
                                        title="Copy Code"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SandpackLayout>
                </SandpackProvider>
            </div>
        </div>
    );
};
