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

    // Temporary string states for input fields to allow empty values
    const [widthInput, setWidthInput] = useState('');
    const [heightInput, setHeightInput] = useState('');
    const [countInput, setCountInput] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCount(item.count);
            setWidth(item.width);
            setHeight(item.height);
            setLockAspectRatio(item.lockAspectRatio);
            setWidthInput(item.width.toFixed(1));
            setHeightInput(item.height.toFixed(1));
            setCountInput(item.count.toString());
        }
    }, [item]);

    const handleWidthChange = (value: string) => {
        setWidthInput(value);
        const newWidth = parseFloat(value);
        if (!isNaN(newWidth) && newWidth > 0) {
            setWidth(newWidth);
            if (lockAspectRatio && item) {
                const ratio = item.originalHeight / item.originalWidth;
                const newHeight = newWidth * ratio;
                setHeight(newHeight);
                setHeightInput(newHeight.toFixed(1));
            }
        }
    };

    const handleHeightChange = (value: string) => {
        setHeightInput(value);
        const newHeight = parseFloat(value);
        if (!isNaN(newHeight) && newHeight > 0) {
            setHeight(newHeight);
            if (lockAspectRatio && item) {
                const ratio = item.originalWidth / item.originalHeight;
                const newWidth = newHeight * ratio;
                setWidth(newWidth);
                setWidthInput(newWidth.toFixed(1));
            }
        }
    };

    const handleCountChange = (value: string) => {
        setCountInput(value);
        const newCount = parseInt(value);
        if (!isNaN(newCount) && newCount > 0) {
            setCount(newCount);
        }
    };

    const handleSave = () => {
        if (item) {
            // Ensure valid values before saving
            const finalWidth = width > 0 ? width : item.width;
            const finalHeight = height > 0 ? height : item.height;
            const finalCount = count > 0 ? count : 1;

            onSave({
                ...item,
                name,
                count: finalCount,
                width: Math.round(finalWidth * 100) / 100,
                height: Math.round(finalHeight * 100) / 100,
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
                            value={countInput}
                            onChange={(e) => handleCountChange(e.target.value)}
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
                                value={widthInput}
                                onChange={(e) => handleWidthChange(e.target.value)}
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
                                value={heightInput}
                                onChange={(e) => handleHeightChange(e.target.value)}
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