"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecentChatsGrid } from "@/components/dashboard/RecentChatsGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, FolderPlus, Filter } from "lucide-react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Analytics } from "@/lib/utils/analytics";

type FilterType = 'all' | 'favorites' | 'archived';

export default function DashboardPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterType>('all');
    const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [folders, setFolders] = useLocalStorage<string[]>('chat_folders', []);

    const handleNewChat = () => {
        Analytics.trackNewChat();
        router.push('/');
    };

    const handleCreateFolder = () => {
        if (folderName.trim()) {
            setFolders([...folders, folderName]);
            setFolderName('');
            setIsNewFolderOpen(false);
        }
    };

    return (
        <AppLayout>
            <div className="h-full w-full overflow-y-auto bg-slate-950 p-6 lg:p-10">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                            <p className="text-muted-foreground">Manage your chats and organize knowledge</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => setIsNewFolderOpen(true)}
                            >
                                <FolderPlus className="h-4 w-4" />
                                New Folder
                            </Button>
                            <Button
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20"
                                onClick={handleNewChat}
                            >
                                <Plus className="h-4 w-4" />
                                New Chat
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats / Filters */}
                    <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
                        <button
                            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 transition-colors ${filter === 'all'
                                    ? 'border-white/10 bg-white/5 text-white'
                                    : 'border-transparent hover:bg-white/5'
                                }`}
                            onClick={() => setFilter('all')}
                        >
                            All Chats
                        </button>
                        <button
                            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 transition-colors ${filter === 'favorites'
                                    ? 'border-white/10 bg-white/5 text-white'
                                    : 'border-transparent hover:bg-white/5'
                                }`}
                            onClick={() => setFilter('favorites')}
                        >
                            Favorites
                        </button>
                        <button
                            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 transition-colors ${filter === 'archived'
                                    ? 'border-white/10 bg-white/5 text-white'
                                    : 'border-transparent hover:bg-white/5'
                                }`}
                            onClick={() => setFilter('archived')}
                        >
                            Archived
                        </button>
                        <div className="ml-auto">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Filter className="h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>

                    {/* Grid */}
                    <RecentChatsGrid filter={filter} />

                    {/* Folders */}
                    {folders.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-4 text-lg font-semibold text-white">Folders</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {folders.map((folder, i) => (
                                    <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                                        <FolderPlus className="h-5 w-5 text-blue-400" />
                                        <span className="text-white">{folder}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Folder Modal */}
            <Modal
                isOpen={isNewFolderOpen}
                onClose={() => setIsNewFolderOpen(false)}
                title="Create New Folder"
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Folder Name
                        </label>
                        <Input
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="e.g., Work Projects"
                            className="bg-black/20 border-white/10"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsNewFolderOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateFolder}>
                            Create Folder
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
