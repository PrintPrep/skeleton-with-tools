// types/booklet-imposition/settings.types.ts

/**
 * Available paper size formats
 */
export type PaperSize = 'A4_to_A5' | 'Letter_to_Half' | 'A3_to_A4' | 'Legal_to_Half';

/**
 * Duplex printing modes
 */
export type DuplexMode = 'long_edge' | 'short_edge';

/**
 * Margin preset options
 */
export type MarginPreset = 'none' | 'minimal' | 'standard' | 'wide';

/**
 * Paper size dimensions in points (1 point = 1/72 inch)
 */
export interface PaperDimensions {
    width: number;
    height: number;
    name: string;
}

/**
 * Margin configuration
 */
export interface Margins {
    top: number;
    bottom: number;
    left: number;
    right: number;
    gutter: number; // Extra space for binding
}

/**
 * Blank page indicator style
 */
export type BlankPageStyle = 'x' | 'subtle' | 'none';

/**
 * Complete user settings for booklet creation
 */
export interface BookletSettings {
    paperSize: PaperSize;
    duplexMode: DuplexMode;
    marginPreset: MarginPreset;
    margins: Margins;
    addBlankPages: boolean; // Manually add blank pages
    scaleToFit: boolean; // Scale pages to fit sheet
    blankPageStyle: BlankPageStyle; // How to show blank pages
}