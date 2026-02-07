'use client';

import React, { useEffect, useRef } from 'react';
import { useNeuralState } from '@/lib/hooks/useNeuralState';

export function BioOverlay() {
    const state = useNeuralState();
    const stateRef = useRef(state);

    // Update ref on every render so the animation loop has fresh data
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrame: number;

        const animate = () => {
            const currentState = stateRef.current;
            const time = performance.now() / 1000;

            // Heartbeat calculation
            // Base rate: 60bpm (1Hz)
            // Max rate: 180bpm (3Hz) when excited
            const heartRate = 1 + (currentState.excitement * 2);
            const beat = (Math.sin(time * heartRate * Math.PI * 2) + 1) / 2; // 0 to 1 sine wave

            // sharp pulse
            const pulse = Math.pow(beat, 8);

            // Vignette intensity
            // Base: 0.1 (subtle)
            // Pulse: adds up to 0.1
            // Stress: adds redness
            const vignetteOpacity = 0.1 + (pulse * 0.1) + (currentState.stress * 0.3);

            // Color shift based on stress
            // 0 stress = black/blue vignette
            // 1 stress = red vignette
            const r = Math.floor(currentState.stress * 255);
            const b = Math.floor((1 - currentState.stress) * 50);

            if (overlayRef.current) {
                overlayRef.current.style.background = `radial-gradient(circle at center, transparent 30%, rgba(${r}, 0, ${b}, ${vignetteOpacity}) 100%)`;

                // Screen Shake on high stress
                if (currentState.stress > 0.4) {
                    const intensity = (currentState.stress - 0.4) * 5; // Scale up
                    const shakeX = (Math.random() - 0.5) * intensity;
                    const shakeY = (Math.random() - 0.5) * intensity;
                    document.body.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
                } else {
                    document.body.style.transform = 'none';
                }

                // Synesthesia: Shift Theme Color based on Excitement
                // Violet (260) -> Electric Cyan (190) -> White-ish
                const hue = 260 - (currentState.excitement * 70);
                const sat = 90;
                const light = 60 + (currentState.excitement * 20); // Get brighter
                document.documentElement.style.setProperty('--primary', `hsl(${hue}, ${sat}%, ${light}%)`);
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            document.body.style.transform = 'none';
            // Reset color
            document.documentElement.style.removeProperty('--primary');
        };
    }, []); // Only run once on mount

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 pointer-events-none z-[100] transition-colors duration-300"
        />
    );
}
