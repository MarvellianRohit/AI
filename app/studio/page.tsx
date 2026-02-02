"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sliders, Save, Play, RefreshCw, Check } from "lucide-react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

interface ModelConfig {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
}

export default function AIStudioPage() {
    const [config, setConfig] = useLocalStorage<ModelConfig>('studio_config', {
        model: 'gemini-2.5-pro',
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: 'You are a helpful assistant...'
    });

    const [testInput, setTestInput] = useState('');
    const [testOutput, setTestOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Config is auto-saved via useLocalStorage
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setConfig({
            model: 'gemini-2.5-flash',
            temperature: 0.7,
            maxTokens: 2048,
            systemPrompt: 'You are a helpful assistant...'
        });
    };

    const handleRunTest = async () => {
        if (!testInput.trim()) return;

        setIsRunning(true);
        setTestOutput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: config.systemPrompt },
                        { role: 'user', content: testInput }
                    ]
                })
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let output = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    output += decoder.decode(value);
                    setTestOutput(output);
                }
            }
        } catch (error) {
            setTestOutput('Error: Failed to run test');
        } finally {
            setIsRunning(false);
        }
    };

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
                            <select
                                className="w-full rounded-md border border-white/10 bg-black/20 p-2 text-sm text-white"
                                value={config.model}
                                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                            >
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                <option value="gpt-4o">GPT-4o (Mock)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400">
                                Temperature ({config.temperature.toFixed(2)})
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={config.temperature}
                                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400">
                                Max Tokens ({config.maxTokens})
                            </label>
                            <input
                                type="range"
                                min="256"
                                max="8192"
                                step="256"
                                value={config.maxTokens}
                                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400">System Prompt</label>
                            <textarea
                                className="w-full h-32 rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                placeholder="You are a helpful assistant..."
                                value={config.systemPrompt}
                                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mt-auto flex gap-2">
                        <Button
                            className="flex-1 bg-white/5 hover:bg-white/10"
                            onClick={handleSave}
                        >
                            {saved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            {saved ? 'Saved!' : 'Save'}
                        </Button>
                        <Button
                            className="flex-1 bg-white/5 hover:bg-white/10"
                            onClick={handleReset}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                    </div>
                </Card>

                {/* Right Panel: Preview Area */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <Card className="flex-1 flex flex-col p-6 border-white/10 bg-slate-900/50 backdrop-blur-xl mb-4 min-h-0">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                            <h2 className="font-semibold text-white">Playground Preview</h2>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleRunTest}
                                disabled={isRunning || !testInput.trim()}
                            >
                                <Play className="mr-2 h-4 w-4" />
                                {isRunning ? 'Running...' : 'Run Test'}
                            </Button>
                        </div>

                        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
                            {testOutput ? (
                                <div className="flex-1 overflow-y-auto border border-white/10 rounded-lg bg-black/20 p-4 text-white text-sm whitespace-pre-wrap">
                                    {testOutput}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-lg bg-black/20 text-muted-foreground">
                                    Prompt output will appear here...
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex gap-2 flex-shrink-0">
                            <Input
                                placeholder="Enter a test user message..."
                                className="bg-black/20 border-white/10"
                                value={testInput}
                                onChange={(e) => setTestInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRunTest()}
                            />
                            <Button onClick={handleRunTest} disabled={isRunning || !testInput.trim()}>
                                Send
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
