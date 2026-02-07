"use client";
// Force TS update


import { Sandpack, SandpackFiles } from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PreviewPanelProps {
    code: string | null;
}

export function PreviewPanel({ code }: PreviewPanelProps) {
    const { theme } = useTheme(); // For future syncing with app theme

    // Default template
    const defaultCode = `import React from 'react';
        
export default function App() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      textAlign: 'center', 
      padding: '40px',
      background: 'linear-gradient(to bottom right, #e0f2fe, #f0fdf4)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundImage: 'linear-gradient(to right, #2563eb, #16a34a)' }}>
        Hello Studio
      </h1>
      <p style={{ color: '#4b5563', fontSize: '1.25rem', marginTop: '1rem' }}>
        Start building with the AI to see your changes here instantly.
      </p>
    </div>
  );
}`;

    const [files, setFiles] = useState<SandpackFiles>({
        "App.js": defaultCode,
    });

    // Update files when code changes
    useEffect(() => {
        if (code) {
            setFiles({
                "App.js": code,
            });
        }
    }, [code]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex flex-col"
        >
            <div className="flex-none h-12 border-b border-border/50 flex items-center px-4 justify-between bg-card/50 backdrop-blur-sm">
                <h2 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Live Preview
                </h2>
                <div className="text-xs text-muted-foreground">
                    Powered by Sandpack
                </div>
            </div>
            <div className="flex-1 overflow-hidden sandbox-container">
                <Sandpack
                    template="react"
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    files={files}
                    options={{
                        showNavigator: true,
                        showTabs: true,
                        externalResources: ["https://cdn.tailwindcss.com"],
                        classes: {
                            "sp-wrapper": "h-full",
                            "sp-layout": "h-full rounded-none border-none",
                            "sp-stack": "h-full",
                        }
                    }}
                />
            </div>
        </motion.div>
    );
}
