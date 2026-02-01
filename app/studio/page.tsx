"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sliders, Save, Play, RefreshCw } from "lucide-react";

export default function AIStudioPage() {
    return (
        <AppLayout>
            <div className="flex h-full w-full bg-slate-950 p-4 gap-4">
                {/* Left Panel: Configuration */}
                <Card className="w-[350px] flex-shrink-0 flex flex-col gap-6 p-6 border-white/10 bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        <Sliders className="h-5 w-5 text-purple-400" />
                        <h2 className="font-semibold text-white">Model Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400">Model</label>
                            <select className="w-full rounded-md border border-white/10 bg-black/20 p-2 text-sm text-white">
                                <option>Gemini Pro</option>
                                <option>Gemini Ultra</option>
                                <option>GPT-4o (Mock)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400">Temperature (0.7)</label>
                            <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400">Max Tokens (2048)</label>
                            <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400">System Prompt</label>
                            <textarea
                                className="w-full h-32 rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                placeholder="You are a helpful assistant..."
                            />
                        </div>
                    </div>

                    <div className="mt-auto flex gap-2">
                        <Button className="flex-1 bg-white/5 hover:bg-white/10">
                            <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                        <Button className="flex-1 bg-white/5 hover:bg-white/10">
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                    </div>
                </Card>

                {/* Right Panel: Preview Area */}
                <div className="flex-1 flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col p-6 border-white/10 bg-slate-900/50 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                            <h2 className="font-semibold text-white">Playground Preview</h2>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <Play className="mr-2 h-4 w-4" /> Run Test
                            </Button>
                        </div>

                        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-lg bg-black/20 text-muted-foreground">
                            Prompt output will appear here...
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Input
                                placeholder="Enter a test user message..."
                                className="bg-black/20 border-white/10"
                            />
                            <Button>Send</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
