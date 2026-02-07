'use client';

import React from 'react';
import { useNeuralState } from '@/lib/hooks/useNeuralState';
import { cn } from '@/lib/utils';

export function LivingBorder() {
    const state = useNeuralState();

    // Opacity based on excitement
    // 0 excitement = invisible
    // 1 excitement = full glow
    const opacity = Math.max(state.excitement, 0.1);

    return (
        <div
            className={cn(
                "fixed inset-0 pointer-events-none z-[90] border-[1px] rounded-lg transition-all duration-300",
                "box-border"
            )}
            style={{
                borderColor: `rgba(var(--primary-rgb), ${opacity * 0.5})`,
                boxShadow: `inset 0 0 ${20 + (state.excitement * 50)}px rgba(var(--primary-rgb), ${opacity * 0.3})`
            }}
        >
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: `radial-gradient(circle at 50% 100%, rgba(var(--primary-rgb), ${state.excitement * 0.2}) 0%, transparent 50%)`
                }}
            />
        </div>
    );
}
