"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Paperclip, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageBubble } from "@/components/MessageBubble";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "model";
    content: string;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const clearFile = () => setSelectedFile(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !selectedFile) || isLoading) return;

        let userContent = input;
        if (selectedFile) {
            userContent += `\n\n[Attached File: ${selectedFile.name}]`;
        }

        const userMessage = { role: "user" as const, content: userContent };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setSelectedFile(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) throw new Error("Failed to send message");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMessage = { role: "model" as const, content: "" };

            setMessages((prev) => [...prev, aiMessage]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = new TextDecoder().decode(value);
                aiMessage = { ...aiMessage, content: aiMessage.content + text };

                // Update the last message
                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { ...aiMessage },
                ]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex flex-col w-full h-full max-w-5xl mx-auto"
            onDragEnter={handleDrag}
        >
            {/* Full Screen Drag Overlay */}
            <AnimatePresence>
                {dragActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm border-2 border-dashed border-primary m-4 rounded-xl max-w-5xl mx-auto"
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="bg-background/80 p-6 rounded-xl text-center pointer-events-none">
                            <Paperclip className="h-12 w-12 mx-auto mb-2 text-primary" />
                            <h3 className="text-xl font-bold">Drop files here to attach</h3>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Area - Scrollable container that fills space above input */}
            <div className="h-full overflow-y-auto p-4 pb-32 space-y-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center opacity-70 min-h-[calc(100vh-200px)]"
                        >
                            <div className="mb-6 rounded-full bg-primary/10 p-6 ring-1 ring-primary/20">
                                <Sparkles className="h-12 w-12 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">How can I help you today?</h2>
                            <p className="mt-2 text-muted-foreground">
                                Ask me anything regarding coding, writing, or analysis.
                            </p>
                        </motion.div>
                    ) : (
                        messages.map((msg, index) => (
                            <MessageBubble key={index} role={msg.role} content={msg.content} />
                        ))
                    )}
                </AnimatePresence>
                {isLoading && messages[messages.length - 1]?.role !== "model" && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm ml-2">
                        <span className="animate-pulse">Thinking...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - FIXED to viewport bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/80 backdrop-blur-md z-10 max-w-5xl mx-auto">
                {/* File Preview */}
                <AnimatePresence>
                    {selectedFile && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            className="mb-3 flex items-center gap-2"
                        >
                            <div className="relative group">
                                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
                                    <ImageIcon className="h-4 w-4 text-blue-400" />
                                    <span className="max-w-[200px] truncate">{selectedFile.name}</span>
                                    <span className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button
                                    onClick={clearFile}
                                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                            if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                        }}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>

                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="pl-12 pr-12 py-6 text-base rounded-full bg-secondary/50 border-white/5 focus-visible:ring-primary/50"
                        disabled={isLoading}
                        autoFocus
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || (!input.trim() && !selectedFile)}
                        className="absolute right-1.5 rounded-full h-9 w-9 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
                <div className="mt-2 text-center text-xs text-muted-foreground">
                    AI may display inaccurate info, please double check.
                </div>
            </div>
        </div >
    );
}
