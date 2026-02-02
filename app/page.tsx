"use client";

import { ChatInterface } from "@/components/ChatInterface";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <div className="flex-1 flex overflow-hidden relative">
        {/* Background decorations - fixed positioning to not affect layout */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 opacity-50 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 opacity-30 pointer-events-none" />

        <ChatInterface />
      </div>
    </AppLayout>
  );
}
