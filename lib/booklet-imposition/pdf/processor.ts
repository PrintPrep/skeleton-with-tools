// lib/booklet-imposition/pdf/processor.ts

import { PDFDocument, PageSizes, rgb, degrees } from 'pdf-lib';
import { ImpositionResult } from '@/types/booklet-imposition/pdf.types';
import { BookletSettings, PaperSize } from '@/types/booklet-imposition/settings.types';
import { PAPER_SIZES } from '@/lib/booklet-imposition/constants';
import { calculateScaleFactor } from '@/lib/booklet-imposition/utils';

/**
 * Processes a PDF and creates an imposed booklet
 *
 * @param originalPdfBuffer - The original PDF file buffer
 * @param impositionResult - The calculated imposition layout
 * @param settings - User settings for the booklet
 * @returns The processed PDF as a Uint8Array
 */
export async function processPdf(
    originalPdfBuffer: ArrayBuffer,
    impositionResult: ImpositionResult,
    settings: BookletSettings
): Promise<Uint8Array> {
    try {
        // Load the original PDF
        const originalPdf = await PDFDocument.load(originalPdfBuffer);

        // Create a new PDF for the output
        const outputPdf = await PDFDocument.create();

        // Get paper dimensions
        const paperConfig = PAPER_SIZES[settings.paperSize];
        const outputPageWidth = paperConfig.output.width * 2; // Two pages side-by-side
        const outputPageHeight = paperConfig.output.height;

        // Calculate available space for each page after margins
        const { margins } = settings;
        const leftPageWidth = paperConfig.output.width - margins.left - margins.gutter / 2;
        const rightPageWidth = paperConfig.output.width - margins.right - margins.gutter / 2;
        const pageHeight = outputPageHeight - margins.top - margins.bottom;

        // Process each spread
        for (const spread of impositionResult.spreads) {
            // Create a new page in the output PDF
            const outputPage = outputPdf.addPage([outputPageWidth, outputPageHeight]);

            // Draw left page
            if (spread.leftPage !== null) {
                await embedPageOnSheet(
                    originalPdf,
                    outputPage,
                    spread.leftPage - 1, // Convert to 0-indexed
                    margins.left,
                    margins.bottom,
                    leftPageWidth,
                    pageHeight,
                    settings
                );
            } else {
                // Draw blank page indicator
                drawBlankPagePlaceholder(
                    outputPage,
                    margins.left,
                    margins.bottom,
                    leftPageWidth,
                    pageHeight,
                    settings.blankPageStyle
                );
            }

            // Draw right page
            if (spread.rightPage !== null) {
                await embedPageOnSheet(
                    originalPdf,
                    outputPage,
                    spread.rightPage - 1, // Convert to 0-indexed
                    paperConfig.output.width + margins.gutter / 2,
                    margins.bottom,
                    rightPageWidth,
                    pageHeight,
                    settings
                );
            } else {
                // Draw blank page indicator
                drawBlankPagePlaceholder(
                    outputPage,
                    paperConfig.output.width + margins.gutter / 2,
                    margins.bottom,
                    rightPageWidth,
                    pageHeight,
                    settings.blankPageStyle
                );
            }
        }

        // Serialize the PDF to bytes
        const pdfBytes = await outputPdf.save();
        return pdfBytes;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw new Error('Failed to process PDF. Please try again.');
    }
}

/**
 * Embeds a page from the original PDF onto the output sheet
 */
async function embedPageOnSheet(
    originalPdf: PDFDocument,
    outputPage: any,
    pageIndex: number,
    x: number,
    y: number,
    targetWidth: number,
    targetHeight: number,
    settings: BookletSettings
): Promise<void> {
    try {
        // Get the original page
        const [embeddedPage] = await outputPage.doc.embedPdf(originalPdf, [pageIndex]);

        // Get original page dimensions
        const { width: originalWidth, height: originalHeight } = embeddedPage;

        // Calculate scale factor
        let scale = 1;
        if (settings.scaleToFit) {
            scale = calculateScaleFactor(
                originalWidth,
                originalHeight,
                targetWidth,
                targetHeight
            );
        }

        const scaledWidth = originalWidth * scale;
        const scaledHeight = originalHeight * scale;

        // Center the page in the available space
        const xOffset = x + (targetWidth - scaledWidth) / 2;
        const yOffset = y + (targetHeight - scaledHeight) / 2;

        // Draw the embedded page
        outputPage.drawPage(embeddedPage, {
            x: xOffset,
            y: yOffset,
            width: scaledWidth,
            height: scaledHeight,
        });
    } catch (error) {
        console.error('Error embedding page:', error);
        // Draw error placeholder
        drawErrorPlaceholder(outputPage, x, y, targetWidth, targetHeight);
    }
}

/**
 * Draws a placeholder for blank pages
 * Options: 'x', 'subtle', 'none'
 */
function drawBlankPagePlaceholder(
    page: any,
    x: number,
    y: number,
    width: number,
    height: number,
    style: 'x' | 'subtle' | 'none' = 'subtle' // Changed default to 'subtle'
): void {
    if (style === 'none') {
        // Completely blank - do nothing
        return;
    }

    if (style === 'subtle') {
        // Just a light border, no X
        page.drawRectangle({
            x,
            y,
            width,
            height,
            borderColor: rgb(0.95, 0.95, 0.95), // Very light gray
            borderWidth: 0.5,
        });
        return;
    }

    if (style === 'x') {
        // Original style with big X
        page.drawRectangle({
            x,
            y,
            width,
            height,
            borderColor: rgb(0.8, 0.8, 0.8),
            borderWidth: 1,
        });

        // Draw diagonal lines
        page.drawLine({
            start: { x, y },
            end: { x: x + width, y: y + height },
            color: rgb(0.9, 0.9, 0.9),
            thickness: 0.5,
        });

        page.drawLine({
            start: { x: x + width, y },
            end: { x, y: y + height },
            color: rgb(0.9, 0.9, 0.9),
            thickness: 0.5,
        });
    }
}

/**
 * Draws an error placeholder
 */
function drawErrorPlaceholder(
    page: any,
    x: number,
    y: number,
    width: number,
    height: number
): void {
    page.drawRectangle({
        x,
        y,
        width,
        height,
        color: rgb(1, 0.9, 0.9),
        borderColor: rgb(1, 0, 0),
        borderWidth: 2,
    });
}

/**
 * Validates that a PDF can be processed
 */
export async function validatePdfForProcessing(
    pdfBuffer: ArrayBuffer
): Promise<{ valid: boolean; error?: string }> {
    try {
        const pdf = await PDFDocument.load(pdfBuffer);
        const pageCount = pdf.getPageCount();

        if (pageCount === 0) {
            return { valid: false, error: 'PDF has no pages' };
        }

        if (pageCount > 1000) {
            return { valid: false, error: 'PDF has too many pages (maximum 1000)' };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Invalid PDF file' };
    }
}