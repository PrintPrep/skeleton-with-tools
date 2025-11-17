// types/booklet-imposition/pdf.types.ts

/**
 * Represents information about a single PDF page
 */
export interface PageInfo {
    pageNumber: number;
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
}

/**
 * Result of analyzing an uploaded PDF
 */
export interface PdfAnalysis {
    totalPages: number;
    pages: PageInfo[];
    needsBlankPage: boolean; // True if page count is odd
    hasConsistentSize: boolean; // True if all pages same size
    averageWidth: number;
    averageHeight: number;
    dominantOrientation: 'portrait' | 'landscape';
}

/**
 * Represents a pair of pages in an imposed spread
 */
export interface PagePair {
    leftPage: number | null; // null = blank page
    rightPage: number | null; // null = blank page
    sheetNumber: number;
    isBackSide: boolean;
}

/**
 * Result of the imposition calculation
 */
export interface ImpositionResult {
    spreads: PagePair[];
    totalSheets: number;
    blanksAdded: number;
}

/**
 * Preview data for a single imposed sheet
 */
export interface SheetPreview {
    sheetNumber: number;
    thumbnailUrl: string;
    leftPageNumber: number | null;
    rightPageNumber: number | null;
}