import { useState, useEffect } from 'react';
import { neuralCore, NeuralState } from '@/lib/neural-core';

export function useNeuralState() {
    const [state, setState] = useState<NeuralState>({
        isLoading: false,
        progress: 0,
        text: "Idle",
        isReady: false,
        error: null,
        excitement: 0,
        stress: 0
    });

    useEffect(() => {
        const unsubscribe = neuralCore.subscribe(setState);
        return () => unsubscribe();
    }, []);

    return state;
}
