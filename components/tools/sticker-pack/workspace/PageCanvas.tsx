// components/tools/sticker-pack/workspace/PageCanvas.tsx

'use client';

import React from 'react';
import { PageSettings, PackedSticker } from '@/lib/sticker-pack/types';
import Image from 'next/image';

interface PageCanvasProps {
    pageSettings: PageSettings;
    stickers: PackedSticker[];
}

export default function PageCanvas({ pageSettings, stickers }: PageCanvasProps) {
    // Calculate scale to fit in viewport (max 800px wide)
    const maxWidth = 800;
    const scale = Math.min(maxWidth / pageSettings.width, 1);

    const canvasWidth = pageSettings.width * scale;
    const canvasHeight = pageSettings.height * scale;

    return (
        <div
            className="relative mx-auto bg-white shadow-2xl"
            style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
            }}
        >
            {stickers.map((sticker, index) => {
                const x = sticker.x * scale;
                const y = sticker.y * scale;
                const width = sticker.width * scale;
                const height = sticker.height * scale;

                return (
                    <div
                        key={`${sticker.item.id}-${index}`}
                        className="absolute border border-gray-200"
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                            transform: sticker.rotation === 90 ? 'rotate(90deg)' : 'none',
                            transformOrigin: 'center center',
                        }}
                    >
                        <div className="relative h-full w-full">
                            <Image
                                src={sticker.item.imageUrl}
                                alt={sticker.item.name}
                                fill
                                className="object-contain"
                                sizes={`${width}px`}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Grid lines for reference */}
            <div className="pointer-events-none absolute inset-0">
                <svg className="h-full w-full">
                    <defs>
                        <pattern
                            id="grid"
                            width={10 * scale}
                            height={10 * scale}
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d={`M ${10 * scale} 0 L 0 0 0 ${10 * scale}`}
                                fill="none"
                                stroke="rgba(0,0,0,0.05)"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
        </div>
    );
}