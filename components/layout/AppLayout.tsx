"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "@/components/command/CommandPalette";

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}

                {/* Cmd+K Palette (Always available) */}
                <CommandPalette />
            </main>
        </div>
    );
}
