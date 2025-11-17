// lib/booklet-imposition/pdf/analyzer.ts

import { PDFDocument } from 'pdf-lib';
import { PdfAnalysis, PageInfo } from '@/types/booklet-imposition/pdf.types';

/**
 * Analyzes a PDF file and extracts metadata
 * @param fileBuffer - The PDF file as an ArrayBuffer
 * @returns Analysis results including page count, sizes, and orientations
 */
export async function analyzePdf(fileBuffer: ArrayBuffer): Promise<PdfAnalysis> {
    try {
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const pages = pdfDoc.getPages();
        const totalPages = pages.length;

        // Extract information for each page
        const pageInfos: PageInfo[] = pages.map((page, index) => {
            const { width, height } = page.getSize();
            const orientation = width > height ? 'landscape' : 'portrait';

            return {
                pageNumber: index + 1,
                width,
                height,
                orientation,
            };
        });

        // Calculate statistics
        const totalWidth = pageInfos.reduce((sum, page) => sum + page.width, 0);
        const totalHeight = pageInfos.reduce((sum, page) => sum + page.height, 0);
        const averageWidth = totalWidth / totalPages;
        const averageHeight = totalHeight / totalPages;

        // Check if all pages have consistent sizes (within 1 point tolerance)
        const hasConsistentSize = pageInfos.every(
            page =>
                Math.abs(page.width - averageWidth) < 1 &&
                Math.abs(page.height - averageHeight) < 1
        );

        // Determine dominant orientation
        const portraitCount = pageInfos.filter(p => p.orientation === 'portrait').length;
        const landscapeCount = totalPages - portraitCount;
        const dominantOrientation = portraitCount >= landscapeCount ? 'portrait' : 'landscape';

        // Check if blank page is needed (odd page count)
        const needsBlankPage = totalPages % 2 !== 0;

        return {
            totalPages,
            pages: pageInfos,
            needsBlankPage,
            hasConsistentSize,
            averageWidth,
            averageHeight,
            dominantOrientation,
        };
    } catch (error) {
        console.error('Error analyzing PDF:', error);
        throw new Error('Failed to analyze PDF. Please ensure the file is a valid PDF.');
    }
}

/**
 * Validates if a file is a valid PDF
 * @param fileBuffer - The file buffer to validate
 * @returns True if valid PDF, false otherwise
 */
export async function validatePdf(fileBuffer: ArrayBuffer): Promise<boolean> {
    try {
        await PDFDocument.load(fileBuffer);
        return true;
    } catch {
        return false;
    }
}

/**
 * Gets the PDF version string
 * @param fileBuffer - The PDF file buffer
 * @returns PDF version (e.g., "1.7")
 */
export async function getPdfVersion(fileBuffer: ArrayBuffer): Promise<string> {
    try {
        // Read the first 8 bytes to get the PDF header
        const header = new Uint8Array(fileBuffer.slice(0, 8));
        const headerString = new TextDecoder().decode(header);

        // Extract version from "%PDF-1.X" format
        const versionMatch = headerString.match(/%PDF-(\d+\.\d+)/);
        return versionMatch ? versionMatch[1] : 'Unknown';
    } catch {
        return 'Unknown';
    }
}