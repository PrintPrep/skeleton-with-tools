// components/tools/booklet-imposition/steps/StepPreview.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useBookletStore } from '@/lib/booklet-imposition/store/useBookletStore';
import { Button } from '@/components/ui/booklet-imposition/Button';
import { Card } from '@/components/ui/booklet-imposition/Card';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { calculateImposition } from '@/lib/booklet-imposition/pdf/imposer';

export function StepPreview() {
    const {
        uploadedFile,
        analysis,
        settings,
        processedPdf,
        impositionResult,
        setProcessedPdf,
        setImpositionResult,
        setProcessingStatus,
        setError,
        nextStep,
        previousStep,
    } = useBookletStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState('');

    useEffect(() => {
        if (!processedPdf && uploadedFile && analysis) {
            processFileServerSide();
        }
    }, [processedPdf, uploadedFile, analysis]);

    const processFileServerSide = async () => {
        if (!uploadedFile || !analysis) return;

        setIsProcessing(true);
        setProcessingStatus('processing');
        setError(null);
        setProgress('Calculating page layout...');

        try {
            // Calculate imposition client-side (lightweight)
            const imposition = calculateImposition(analysis.totalPages, settings.duplexMode);
            setImpositionResult(imposition);

            setProgress('Uploading PDF to server...');

            // Prepare FormData for server
            const formData = new FormData();
            formData.append('pdf', uploadedFile);
            formData.append('settings', JSON.stringify(settings));

            setProgress('Processing PDF on server...');

            // Call server-side API
            const response = await fetch('/api/booklet-imposition/process-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server processing failed');
            }

            setProgress('Downloading processed PDF...');

            // Get processed PDF as ArrayBuffer
            const pdfArrayBuffer = await response.arrayBuffer();
            const pdfBytes = new Uint8Array(pdfArrayBuffer);

            // Extract metadata from headers
            const totalSheets = response.headers.get('X-Total-Sheets');
            const blanksAdded = response.headers.get('X-Blanks-Added');

            console.log(`Processed PDF received: ${pdfBytes.length} bytes`);
            console.log(`Sheets: ${totalSheets}, Blanks: ${blanksAdded}`);

            // Store processed PDF
            setProcessedPdf(pdfBytes);
            setProcessingStatus('complete');
            setProgress('');

        } catch (error) {
            console.error('Server-side processing error:', error);
            setError(error instanceof Error ? error.message : 'Failed to process PDF on server');
            setProcessingStatus('error');
            setProgress('');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isProcessing) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-16 h-16 text-primary-600 animate-spin mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Processing PDF...
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {progress || 'Please wait while we process your booklet'}
                        </p>
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full animate-pulse"
                                 style={{ width: '60%' }} />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!processedPdf || !impositionResult) {
        return (
            <div className="max-w-2xl mx-auto">
                <Alert type="error" title="Processing Failed">
                    Unable to process the PDF. Please try again or adjust your settings.
                </Alert>
                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={previousStep}>
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Back to Settings
                    </Button>
                    <Button onClick={processFileServerSide}>Retry Processing</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Preview Your Booklet
                </h2>
                <p className="text-gray-600">
                    Your booklet has been processed successfully
                </p>
            </div>

            <Card>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Total Sheets</span>
                        <span className="text-gray-900 font-semibold">
                            {impositionResult.totalSheets}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Blank Pages Added</span>
                        <span className="text-gray-900 font-semibold">
                            {impositionResult.blanksAdded}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Total Spreads</span>
                        <span className="text-gray-900 font-semibold">
                            {impositionResult.spreads.length}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700 font-medium">PDF Size</span>
                        <span className="text-gray-900 font-semibold">
                            {(processedPdf.length / 1024 / 1024).toFixed(2)} MB
                        </span>
                    </div>
                </div>
            </Card>

            <Alert type="info" title="Preview Generation (Coming Soon...)">
                Previews have been disabled to improve reliability. Your PDF has been successfully
                processed and is ready to download.
            </Alert>

            <Alert type="success" title="Processing Complete!">
                Your booklet has been successfully created. Click "Next" to download the file.
            </Alert>

            <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back to Settings
                </Button>
                <Button size="lg" onClick={nextStep}>
                    Download Booklet
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}