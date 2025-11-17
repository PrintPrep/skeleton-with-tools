// lib/booklet-imposition/pdf/renderer.ts

import * as pdfjsLib from 'pdfjs-dist';
import { SheetPreview } from '@/types/booklet-imposition/pdf.types';
import { PREVIEW_THUMBNAIL } from '@/lib/booklet-imposition/constants';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Generates preview thumbnails for an imposed PDF
 *
 * @param pdfBuffer - The imposed PDF buffer
 * @param totalSheets - Total number of sheets in the booklet
 * @returns Array of preview data with thumbnail URLs
 */
export async function generatePreviews(
    pdfBuffer: Uint8Array,
    totalSheets: number
): Promise<SheetPreview[]> {
    try {
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
        const pdf = await loadingTask.promise;

        const previews: SheetPreview[] = [];

        // Generate thumbnail for each page (each page is one spread)
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const thumbnailUrl = await renderPageToImage(page);

            // Determine which pages are on this spread
            // This is a simplified version - in a real implementation,
            // you'd track this from the imposition result
            const sheetNumber = Math.ceil(pageNum / 2);

            previews.push({
                sheetNumber,
                thumbnailUrl,
                leftPageNumber: null, // Would be populated from imposition data
                rightPageNumber: null, // Would be populated from imposition data
            });
        }

        return previews;
    } catch (error) {
        console.error('Error generating previews:', error);
        throw new Error('Failed to generate preview images');
    }
}

/**
 * Renders a single PDF page to an image
 */
async function renderPageToImage(page: any): Promise<string> {
    const viewport = page.getViewport({ scale: 1.0 });

    // Calculate scale to fit thumbnail size
    const scale = Math.min(
        PREVIEW_THUMBNAIL.width / viewport.width,
        PREVIEW_THUMBNAIL.height / viewport.height
    );

    const scaledViewport = page.getViewport({ scale });

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Could not get canvas context');
    }

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // Render PDF page to canvas
    const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to data URL
    return canvas.toDataURL('image/jpeg', PREVIEW_THUMBNAIL.quality);
}

/**
 * Generates a preview for a single page from the original PDF
 * Used for the analysis step to show the original pages
 */
export async function generateOriginalPagePreview(
    pdfBuffer: ArrayBuffer,
    pageNumber: number
): Promise<string> {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(pageNumber);

        return await renderPageToImage(page);
    } catch (error) {
        console.error('Error generating page preview:', error);
        throw new Error('Failed to generate page preview');
    }
}

/**
 * Generates preview thumbnails for multiple pages
 * Used to show a grid of original pages
 */
export async function generateMultiplePagePreviews(
    pdfBuffer: ArrayBuffer,
    pageNumbers: number[]
): Promise<Map<number, string>> {
    const previews = new Map<number, string>();

    try {
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
        const pdf = await loadingTask.promise;

        for (const pageNum of pageNumbers) {
            if (pageNum > 0 && pageNum <= pdf.numPages) {
                const page = await pdf.getPage(pageNum);
                const thumbnail = await renderPageToImage(page);
                previews.set(pageNum, thumbnail);
            }
        }

        return previews;
    } catch (error) {
        console.error('Error generating multiple previews:', error);
        throw new Error('Failed to generate page previews');
    }
}

/**
 * Gets page count from PDF buffer
 */
export async function getPageCount(pdfBuffer: Uint8Array): Promise<number> {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
        const pdf = await loadingTask.promise;
        return pdf.numPages;
    } catch (error) {
        console.error('Error getting page count:', error);
        return 0;
    }
}