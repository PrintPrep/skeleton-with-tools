// lib/booklet-imposition/pdf/pdfjs-config.ts

/**
 * PDF.js Configuration for Next.js 15
 *
 * This file handles the proper initialization of PDF.js worker
 * to avoid module resolution issues in Next.js
 */

import * as pdfjsLib from 'pdfjs-dist';

let isConfigured = false;

// Use a specific version to ensure stability
const PDFJS_VERSION = '4.0.379';

/**
 * Initialize PDF.js worker
 * Call this before using any PDF.js functionality
 */
export function initializePdfJs(): void {
    if (typeof window === 'undefined' || isConfigured) {
        return;
    }

    // Use CDN for the worker with pinned version
    const workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    isConfigured = true;

    console.log('PDF.js initialized with worker:', workerSrc);
}

/**
 * Get the configured PDF.js library
 */
export function getPdfJs() {
    initializePdfJs();
    return pdfjsLib;
}

/**
 * Get the PDF.js version being used
 */
export function getPdfJsVersion(): string {
    return PDFJS_VERSION;
}

/**
 * Check if PDF.js is properly configured
 */
export function checkPdfJsConfig(): {
    isConfigured: boolean;
    version: string;
    workerSrc: string;
    issues: string[];
} {
    const issues: string[] = [];

    if (typeof window === 'undefined') {
        issues.push('Running on server side');
        return {
            isConfigured: false,
            version: PDFJS_VERSION,
            workerSrc: '',
            issues,
        };
    }

    const workerSrc = pdfjsLib.GlobalWorkerOptions.workerSrc;

    if (!workerSrc) {
        issues.push('Worker source not configured');
    }

    if (!workerSrc.includes(PDFJS_VERSION)) {
        issues.push(`Worker version mismatch (expected ${PDFJS_VERSION})`);
    }

    return {
        isConfigured: isConfigured && issues.length === 0,
        version: PDFJS_VERSION,
        workerSrc: workerSrc || '',
        issues,
    };
}

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
    initializePdfJs();
}