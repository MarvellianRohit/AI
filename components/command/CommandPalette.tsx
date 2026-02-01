"use client";

import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    Command,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-50 w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="flex items-center border-b border-white/10 px-4">
                            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-white" />
                            <input
                                className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground text-white disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Type a command or search..."
                                autoFocus
                            />
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">ESC</span>
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                            <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Suggestions</div>

                            <CommandItem icon={Calendar} label="Calendar" shortcut="C" />
                            <CommandItem icon={Smile} label="Search Emoji" shortcut="⌘ E" />
                            <CommandItem icon={Calculator} label="Calculator" />

                            <div className="mb-2 mt-4 px-2 text-xs font-semibold text-muted-foreground">Settings</div>

                            <CommandItem icon={User} label="Profile" shortcut="⌘ P" />
                            <CommandItem icon={CreditCard} label="Billing" shortcut="⌘ B" />
                            <CommandItem icon={Settings} label="Settings" shortcut="⌘ S" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function CommandItem({ icon: Icon, label, shortcut }: { icon: any, label: string, shortcut?: string }) {
    return (
        <button className="flex w-full items-center justify-between rounded-md px-2 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors group">
            <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            {shortcut && (
                <span className="text-xs text-muted-foreground group-hover:text-gray-300">{shortcut}</span>
            )}
        </button>
    )
}
