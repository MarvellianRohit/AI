"use client";

import { useEffect, useState } from "react";
import { Folder, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
    name: string;
    type: "file" | "directory";
    path: string;
    children?: FileNode[];
}

export function FileExplorer() {
    const [files, setFiles] = useState<FileNode[]>([]);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchFiles(".");
    }, []);

    const fetchFiles = async (path: string) => {
        try {
            const res = await fetch(`/api/files?path=${path || '.'}`);
            const data = await res.json();
            if (data.files) {
                setFiles(prev => {
                    // Simple logic: if root, replace. If subdir, find parent and append children
                    // For this MVP, let's just show top level for simplicity, 
                    // implementing full recursive tree update state is complex for a one-shot.
                    // Let's assume flatness for the first level demo.
                    return data.files;
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
            // In a real app, we'd fetch subfiles here
        }
        setExpanded(newExpanded);
    };

    return (
        <div className="p-2 text-sm text-muted-foreground">
            <h3 className="font-semibold mb-2 px-2 text-foreground">Project Files</h3>
            <div className="space-y-1">
                {files.map((file) => (
                    <div key={file.path} className="px-2 py-1 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2">
                        {file.type === 'directory' ? <Folder className="h-4 w-4 text-blue-400" /> : <FileText className="h-4 w-4" />}
                        <span>{file.name}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 px-2 text-xs opacity-50">
                (Context awareness coming in next update)
            </div>
        </div>
    );
}
