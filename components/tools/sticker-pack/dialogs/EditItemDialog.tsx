// components/tools/sticker-pack/dialogs/EditItemDialog.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { StickerItem } from '@/lib/sticker-pack/types';

interface EditItemDialogProps {
    isOpen: boolean;
    item: StickerItem | null;
    onSave: (updatedItem: StickerItem) => void;
    onCancel: () => void;
}

export default function EditItemDialog({
                                           isOpen,
                                           item,
                                           onSave,
                                           onCancel,
                                       }: EditItemDialogProps) {
    const [name, setName] = useState('');
    const [count, setCount] = useState(1);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [lockAspectRatio, setLockAspectRatio] = useState(true);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCount(item.count);
            setWidth(item.width);
            setHeight(item.height);
            setLockAspectRatio(item.lockAspectRatio);
        }
    }, [item]);

    const handleWidthChange = (newWidth: number) => {
        setWidth(newWidth);
        if (lockAspectRatio && item) {
            const ratio = item.originalHeight / item.originalWidth;
            setHeight(newWidth * ratio);
        }
    };

    const handleHeightChange = (newHeight: number) => {
        setHeight(newHeight);
        if (lockAspectRatio && item) {
            const ratio = item.originalWidth / item.originalHeight;
            setWidth(newHeight * ratio);
        }
    };

    const handleSave = () => {
        if (item) {
            onSave({
                ...item,
                name,
                count,
                width: Math.round(width * 100) / 100,
                height: Math.round(height * 100) / 100,
                lockAspectRatio,
            });
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Sticker</h3>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                        />
                    </div>

                    {/* Count */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Number of Items
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                        />
                    </div>

                    {/* Lock Aspect Ratio */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="lockRatio"
                            checked={lockAspectRatio}
                            onChange={(e) => setLockAspectRatio(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-[#00BFA6] focus:ring-[#00BFA6]"
                        />
                        <label htmlFor="lockRatio" className="text-sm font-medium text-gray-700">
                            Lock aspect ratio
                        </label>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Width (mm)
                            </label>
                            <input
                                type="number"
                                min="1"
                                step="0.1"
                                value={width.toFixed(1)}
                                onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Height (mm)
                            </label>
                            <input
                                type="number"
                                min="1"
                                step="0.1"
                                value={height.toFixed(1)}
                                onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-lg bg-[#00BFA6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00D1B2]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}