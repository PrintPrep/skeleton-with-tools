// lib/sticker-pack/types.ts

export interface StickerItem {
    id: string;
    name: string;
    imageUrl: string;
    imageFile: File;
    width: number;      // mm
    height: number;     // mm
    count: number;      // how many times to print
    lockAspectRatio: boolean;
    originalWidth: number;  // mm
    originalHeight: number; // mm
}

export interface PageSettings {
    type: string;
    width: number;   // mm
    height: number;  // mm
}

export interface PackingSettings {
    horizontalOnly: boolean;
    verticalOnly: boolean;
    autoRotate: boolean;
    margin: number; // mm between stickers
}

export interface PackedSticker {
    item: StickerItem;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number; // 0 or 90 degrees
    pageIndex: number;
}

export interface Page {
    index: number;
    stickers: PackedSticker[];
}

export const PAGE_SIZES: Record<string, { width: number; height: number }> = {
    // ISO A-series
    A0: { width: 841, height: 1189 },
    A1: { width: 594, height: 841 },
    A2: { width: 420, height: 594 },
    A3: { width: 297, height: 420 },
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
    A6: { width: 105, height: 148 },
    A7: { width: 74, height: 105 },
    A8: { width: 52, height: 74 },
    A9: { width: 37, height: 52 },
    A10: { width: 26, height: 37 },
    // ISO B-series
    B0: { width: 1000, height: 1414 },
    B1: { width: 707, height: 1000 },
    B2: { width: 500, height: 707 },
    B3: { width: 353, height: 500 },
    B4: { width: 250, height: 353 },
    B5: { width: 176, height: 250 },
    B6: { width: 125, height: 176 },
    B7: { width: 88, height: 125 },
    B8: { width: 62, height: 88 },
    B9: { width: 44, height: 62 },
    B10: { width: 31, height: 44 },
    // US common
    Letter: { width: 216, height: 279 },
    Legal: { width: 216, height: 356 },
    Tabloid: { width: 279, height: 432 },
    Executive: { width: 184, height: 267 },
};