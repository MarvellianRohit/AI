import fs from 'fs/promises';
import path from 'path';

export interface FileNode {
    name: string;
    type: "file" | "directory";
    path: string;
    children?: FileNode[];
}

const IGNORED_DIRS = new Set([
    'node_modules',
    '.next',
    '.git',
    '.vscode',
    '.idea',
    'dist',
    'build',
    'coverage'
]);

const IGNORED_FILES = new Set([
    '.DS_Store',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.env',
    '.env.local'
]);

export async function getDirectoryTree(dirPath: string, rootPath: string = process.cwd()): Promise<FileNode[]> {
    try {
        const fullPath = path.resolve(rootPath, dirPath);
        const stats = await fs.stat(fullPath);

        if (!stats.isDirectory()) {
            return [];
        }

        const entries = await fs.readdir(fullPath, { withFileTypes: true });
        const nodes: FileNode[] = [];

        for (const entry of entries) {
            if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) continue;
            if (entry.isFile() && IGNORED_FILES.has(entry.name)) continue;

            // Optional: Limit depth or file count if needed, but for now scan 1 level deep for API
            // For recursive, we might want to be careful. 
            // The FileExplorer fetches 1 level at a time usually? 
            // Step 147 FileExplorer fetches `?path=.`.
            // Let's support recursive but maybe limit depth if called specifically?
            // Actually, for AI Context, we want FULL recursive (excluding ignored).
            // For FileExplorer, we might want recursive to show full tree at once?
            // Let's implement recursive.

            const relativePath = path.relative(rootPath, path.join(fullPath, entry.name));

            const node: FileNode = {
                name: entry.name,
                type: entry.isDirectory() ? 'directory' : 'file',
                path: relativePath,
            };

            if (entry.isDirectory()) {
                node.children = await getDirectoryTree(relativePath, rootPath);
            }

            nodes.push(node);
        }

        // Sort directories first
        return nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'directory' ? -1 : 1;
        });

    } catch (error) {
        console.error("Error reading directory:", error);
        return [];
    }
}

export function formatTreeString(nodes: FileNode[], prefix: string = ''): string {
    let result = '';
    nodes.forEach((node, index) => {
        const isLast = index === nodes.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        result += `${prefix}${pointer}${node.name}\n`;

        if (node.children) {
            result += formatTreeString(node.children, newPrefix);
        }
    });
    return result;
}

export async function getProjectContextString(): Promise<string> {
    const tree = await getDirectoryTree('.');
    return formatTreeString(tree);
}
