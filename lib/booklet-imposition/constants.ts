// lib/booklet-imposition/constants.ts

import { PaperSize, MarginPreset, Margins, PaperDimensions, BookletSettings } from '@/types/booklet-imposition/settings.types';

/**
 * Paper size dimensions in points (72 points = 1 inch)
 */
export const PAPER_SIZES: Record<PaperSize, { input: PaperDimensions; output: PaperDimensions }> = {
    A4_to_A5: {
        input: { width: 595, height: 842, name: 'A4' },
        output: { width: 420, height: 595, name: 'A5' },
    },
    Letter_to_Half: {
        input: { width: 612, height: 792, name: 'Letter' },
        output: { width: 396, height: 612, name: 'Half Letter' },
    },
    A3_to_A4: {
        input: { width: 842, height: 1191, name: 'A3' },
        output: { width: 595, height: 842, name: 'A4' },
    },
    Legal_to_Half: {
        input: { width: 612, height: 1008, name: 'Legal' },
        output: { width: 396, height: 612, name: 'Half Legal' },
    },
};

/**
 * Margin presets in points
 */
export const MARGIN_PRESETS: Record<MarginPreset, Margins> = {
    none: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        gutter: 0,
    },
    minimal: {
        top: 18, // 0.25 inch
        bottom: 18,
        left: 18,
        right: 18,
        gutter: 36, // 0.5 inch
    },
    standard: {
        top: 36, // 0.5 inch
        bottom: 36,
        left: 36,
        right: 36,
        gutter: 54, // 0.75 inch
    },
    wide: {
        top: 54, // 0.75 inch
        bottom: 54,
        left: 54,
        right: 54,
        gutter: 72, // 1 inch
    },
};

/**
 * Default booklet settings
 */
export const DEFAULT_SETTINGS: BookletSettings = {
    paperSize: 'A4_to_A5',
    duplexMode: 'long_edge',
    marginPreset: 'standard',
    margins: MARGIN_PRESETS.standard,
    addBlankPages: true,
    scaleToFit: true,
    blankPageStyle: 'subtle',
};

/**
 * Duplex mode descriptions
 */
export const DUPLEX_MODE_DESCRIPTIONS = {
    long_edge: {
        title: 'Flip on Long Edge',
        description: 'Pages flip along the long edge (typical for portrait booklets)',
        icon: '📖',
    },
    short_edge: {
        title: 'Flip on Short Edge',
        description: 'Pages flip along the short edge (typical for landscape booklets)',
        icon: '📔',
    },
};

/**
 * Paper size descriptions
 */
export const PAPER_SIZE_DESCRIPTIONS: Record<PaperSize, string> = {
    A4_to_A5: 'A4 sheets → A5 booklet (210 × 148 mm)',
    Letter_to_Half: 'Letter sheets → Half Letter booklet (8.5 × 5.5 in)',
    A3_to_A4: 'A3 sheets → A4 booklet (297 × 210 mm)',
    Legal_to_Half: 'Legal sheets → Half Legal booklet (8.5 × 7 in)',
};

/**
 * Margin preset descriptions
 */
export const MARGIN_PRESET_DESCRIPTIONS: Record<MarginPreset, string> = {
    none: 'No margins (edge-to-edge printing)',
    minimal: 'Minimal margins (0.25" + 0.5" gutter)',
    standard: 'Standard margins (0.5" + 0.75" gutter)',
    wide: 'Wide margins (0.75" + 1" gutter)',
};

/**
 * Blank page style descriptions
 */
export const BLANK_PAGE_STYLE_DESCRIPTIONS = {
    x: {
        title: 'X Mark',
        description: 'Show large X on blank pages (for debugging)',
    },
    subtle: {
        title: 'Subtle Border',
        description: 'Light border only (recommended)',
    },
    none: {
        title: 'Completely Blank',
        description: 'No indicator (cleanest look)',
    },
};

/**
 * Maximum file size for uploads (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Accepted file types
 */
export const ACCEPTED_FILE_TYPES = ['application/pdf'];

/**
 * Preview thumbnail dimensions
 */
export const PREVIEW_THUMBNAIL = {
    width: 300,
    height: 400,
    quality: 0.8,
};