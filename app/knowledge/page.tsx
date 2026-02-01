"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, FileText, Image, Film, MoreHorizontal } from "lucide-react";

const files = [
    { name: "Q3_Report.pdf", size: "2.4 MB", type: "PDF", icon: FileText, color: "text-red-400" },
    { name: "Project_Assets.zip", size: "156 MB", type: "ZIP", icon: Folder, color: "text-yellow-400" },
    { name: "Hero_Image.png", size: "4.1 MB", type: "PNG", icon: Image, color: "text-blue-400" },
    { name: "Demo_Video.mp4", size: "24 MB", type: "MP4", icon: Film, color: "text-purple-400" },
];
import { Folder } from "lucide-react";

export default function KnowledgePage() {
    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
                            <p className="text-muted-foreground">Upload and manage documents context</p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                            <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
                        </Button>
                    </div>

                    {/* Drag Drop Area */}
                    <div className="mb-10 flex h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                        <div className="rounded-full bg-white/5 p-4 mb-4">
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-white">Drag & Drop files here</h3>
                        <p className="text-sm text-muted-foreground mt-1">Supports PDF, TXT, MD, CSV (Max 50MB)</p>
                    </div>

                    {/* Files Grid */}
                    <h2 className="mb-4 text-lg font-semibold text-white">Recent Uploads</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {files.map((file, i) => (
                            <Card key={i} className="flex flex-col p-4 bg-slate-900/50 border-white/10 hover:border-primary/50 transition-colors group cursor-pointer backdrop-blur-md">
                                <div className="mb-4 flex items-start justify-between">
                                    <file.icon className={`h-8 w-8 ${file.color}`} />
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="mt-auto">
                                    <h4 className="font-medium text-gray-200 truncate">{file.name}</h4>
                                    <p className="text-xs text-muted-foreground">{file.size} • {file.type}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
