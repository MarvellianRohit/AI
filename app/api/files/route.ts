import { NextResponse } from 'next/server';
import { getDirectoryTree } from '@/lib/project-structure';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '.';

    try {
        // We always fetch from root '.' recursively so the tree is fully populated
        // The path param was intended for lazy loading but let's just send the whole tree for now 
        // as the File Explorer logic I wrote in Step 147 was:
        // if (data.files) setFiles(prev => data.files) -- simply replacing.
        const files = await getDirectoryTree('.');
        return NextResponse.json({ files });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }
}
