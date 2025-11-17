// lib/booklet-imposition/utils.ts

import { type ClassValue, clsx } from 'clsx';

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate if file is a PDF
 */
export function isPdfFile(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Convert points to inches
 */
export function pointsToInches(points: number): number {
    return points / 72;
}

/**
 * Convert inches to points
 */
export function inchesToPoints(inches: number): number {
    return inches * 72;
}

/**
 * Convert points to millimeters
 */
export function pointsToMm(points: number): number {
    return (points / 72) * 25.4;
}

/**
 * Convert millimeters to points
 */
export function mmToPoints(mm: number): number {
    return (mm / 25.4) * 72;
}

/**
 * Calculate scaling factor to fit content within dimensions
 */
export function calculateScaleFactor(
    contentWidth: number,
    contentHeight: number,
    targetWidth: number,
    targetHeight: number
): number {
    const widthRatio = targetWidth / contentWidth;
    const heightRatio = targetHeight / contentHeight;

    // Use smaller ratio to ensure content fits
    return Math.min(widthRatio, heightRatio);
}

/**
 * Create a blob URL from Uint8Array
 */
export function createBlobUrl(data: Uint8Array, type: string = 'application/pdf'): string {
    const blob = new Blob([data], { type });
    return URL.createObjectURL(blob);
}

/**
 * Revoke blob URL
 */
export function revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * Download file from blob URL
 */
export function downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Generate filename for output PDF
 */
export function generateOutputFilename(originalFilename: string): string {
    const nameWithoutExt = originalFilename.replace(/\.pdf$/i, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    return `${nameWithoutExt}_booklet_${timestamp}.pdf`;
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if number is even
 */
export function isEven(num: number): boolean {
    return num % 2 === 0;
}

/**
 * Check if number is odd
 */
export function isOdd(num: number): boolean {
    return num % 2 !== 0;
}

/**
 * Round to decimal places
 */
export function roundTo(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}