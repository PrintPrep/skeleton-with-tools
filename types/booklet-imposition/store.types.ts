// types/booklet-imposition/store.types.ts

import { PdfAnalysis, ImpositionResult, SheetPreview } from './pdf.types';
import { BookletSettings } from './settings.types';

/**
 * Application workflow steps
 */
export type WorkflowStep = 1 | 2 | 3 | 4 | 5;

/**
 * Processing status
 */
export type ProcessingStatus = 'idle' | 'analyzing' | 'processing' | 'generating_preview' | 'complete' | 'error';

/**
 * Main application state
 */
export interface BookletState {
    // Current workflow step
    currentStep: WorkflowStep;

    // File data
    uploadedFile: File | null;
    uploadedFileUrl: string | null; // Object URL for the file

    // Analysis results
    analysis: PdfAnalysis | null;

    // User settings
    settings: BookletSettings;

    // Processing results
    impositionResult: ImpositionResult | null;
    processedPdf: Uint8Array | null;
    processedPdfUrl: string | null; // Blob URL for download

    // Preview data
    previews: SheetPreview[];

    // UI state
    processingStatus: ProcessingStatus;
    errorMessage: string | null;
}

/**
 * Store actions
 */
export interface BookletActions {
    // Navigation
    setStep: (step: WorkflowStep) => void;
    nextStep: () => void;
    previousStep: () => void;
    reset: () => void;

    // File operations
    uploadFile: (file: File) => void;
    clearFile: () => void;

    // Analysis
    setAnalysis: (analysis: PdfAnalysis) => void;

    // Settings
    updateSettings: (settings: Partial<BookletSettings>) => void;

    // Processing
    setProcessingStatus: (status: ProcessingStatus) => void;
    setImpositionResult: (result: ImpositionResult) => void;
    setProcessedPdf: (pdf: Uint8Array) => void;
    setPreviews: (previews: SheetPreview[]) => void;

    // Error handling
    setError: (error: string | null) => void;
}

/**
 * Complete store type (state + actions)
 */
export type BookletStore = BookletState & BookletActions;
