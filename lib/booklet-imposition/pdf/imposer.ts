// lib/booklet-imposition/pdf/imposer.ts

import { ImpositionResult, PagePair } from '@/types/booklet-imposition/pdf.types';
import { DuplexMode } from '@/types/booklet-imposition/settings.types';

/**
 * Calculates the page imposition for booklet printing
 *
 * Algorithm explanation:
 * For a booklet, pages are arranged so that when printed double-sided and folded,
 * they appear in the correct order.
 *
 * For an 8-page booklet:
 * Sheet 1 Front: [8, 1]  Back: [2, 7]
 * Sheet 2 Front: [6, 3]  Back: [4, 5]
 *
 * The pattern: pair first with last, second with second-last, etc.
 *
 * @param totalPages - Total number of pages in the original PDF
 * @param duplexMode - Duplex printing mode (affects rotation)
 * @returns Imposition result with page pairs and sheet information
 */
export function calculateImposition(
    totalPages: number,
    duplexMode: DuplexMode = 'long_edge'
): ImpositionResult {
    // Ensure we have a multiple of 4 pages (required for booklet folding)
    const blanksNeeded = totalPages % 4 === 0 ? 0 : 4 - (totalPages % 4);
    const adjustedTotalPages = totalPages + blanksNeeded;

    // Calculate total sheets needed (each sheet has 2 pages per side = 4 pages total)
    const totalSheets = adjustedTotalPages / 4;

    const spreads: PagePair[] = [];

    // Generate page pairs
    // We work from outside to inside: last+first, second-last+second, etc.
    for (let sheet = 0; sheet < totalSheets; sheet++) {
        // Front side of the sheet
        const frontLeft = adjustedTotalPages - (sheet * 2);
        const frontRight = (sheet * 2) + 1;

        spreads.push({
            leftPage: frontLeft > totalPages ? null : frontLeft,
            rightPage: frontRight > totalPages ? null : frontRight,
            sheetNumber: sheet + 1,
            isBackSide: false,
        });

        // Back side of the sheet
        const backLeft = (sheet * 2) + 2;
        const backRight = adjustedTotalPages - (sheet * 2) - 1;

        spreads.push({
            leftPage: backLeft > totalPages ? null : backLeft,
            rightPage: backRight > totalPages ? null : backRight,
            sheetNumber: sheet + 1,
            isBackSide: true,
        });
    }

    return {
        spreads,
        totalSheets,
        blanksAdded: blanksNeeded,
    };
}

/**
 * Calculates page pairs for simple duplex (non-booklet) printing
 * Used for testing or alternative layouts
 */
export function calculateSimpleDuplex(totalPages: number): ImpositionResult {
    const blanksNeeded = totalPages % 2 === 0 ? 0 : 1;
    const adjustedTotalPages = totalPages + blanksNeeded;
    const totalSheets = adjustedTotalPages / 2;

    const spreads: PagePair[] = [];

    for (let i = 0; i < adjustedTotalPages; i += 2) {
        const sheetNumber = Math.floor(i / 2) + 1;

        // Front
        spreads.push({
            leftPage: null,
            rightPage: i + 1 > totalPages ? null : i + 1,
            sheetNumber,
            isBackSide: false,
        });

        // Back
        spreads.push({
            leftPage: i + 2 > totalPages ? null : i + 2,
            rightPage: null,
            sheetNumber,
            isBackSide: true,
        });
    }

    return {
        spreads,
        totalSheets,
        blanksAdded: blanksNeeded,
    };
}

/**
 * Validates an imposition result
 * Checks that all page numbers are accounted for correctly
 */
export function validateImposition(
    result: ImpositionResult,
    originalPageCount: number
): boolean {
    const pageNumbers = new Set<number>();

    result.spreads.forEach(spread => {
        if (spread.leftPage !== null) {
            pageNumbers.add(spread.leftPage);
        }
        if (spread.rightPage !== null) {
            pageNumbers.add(spread.rightPage);
        }
    });

    // Check that we have all pages from 1 to originalPageCount
    for (let i = 1; i <= originalPageCount; i++) {
        if (!pageNumbers.has(i)) {
            return false;
        }
    }

    // Check that we don't have any invalid page numbers
    for (const pageNum of pageNumbers) {
        if (pageNum < 1 || pageNum > originalPageCount) {
            return false;
        }
    }

    return true;
}

/**
 * Gets a human-readable description of the imposition
 */
export function getImpositionDescription(result: ImpositionResult): string {
    const { totalSheets, blanksAdded } = result;

    let description = `Your booklet will use ${totalSheets} sheet${totalSheets === 1 ? '' : 's'} of paper.`;

    if (blanksAdded > 0) {
        description += ` ${blanksAdded} blank page${blanksAdded === 1 ? '' : 's'} will be added to complete the booklet.`;
    }

    return description;
}