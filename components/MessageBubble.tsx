import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Bot, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBubbleProps {
    role: "user" | "model";
    content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
    const isUser = role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex w-full items-start gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-secondary"
                )}
            >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
                className={cn(
                    "relative max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md overflow-hidden",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "glass text-foreground rounded-tl-none border border-border/50"
                )}
            >
                <div className="prose prose-invert max-w-none text-sm leading-relaxed break-words">
                    <ReactMarkdown
                        components={{
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '')
                                const [copied, setCopied] = React.useState(false);

                                const handleCopy = () => {
                                    if (!children) return;
                                    navigator.clipboard.writeText(String(children));
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }

                                // Inline code
                                if (inline) {
                                    return <code className="bg-white/10 rounded px-1 py-0.5" {...props}>{children}</code>
                                }

                                return !inline && match ? (
                                    <div className="relative my-4 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e]">
                                        <div className="flex items-center justify-between bg-white/5 px-4 py-2">
                                            <span className="text-xs text-muted-foreground">{match[1]}</span>
                                            <button
                                                onClick={handleCopy}
                                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
                                            >
                                                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                {copied ? "Copied" : "Copy"}
                                            </button>
                                        </div>
                                        <SyntaxHighlighter
                                            {...props}
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
}
