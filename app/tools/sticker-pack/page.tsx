// app/tools/sticker-pack/editor/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/tools/sticker-pack/workspace/Header';
import ControlPanel from '@/components/tools/sticker-pack/workspace/ControlPanel';
import Workstation from '@/components/tools/sticker-pack/workspace/Workstation';
import EditItemDialog from '@/components/tools/sticker-pack/dialogs/EditItemDialog';
import ConfirmDialog from '@/components/tools/sticker-pack/dialogs/ConfirmDialog';
import { StickerItem, PageSettings, PackingSettings, PackedSticker } from '@/lib/sticker-pack/types';
import { generateId, getImageDimensions, readFileAsDataURL } from '@/lib/sticker-pack/utils';
import { packStickers } from '@/lib/sticker-pack/packing-algorithm';
import { generatePDF } from '@/lib/sticker-pack/pdf-generator';

export default function WorkspacePage() {
    const [items, setItems] = useState<StickerItem[]>([]);
    const [pageSettings, setPageSettings] = useState<PageSettings>({
        type: 'A4',
        width: 210,
        height: 297,
    });
    const [packingSettings, setPackingSettings] = useState<PackingSettings>({
        horizontalOnly: false,
        verticalOnly: false,
        autoRotate: true,
        margin: 3,
    });
    const [packedStickers, setPackedStickers] = useState<PackedSticker[]>([]);
    const [editingItem, setEditingItem] = useState<StickerItem | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });
    const [isExporting, setIsExporting] = useState(false);

    // Repack stickers whenever items, page settings, or packing settings change
    useEffect(() => {
        if (items.length > 0) {
            const packed = packStickers(items, pageSettings, packingSettings);
            setPackedStickers(packed);
        } else {
            setPackedStickers([]);
        }
    }, [items, pageSettings, packingSettings]);

    const handleUpload = async (files: FileList) => {
        const newItems: StickerItem[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                const imageUrl = await readFileAsDataURL(file);
                const dimensions = await getImageDimensions(file);

                // Default to 50mm width, maintaining aspect ratio
                const defaultWidth = 50;
                const aspectRatio = dimensions.height / dimensions.width;
                const defaultHeight = defaultWidth * aspectRatio;

                newItems.push({
                    id: generateId(),
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    imageUrl,
                    imageFile: file,
                    width: defaultWidth,
                    height: defaultHeight,
                    count: 1,
                    lockAspectRatio: true,
                    originalWidth: defaultWidth,
                    originalHeight: defaultHeight,
                });
            } catch (error) {
                console.error('Error loading image:', error);
            }
        }

        setItems([...items, ...newItems]);
    };

    const handleClearAll = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Clear All Stickers?',
            message: `Are you sure you want to delete all ${items.length} sticker(s)? This action cannot be undone.`,
            onConfirm: () => {
                setItems([]);
                setConfirmDialog({ ...confirmDialog, isOpen: false });
            },
        });
    };

    const handleDeleteItem = (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        setConfirmDialog({
            isOpen: true,
            title: 'Delete Sticker?',
            message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
            onConfirm: () => {
                setItems(items.filter((i) => i.id !== id));
                setConfirmDialog({ ...confirmDialog, isOpen: false });
            },
        });
    };

    const handleEditItem = (item: StickerItem) => {
        setEditingItem(item);
    };

    const handleSaveEdit = (updatedItem: StickerItem) => {
        setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
        setEditingItem(null);
    };

    const handleExport = async () => {
        if (packedStickers.length === 0) return;

        setIsExporting(true);
        try {
            await generatePDF(packedStickers, pageSettings);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const totalStickersUsed = items.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="flex h-screen flex-col bg-gradient-to-br from-[#E0F7F4] via-[#B3EDE5] to-[#80E3D7] p-4">
            <div className="mb-4">
                <Header onExport={handleExport} isExporting={isExporting} />
            </div>

            <div className="flex flex-1 gap-4 overflow-hidden">
                <ControlPanel
                    items={items}
                    packingSettings={packingSettings}
                    onUpload={handleUpload}
                    onClearAll={handleClearAll}
                    onDeleteItem={handleDeleteItem}
                    onEditItem={handleEditItem}
                    onPackingSettingsChange={setPackingSettings}
                    totalStickersUsed={totalStickersUsed}
                />

                <div className="flex-1 overflow-hidden rounded-lg">
                    <Workstation
                        pageSettings={pageSettings}
                        packedStickers={packedStickers}
                        onPageSettingsChange={setPageSettings}
                    />
                </div>
            </div>

            {/* Dialogs */}
            <EditItemDialog
                isOpen={editingItem !== null}
                item={editingItem}
                onSave={handleSaveEdit}
                onCancel={() => setEditingItem(null)}
            />

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            />
        </div>
    );
}