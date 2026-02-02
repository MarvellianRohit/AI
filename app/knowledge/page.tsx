"use client";

import React, { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, FileText, Image, Film, MoreHorizontal, Folder, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

interface UploadedFile {
    name: string;
    size: string;
    type: string;
    icon: string;
    color: string;
    timestamp: number;
}

function getFileIcon(type: string) {
    if (type.includes('pdf')) return { icon: FileText, color: 'text-red-400' };
    if (type.includes('image')) return { icon: Image, color: 'text-blue-400' };
    if (type.includes('video')) return { icon: Film, color: 'text-purple-400' };
    return { icon: Folder, color: 'text-yellow-400' };
}

export default function KnowledgePage() {
    const [files, setFiles] = useLocalStorage<UploadedFile[]>('knowledge_files', []);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (uploadedFiles: FileList | null) => {
        if (!uploadedFiles) return;

        const newFiles: UploadedFile[] = Array.from(uploadedFiles).map(file => {
            const { icon, color } = getFileIcon(file.type);
            return {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                type: file.type.split('/')[1].toUpperCase() || 'FILE',
                icon: icon.name,
                color,
                timestamp: Date.now()
            };
        });

        setFiles([...files, ...newFiles]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDeleteFile = (timestamp: number) => {
        setFiles(files.filter(f => f.timestamp !== timestamp));
    };

    const getIconComponent = (iconName: string) => {
        const icons: any = { FileText, Image, Film, Folder };
        return icons[iconName] || Folder;
    };

    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
                            <p className="text-muted-foreground">Upload and manage documents context</p>
                        </div>
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />
                    </div>

                    {/* Drag Drop Area */}
                    <div
                        className={`mb-10 flex h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${isDragging
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                            }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="rounded-full bg-white/5 p-4 mb-4">
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-white">Drag & Drop files here</h3>
                        <p className="text-sm text-muted-foreground mt-1">Supports PDF, TXT, MD, CSV (Max 50MB)</p>
                    </div>

                    {/* Files Grid */}
                    <h2 className="mb-4 text-lg font-semibold text-white">Recent Uploads ({files.length})</h2>
                    {files.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No files uploaded yet. Drag & drop or click the upload button above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {files.map((file, i) => {
                                const IconComp = getIconComponent(file.icon);
                                return (
                                    <Card key={file.timestamp} className="flex flex-col p-4 bg-slate-900/50 border-white/10 hover:border-primary/50 transition-colors group cursor-pointer backdrop-blur-md">
                                        <div className="mb-4 flex items-start justify-between">
                                            <IconComp className={`h-8 w-8 ${file.color}`} />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-400"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteFile(file.timestamp);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="mt-auto">
                                            <h4 className="font-medium text-gray-200 truncate">{file.name}</h4>
                                            <p className="text-xs text-muted-foreground">{file.size} • {file.type}</p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
