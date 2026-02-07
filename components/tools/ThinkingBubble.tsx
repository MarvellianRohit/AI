import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming standard utils

interface ThinkingBubbleProps {
    content: string;
    isThinking?: boolean;
}

export function ThinkingBubble({ content, isThinking = false }: ThinkingBubbleProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Don't render if empty
    if (!content && !isThinking) return null;

    return (
        <div className="w-full max-w-3xl mb-4 ml-10">
            <div
                className={cn(
                    "rounded-xl border overflow-hidden transition-all duration-300",
                    isThinking
                        ? "border-primary/20 bg-primary/5 shadow-[0_0_15px_-3px_rgba(var(--primary),0.1)]"
                        : "border-border/40 bg-muted/20"
                )}
            >
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-1.5 rounded-lg",
                            isThinking ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            <Brain className={cn("w-4 h-4", isThinking && "animate-pulse")} />
                        </div>
                        <span className={cn(
                            "text-sm font-medium",
                            isThinking ? "text-primary animate-pulse" : "text-muted-foreground"
                        )}>
                            {isThinking ? "Deep Thought in Progress..." : "Thought Process"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isThinking && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />}
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-4 pb-4 pt-0">
                                <div className="pl-11 pr-2">
                                    <div className="text-sm text-muted-foreground/80 font-mono leading-relaxed whitespace-pre-wrap border-l-2 border-primary/10 pl-4 py-1">
                                        {content}
                                        {isThinking && (
                                            <span className="inline-block w-1.5 h-4 ml-1 mb-[-2px] bg-primary/50 animate-pulse" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
