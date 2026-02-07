'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.cjs';
import { useTheme } from 'next-themes';
import { NeuralState } from '@/lib/neural-core';

interface NeuralCortexProps {
    neuralState: NeuralState;
}

function BrainParticles({ neuralState }: { neuralState: NeuralState }) {
    const ref = useRef<any>(null);
    const { theme } = useTheme();

    // Generate random points in a sphere
    const sphere = useMemo(() => {
        return random.inSphere(new Float32Array(5000), { radius: 1.2 }) as Float32Array;
    }, []);

    useFrame((state: any, delta: number) => {
        if (!ref.current) return;

        // Rotate the brain
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;

        // Pulse effect based on neural state
        const isActive = neuralState.isLoading || (neuralState.isReady && neuralState.text !== "Idle");

        if (isActive) {
            // Fast chaotic pulse when thinking/generating
            const t = state.clock.getElapsedTime();
            ref.current.scale.setScalar(1 + Math.sin(t * 10) * 0.05);
            ref.current.rotation.y += delta * 0.5; // Spin faster
        } else {
            // Gentle breathing when idle
            const t = state.clock.getElapsedTime();
            ref.current.scale.setScalar(1 + Math.sin(t * 1) * 0.02);
        }
    });

    // Determine color based on state
    const color = useMemo(() => {
        if (neuralState.error) return '#ef4444'; // Red for error
        if (neuralState.isLoading) return '#3b82f6'; // Blue for loading
        if (neuralState.isReady) return '#22c55e'; // Green for ready
        return '#ffffff';
    }, [neuralState]);

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

export function NeuralCortex({ neuralState }: NeuralCortexProps) {
    return (
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <BrainParticles neuralState={neuralState} />
                </Float>
            </Canvas>
        </div>
    );
}
