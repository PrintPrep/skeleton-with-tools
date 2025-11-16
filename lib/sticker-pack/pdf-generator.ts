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
                    // Save the current state
                    pdf.saveGraphicsState();

                    // Translate and rotate
                    const centerX = sticker.x + sticker.width / 2;
                    const centerY = sticker.y + sticker.height / 2;

                    pdf.translate(centerX, centerY);
                    pdf.rotate(90);
                    pdf.translate(-sticker.height / 2, -sticker.width / 2);

                    pdf.addImage(
                        imgData,
                        'JPEG',
                        0,
                        0,
                        sticker.height,
                        sticker.width,
                        undefined,
                        'FAST'
                    );

                    pdf.restoreGraphicsState();
                } else {
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