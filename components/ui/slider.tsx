"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
    value: number[]
    onValueChange: (value: number[]) => void
    max: number
    step?: number
}

export function Slider({ className, value, onValueChange, ...props }: SliderProps) {
    return (
        <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
            <input
                type="range"
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                value={value[0]}
                onChange={(e) => onValueChange([parseInt(e.target.value)])}
                {...props}
            />
        </div>
    )
}
