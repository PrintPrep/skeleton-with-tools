// components/tools/sticker-pack/workspace/ControlPanel.tsx

'use client';

import React, { useRef, useState } from 'react';
import { Upload, Trash2, Edit, X } from 'lucide-react';
import { StickerItem, PackingSettings } from '@/lib/sticker-pack/types';
import Image from 'next/image';

interface ControlPanelProps {
    items: StickerItem[];
    packingSettings: PackingSettings;
    onUpload: (files: FileList) => void;
    onClearAll: () => void;
    onDeleteItem: (id: string) => void;
    onEditItem: (item: StickerItem) => void;
    onPackingSettingsChange: (settings: PackingSettings) => void;
    totalStickersUsed: number;
}

export default function ControlPanel({
                                         items,
                                         packingSettings,
                                         onUpload,
                                         onClearAll,
                                         onDeleteItem,
                                         onEditItem,
                                         onPackingSettingsChange,
                                         totalStickersUsed,
                                     }: ControlPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
        }
    };

    return (
        <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white shadow-sm">
            {/* Upload Section */}
            <div className="border-b border-gray-200 p-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00BFA6] px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#00D1B2] hover:shadow-lg"
                >
                    <Upload size={18} />
                    Upload Stickers
                </button>

                {items.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#FFBFBF] bg-[#FFE5E5] px-4 py-2 font-medium text-[#FF3B30] transition-colors hover:bg-[#FFD1D1]"
                    >
                        <Trash2 size={16} />
                        Clear All
                    </button>
                )}
            </div>

            {/* Packing Settings */}
            <div className="border-b border-gray-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Layout Options</h3>
                <select
                    value={
                        packingSettings.horizontalOnly
                            ? 'horizontal'
                            : packingSettings.verticalOnly
                                ? 'vertical'
                                : 'auto'
                    }
                    onChange={(e) => {
                        const value = e.target.value;
                        onPackingSettingsChange({
                            ...packingSettings,
                            horizontalOnly: value === 'horizontal',
                            verticalOnly: value === 'vertical',
                            autoRotate: value === 'auto',
                        });
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                >
                    <option value="auto">Auto-rotate to fit more (Recommended)</option>
                    <option value="horizontal">Horizontal only</option>
                    <option value="vertical">Vertical only</option>
                </select>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                    Stickers ({items.length}) - {totalStickersUsed} total
                </h3>

                {items.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">
                        <Upload size={32} className="mx-auto mb-3 opacity-40" />
                        Upload images to get started
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-[#00BFA6] hover:shadow-md"
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Image Preview */}
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-semibold text-gray-800">
                                            {item.name}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-600">
                                            {item.width.toFixed(0)} × {item.height.toFixed(0)} mm
                                        </div>
                                        <div className="mt-1">
                      <span className="inline-flex items-center rounded-full bg-[#00BFA6] px-2 py-0.5 text-xs font-semibold text-white">
                        ×{item.count}
                      </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {hoveredItem === item.id && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => onEditItem(item)}
                                                className="rounded p-1.5 text-[#00BFA6] transition-colors hover:bg-[#00BFA6] hover:text-white"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteItem(item.id)}
                                                className="rounded p-1.5 text-[#FF3B30] transition-colors hover:bg-[#FF3B30] hover:text-white"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}