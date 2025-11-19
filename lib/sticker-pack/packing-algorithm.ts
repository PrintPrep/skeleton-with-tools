// lib/sticker-pack/packing-algorithm.ts

import { StickerItem, PackedSticker, PageSettings, PackingSettings } from './types';

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function packStickers(
    items: StickerItem[],
    pageSettings: PageSettings,
    packingSettings: PackingSettings
): PackedSticker[] {
    const packedStickers: PackedSticker[] = [];
    const pages: Rectangle[][] = [[]]; // Array of pages, each page has occupied rectangles

    const pageWidth = pageSettings.width;
    const pageHeight = pageSettings.height;
    const margin = packingSettings.margin;

    // Expand items based on count
    const allStickers: { item: StickerItem; index: number }[] = [];
    items.forEach(item => {
        for (let i = 0; i < item.count; i++) {
            allStickers.push({ item, index: i });
        }
    });

    // Sort by area (largest first) for better packing
    allStickers.sort((a, b) => {
        const areaA = a.item.width * a.item.height;
        const areaB = b.item.width * b.item.height;
        return areaB - areaA;
    });

    for (const { item } of allStickers) {
        let placed = false;
        let currentPageIndex = 0;

        // Try to place on existing pages first
        while (!placed && currentPageIndex < pages.length) {
            const placement = findPlacement(
                item,
                pages[currentPageIndex],
                pageWidth,
                pageHeight,
                margin,
                packingSettings
            );

            if (placement) {
                packedStickers.push({
                    item,
                    x: placement.x,
                    y: placement.y,
                    width: placement.width,
                    height: placement.height,
                    rotation: placement.rotation,
                    pageIndex: currentPageIndex,
                });

                pages[currentPageIndex].push({
                    x: placement.x,
                    y: placement.y,
                    width: placement.width,
                    height: placement.height,
                });

                placed = true;
            } else {
                currentPageIndex++;
            }
        }

        // If not placed, create new page
        if (!placed) {
            pages.push([]);
            const placement = findPlacement(
                item,
                pages[currentPageIndex],
                pageWidth,
                pageHeight,
                margin,
                packingSettings
            );

            if (placement) {
                packedStickers.push({
                    item,
                    x: placement.x,
                    y: placement.y,
                    width: placement.width,
                    height: placement.height,
                    rotation: placement.rotation,
                    pageIndex: currentPageIndex,
                });

                pages[currentPageIndex].push({
                    x: placement.x,
                    y: placement.y,
                    width: placement.width,
                    height: placement.height,
                });
            }
        }
    }

    return packedStickers;
}

function findPlacement(
    item: StickerItem,
    occupiedRects: Rectangle[],
    pageWidth: number,
    pageHeight: number,
    margin: number,
    settings: PackingSettings
): { x: number; y: number; width: number; height: number; rotation: number } | null {
    const orientations: { width: number; height: number; rotation: number }[] = [];

    // Determine orientations based on settings
    if (settings.verticalOnly) {
        // Vertical only: longer edge should be vertical (parallel to height)
        if (item.width > item.height) {
            // Wide image - rotate 90° to make it tall
            orientations.push({ width: item.height, height: item.width, rotation: 90 });
        } else {
            // Already tall or square - no rotation
            orientations.push({ width: item.width, height: item.height, rotation: 0 });
        }
    } else if (settings.horizontalOnly) {
        // Horizontal only: longer edge should be horizontal (parallel to width)
        if (item.height > item.width) {
            // Tall image - rotate 90° to make it wide
            orientations.push({ width: item.height, height: item.width, rotation: 90 });
        } else {
            // Already wide or square - no rotation
            orientations.push({ width: item.width, height: item.height, rotation: 0 });
        }
    } else if (settings.autoRotate) {
        // Auto-rotate: try both orientations to find best fit
        orientations.push({ width: item.width, height: item.height, rotation: 0 });
        orientations.push({ width: item.height, height: item.width, rotation: 90 });
    } else {
        // Default: no rotation
        orientations.push({ width: item.width, height: item.height, rotation: 0 });
    }

    // Try each orientation
    for (const orientation of orientations) {
        // Try to place starting from top-left, scanning the page
        for (let y = margin; y <= pageHeight - orientation.height - margin; y += 5) {
            for (let x = margin; x <= pageWidth - orientation.width - margin; x += 5) {
                const testRect: Rectangle = {
                    x,
                    y,
                    width: orientation.width,
                    height: orientation.height,
                };

                if (!hasOverlap(testRect, occupiedRects, margin)) {
                    return {
                        x,
                        y,
                        width: orientation.width,
                        height: orientation.height,
                        rotation: orientation.rotation,
                    };
                }
            }
        }
    }

    return null;
}

function hasOverlap(rect: Rectangle, occupiedRects: Rectangle[], margin: number): boolean {
    for (const occupied of occupiedRects) {
        if (
            rect.x < occupied.x + occupied.width + margin &&
            rect.x + rect.width + margin > occupied.x &&
            rect.y < occupied.y + occupied.height + margin &&
            rect.y + rect.height + margin > occupied.y
        ) {
            return true;
        }
    }
    return false;
}