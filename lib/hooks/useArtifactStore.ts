import { useState, useCallback } from 'react';

export interface ArtifactVersion {
    id: string;
    code: string;
    timestamp: number;
}

export function useArtifactStore() {
    const [versions, setVersions] = useState<ArtifactVersion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const addVersion = useCallback((code: string) => {
        const newVersion: ArtifactVersion = {
            id: Math.random().toString(36).substring(7),
            code,
            timestamp: Date.now(),
        };
        setVersions(prev => {
            const updated = [...prev, newVersion];
            setCurrentIndex(updated.length - 1);
            return updated;
        });
    }, []);

    const goToVersion = useCallback((index: number) => {
        if (index >= 0 && index < versions.length) {
            setCurrentIndex(index);
        }
    }, [versions.length]);

    return {
        versions,
        currentIndex,
        currentVersion: versions[currentIndex] || null,
        addVersion,
        goToVersion
    };
}
