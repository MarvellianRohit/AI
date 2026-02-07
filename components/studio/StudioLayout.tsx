"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PreviewPanel } from "./PreviewPanel";
import { ChatInterface } from "../ChatInterface";
import { FileExplorer } from "./FileExplorer";

export function StudioLayout() {
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

    // We can use the imperative API, or just simple state for conditional rendering/size
    // For simplicity and robustness with state preservation, let's use the panel constraints.

    return (
        <div className="h-screen w-full bg-background overflow-hidden flex">
            <ResizablePanelGroup orientation="horizontal">
                {/* Far Left: File Explorer - Collapsible */}
                <ResizablePanel
                    defaultSize={15}
                    minSize={0}
                    maxSize={20}
                    collapsible={true}
                    className="hidden md:block min-w-[50px] border-r border-border/50 bg-secondary/10"
                >
                    <FileExplorer />
                </ResizablePanel>

                <ResizableHandle className="w-1 bg-border/20 hover:bg-primary/50 transition-colors" />

                {/* Center: Chat Interface */}
                <ResizablePanel defaultSize={35} minSize={25} className="min-w-[350px]">
                    <div className="h-full flex flex-col border-r border-border/50 relative">
                        {/* Header for Toggle (optional, or put in ChatInterface) */}
                        <div className="absolute top-4 right-4 z-20">
                            <button
                                onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
                                className="p-2 rounded-md bg-secondary/80 hover:bg-secondary text-xs flex items-center gap-2 border border-white/10"
                            >
                                {isPreviewCollapsed ? "Show Preview" : "Hide Preview"}
                            </button>
                        </div>
                        <ChatInterface isInStudio={true} onCodeGenerated={setGeneratedCode} />
                    </div>
                </ResizablePanel>

                {/* Right Panel: Studio Preview */}
                {!isPreviewCollapsed && (
                    <>
                        <ResizableHandle withHandle className="w-1 bg-border/20 hover:bg-primary/50 transition-colors" />
                        <ResizablePanel defaultSize={50} minSize={20}>
                            <div className="h-full bg-black/10">
                                <PreviewPanel code={generatedCode} />
                            </div>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
}
