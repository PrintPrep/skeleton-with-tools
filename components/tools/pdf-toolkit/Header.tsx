// components/tools/pdf-toolkit/Header.tsx

import React from 'react';
import { Share2, Download } from 'lucide-react';

interface HeaderProps {
    onExport: () => void;
    sectionsCount: number;
}

export default function Header({ onExport, sectionsCount }: HeaderProps) {
    const handleShare = () => {
        // Placeholder for share functionality
        alert('Share functionality coming soon!');
    };

    return (
        <header className="rounded-lg border border-white/60 bg-white/80 px-6 py-4 shadow-lg backdrop-blur mb-4">
            <div className="flex flex-wrap items-center gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00BFA6]">
                        Workspace
                    </p>
                    <h1 className="text-xl font-bold text-gray-800">PDF Toolkit</h1>
                </div>
                <div className="ms-auto flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 flex items-center gap-2"
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                    <button
                        onClick={onExport}
                        disabled={sectionsCount === 0}
                        className="rounded-lg bg-[#00BFA6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00D1B2] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Download size={16} />
                        Merge & Export
                    </button>
                </div>
            </div>
        </header>
    );
}