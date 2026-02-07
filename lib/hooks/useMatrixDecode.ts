'use client';

import { useState, useEffect } from 'react';

const CHARS = 'ABCDEF0123456789';

export function useMatrixDecode(targetText: string, speed: number = 2) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let iteration = 0;
        let timer: NodeJS.Timeout;

        const start = () => {
            timer = setInterval(() => {
                setDisplayText(prev =>
                    targetText
                        .split('')
                        .map((letter, index) => {
                            if (index < iteration) {
                                return targetText[index];
                            }
                            return CHARS[Math.floor(Math.random() * CHARS.length)];
                        })
                        .join('')
                );

                if (iteration >= targetText.length) {
                    clearInterval(timer);
                }

                iteration += 1 / speed;
            }, 30);
        };

        start();

        return () => clearInterval(timer);
    }, [targetText, speed]);

    return displayText;
}
