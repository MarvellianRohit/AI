"use client";

import { ChatInterface } from "@/components/ChatInterface";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <div className="flex h-full flex-col items-center bg-gradient-to-b from-background to-background/50 text-foreground relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 opacity-30 pointer-events-none" />

        <ChatInterface />
      </div>
    </AppLayout>
  );
}
