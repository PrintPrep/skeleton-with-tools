// lib/booklet-imposition/store/useBookletStore.ts

import { create } from 'zustand';
import { BookletStore, WorkflowStep, ProcessingStatus } from '@/types/booklet-imposition/store.types';
import { PdfAnalysis, ImpositionResult, SheetPreview } from '@/types/booklet-imposition/pdf.types';
import { BookletSettings } from '@/types/booklet-imposition/settings.types';
import { DEFAULT_SETTINGS } from '@/lib/booklet-imposition/constants';
import { createBlobUrl, revokeBlobUrl } from '@/lib/booklet-imposition/utils';

/**
 * Initial state
 */
const initialState = {
    currentStep: 1 as WorkflowStep,
    uploadedFile: null,
    uploadedFileUrl: null,
    analysis: null,
    settings: DEFAULT_SETTINGS,
    impositionResult: null,
    processedPdf: null,
    processedPdfUrl: null,
    previews: [],
    processingStatus: 'idle' as ProcessingStatus,
    errorMessage: null,
};

/**
 * Booklet Imposition Store
 * Manages global state for the entire application workflow
 */
export const useBookletStore = create<BookletStore>((set, get) => ({
    ...initialState,

    // Navigation actions
    setStep: (step: WorkflowStep) => {
        set({ currentStep: step });
    },

    nextStep: () => {
        const currentStep = get().currentStep;
        if (currentStep < 5) {
            set({ currentStep: (currentStep + 1) as WorkflowStep });
        }
    },

    previousStep: () => {
        const currentStep = get().currentStep;
        if (currentStep > 1) {
            set({ currentStep: (currentStep - 1) as WorkflowStep });
        }
    },

    reset: () => {
        const state = get();

        // Revoke any blob URLs to free memory
        if (state.uploadedFileUrl) {
            revokeBlobUrl(state.uploadedFileUrl);
        }
        if (state.processedPdfUrl) {
            revokeBlobUrl(state.processedPdfUrl);
        }
        state.previews.forEach(preview => {
            if (preview.thumbnailUrl) {
                revokeBlobUrl(preview.thumbnailUrl);
            }
        });

        set(initialState);
    },

    // File operations
    uploadFile: (file: File) => {
        const state = get();

        // Revoke previous file URL if exists
        if (state.uploadedFileUrl) {
            revokeBlobUrl(state.uploadedFileUrl);
        }

        // Create new blob URL for the file
        const fileUrl = URL.createObjectURL(file);

        set({
            uploadedFile: file,
            uploadedFileUrl: fileUrl,
            errorMessage: null,
        });
    },

    clearFile: () => {
        const state = get();

        if (state.uploadedFileUrl) {
            revokeBlobUrl(state.uploadedFileUrl);
        }

        set({
            uploadedFile: null,
            uploadedFileUrl: null,
            analysis: null,
            impositionResult: null,
            processedPdf: null,
            processedPdfUrl: null,
            previews: [],
        });
    },

    // Analysis
    setAnalysis: (analysis: PdfAnalysis) => {
        set({ analysis });
    },

    // Settings
    updateSettings: (newSettings: Partial<BookletSettings>) => {
        const currentSettings = get().settings;
        set({
            settings: {
                ...currentSettings,
                ...newSettings,
            },
        });
    },

    // Processing
    setProcessingStatus: (status: ProcessingStatus) => {
        set({ processingStatus: status });
    },

    setImpositionResult: (result: ImpositionResult) => {
        set({ impositionResult: result });
    },

    setProcessedPdf: (pdf: Uint8Array) => {
        const state = get();

        // Revoke previous PDF URL if exists
        if (state.processedPdfUrl) {
            revokeBlobUrl(state.processedPdfUrl);
        }

        // Create new blob URL for the processed PDF
        const pdfUrl = createBlobUrl(pdf, 'application/pdf');

        set({
            processedPdf: pdf,
            processedPdfUrl: pdfUrl,
        });
    },

    setPreviews: (previews: SheetPreview[]) => {
        const state = get();

        // Revoke previous preview URLs
        state.previews.forEach(preview => {
            if (preview.thumbnailUrl) {
                revokeBlobUrl(preview.thumbnailUrl);
            }
        });

        set({ previews });
    },

    // Error handling
    setError: (error: string | null) => {
        set({
            errorMessage: error,
            processingStatus: error ? 'error' : get().processingStatus,
        });
    },
}));