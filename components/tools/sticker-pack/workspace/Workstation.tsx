// components/workspace/Workstation.tsx
'use client';

import React from 'react';
import { PageSettings, PackedSticker, PAGE_SIZES } from '@/lib/sticker-pack/types';
import PageCanvas from './PageCanvas';

interface WorkstationProps {
    pageSettings: PageSettings;
    packedStickers: PackedSticker[];
    onPageSettingsChange: (settings: PageSettings) => void;
}

export default function Workstation({
                                        pageSettings,
                                        packedStickers,
                                        onPageSettingsChange,
                                    }: WorkstationProps) {
    // Group stickers by page
    const pages = new Map<number, PackedSticker[]>();
    packedStickers.forEach((sticker) => {
        if (!pages.has(sticker.pageIndex)) {
            pages.set(sticker.pageIndex, []);
        }
        pages.get(sticker.pageIndex)!.push(sticker);
    });

    const pageIndices = Array.from(pages.keys()).sort((a, b) => a - b);

    const handlePageTypeChange = (type: string) => {
        if (type === 'Custom') {
            onPageSettingsChange({
                type: 'Custom',
                width: 210,
                height: 297,
            });
        } else {
            const size = PAGE_SIZES[type];
            onPageSettingsChange({
                type: type,
                width: size.width,
                height: size.height,
            });
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-gray-100">
            {/* Settings Bar */}
            <div className="border-b border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                            Page Size
                        </label>
                        <select
                            value={pageSettings.type}
                            onChange={(e) => handlePageTypeChange(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                        >
                            <optgroup label="ISO A-Series">
                                <option value="A0">A0 (841 × 1189 mm)</option>
                                <option value="A1">A1 (594 × 841 mm)</option>
                                <option value="A2">A2 (420 × 594 mm)</option>
                                <option value="A3">A3 (297 × 420 mm)</option>
                                <option value="A4">A4 (210 × 297 mm)</option>
                                <option value="A5">A5 (148 × 210 mm)</option>
                                <option value="A6">A6 (105 × 148 mm)</option>
                                <option value="A7">A7 (74 × 105 mm)</option>
                                <option value="A8">A8 (52 × 74 mm)</option>
                                <option value="A9">A9 (37 × 52 mm)</option>
                                <option value="A10">A10 (26 × 37 mm)</option>
                            </optgroup>
                            <optgroup label="ISO B-Series">
                                <option value="B0">B0 (1000 × 1414 mm)</option>
                                <option value="B1">B1 (707 × 1000 mm)</option>
                                <option value="B2">B2 (500 × 707 mm)</option>
                                <option value="B3">B3 (353 × 500 mm)</option>
                                <option value="B4">B4 (250 × 353 mm)</option>
                                <option value="B5">B5 (176 × 250 mm)</option>
                                <option value="B6">B6 (125 × 176 mm)</option>
                                <option value="B7">B7 (88 × 125 mm)</option>
                                <option value="B8">B8 (62 × 88 mm)</option>
                                <option value="B9">B9 (44 × 62 mm)</option>
                                <option value="B10">B10 (31 × 44 mm)</option>
                            </optgroup>
                            <optgroup label="US Sizes">
                                <option value="Letter">Letter (216 × 279 mm)</option>
                                <option value="Legal">Legal (216 × 356 mm)</option>
                                <option value="Tabloid">Tabloid (279 × 432 mm)</option>
                                <option value="Executive">Executive (184 × 267 mm)</option>
                            </optgroup>
                            <optgroup label="Other">
                                <option value="Custom">Custom</option>
                            </optgroup>
                        </select>
                    </div>

                    {pageSettings.type === 'Custom' && (
                        <>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Width (mm)
                                </label>
                                <input
                                    type="number"
                                    value={pageSettings.width}
                                    onChange={(e) =>
                                        onPageSettingsChange({
                                            ...pageSettings,
                                            width: parseInt(e.target.value) || 210,
                                        })
                                    }
                                    className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Height (mm)
                                </label>
                                <input
                                    type="number"
                                    value={pageSettings.height}
                                    onChange={(e) =>
                                        onPageSettingsChange({
                                            ...pageSettings,
                                            height: parseInt(e.target.value) || 297,
                                        })
                                    }
                                    className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                                />
                            </div>
                        </>
                    )}

                    {pageIndices.length > 0 && (
                        <div className="ml-auto">
              <span className="rounded-full bg-[#00BFA6] px-3 py-1 text-sm font-semibold text-white">
                {pageIndices.length} {pageIndices.length === 1 ? 'Page' : 'Pages'}
              </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-y-auto p-8">
                {pageIndices.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center text-gray-400">
                            <svg
                                className="mx-auto mb-4 h-16 w-16 opacity-40"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-sm">Upload stickers to see the preview</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {pageIndices.map((pageIndex) => (
                            <div key={pageIndex} className="mx-auto">
                                <div className="mb-2 text-sm font-semibold text-gray-600">
                                    Page {pageIndex + 1}
                                </div>
                                <PageCanvas
                                    pageSettings={pageSettings}
                                    stickers={pages.get(pageIndex)!}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}