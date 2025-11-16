// components/tools/sticker-pack/workspace/Header.tsx

'use client';

import React from 'react';
import { Download, Share2 } from 'lucide-react';

interface HeaderProps {
    onExport: () => void;
    isExporting: boolean;
}

export default function Header({ onExport, isExporting }: HeaderProps) {
    return (
        <header className="rounded-lg border border-white/60 bg-white/80 px-6 py-4 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00BFA6]">
                        WORKSPACE
                    </p>
                    <h1 className="text-xl font-bold text-gray-800">Sticker Pack Builder</h1>
                </div>

                <div className="ms-auto flex items-center gap-3">
                    <button className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 flex items-center gap-2">
                        <Share2 size={16} />
                        Share
                    </button>

                    <button
                        onClick={onExport}
                        disabled={isExporting}
                        className="rounded-lg bg-[#00BFA6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00D1B2] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Download size={16} />
                        {isExporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                </div>
            </div>
        </header>
    );
}