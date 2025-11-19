// lib/sticker-pack/pdf-generator.ts

import { jsPDF } from 'jspdf';
import { PackedSticker, PageSettings } from './types';

export async function generatePDF(
    packedStickers: PackedSticker[],
    pageSettings: PageSettings
): Promise<void> {
    const pdf = new jsPDF({
        orientation: pageSettings.width > pageSettings.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pageSettings.width, pageSettings.height],
    });

    // Group stickers by page
    const pages: Map<number, PackedSticker[]> = new Map();
    packedStickers.forEach(sticker => {
        if (!pages.has(sticker.pageIndex)) {
            pages.set(sticker.pageIndex, []);
        }
        pages.get(sticker.pageIndex)!.push(sticker);
    });

    const pageIndices = Array.from(pages.keys()).sort((a, b) => a - b);

    for (let i = 0; i < pageIndices.length; i++) {
        const pageIndex = pageIndices[i];
        const pageStickers = pages.get(pageIndex)!;

        if (i > 0) {
            pdf.addPage([pageSettings.width, pageSettings.height]);
        }

        // Draw each sticker
        for (const sticker of pageStickers) {
            try {
                const imgData = sticker.item.imageUrl;

                if (sticker.rotation === 90) {
                    // For 90-degree rotation, we need to:
                    // 1. The packed dimensions (sticker.width, sticker.height) are the rotated box
                    // 2. The original image dimensions need to be swapped back
                    // 3. Position the image so it fits in the rotated bounding box

                    // Original image dimensions (before packing rotation)
                    const originalWidth = sticker.height;  // packed height = original width
                    const originalHeight = sticker.width;   // packed width = original height

                    // Position where the rotated image should appear
                    // We place it at x, y + width (bottom-left of the bounding box after rotation)
                    const posX = sticker.x;
                    const posY = sticker.y + sticker.width;

                    // Add image with 90-degree rotation
                    // jsPDF's addImage rotation parameter: positive = counterclockwise
                    pdf.addImage(
                        imgData,
                        'JPEG',
                        posX + originalHeight, //I changed this fron just posX
                        posY,
                        originalWidth,
                        originalHeight,
                        undefined,
                        'FAST',
                        90  // Rotate 90 degrees counterclockwise
                    );
                } else {
                    // No rotation - draw normally
                    pdf.addImage(
                        imgData,
                        'JPEG',
                        sticker.x,
                        sticker.y,
                        sticker.width,
                        sticker.height,
                        undefined,
                        'FAST'
                    );
                }
            } catch (error) {
                console.error('Error adding image to PDF:', error);
            }
        }
    }

    pdf.save('sticker-pack.pdf');
}