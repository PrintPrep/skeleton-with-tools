// components/tools/booklet-imposition/steps/StepPreview.tsx

import React, { useEffect, useState } from 'react';
import { useBookletStore } from '@/lib/booklet-imposition/store/useBookletStore';
import { Button } from '@/components/ui/booklet-imposition/Button';
import { Card } from '@/components/ui/booklet-imposition/Card';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { calculateImposition } from '@/lib/booklet-imposition/pdf/imposer';
import { processPdf } from '@/lib/booklet-imposition/pdf/processor';
import { generatePreviews } from '@/lib/booklet-imposition/pdf/renderer';

export function StepPreview() {
    const {
        uploadedFile,
        analysis,
        settings,
        processedPdf,
        impositionResult,
        previews,
        setProcessedPdf,
        setImpositionResult,
        setPreviews,
        setProcessingStatus,
        setError,
        nextStep,
        previousStep,
    } = useBookletStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isGeneratingPreviews, setIsGeneratingPreviews] = useState(false);

    useEffect(() => {
        if (!processedPdf && uploadedFile && analysis) {
            processFile();
        }
    }, [processedPdf, uploadedFile, analysis]);

    const processFile = async () => {
        if (!uploadedFile || !analysis) return;

        setIsProcessing(true);
        setProcessingStatus('processing');
        setError(null);

        try {
            // Calculate imposition
            const imposition = calculateImposition(analysis.totalPages, settings.duplexMode);
            setImpositionResult(imposition);

            // Read file as ArrayBuffer
            const arrayBuffer = await uploadedFile.arrayBuffer();

            // Process PDF locally (client-side)
            const processedPdfBytes = await processPdf(arrayBuffer, imposition, settings);
            setProcessedPdf(processedPdfBytes);

            setProcessingStatus('generating_preview');
            setIsGeneratingPreviews(true);

            // Generate previews
            try {
                const previewData = await generatePreviews(processedPdfBytes, imposition.totalSheets);
                setPreviews(previewData);
            } catch (previewError) {
                console.error('Preview generation failed:', previewError);
                // Continue even if preview fails
            }

            setProcessingStatus('complete');
        } catch (error) {
            console.error('Processing error:', error);
            setError(error instanceof Error ? error.message : 'Failed to process PDF');
            setProcessingStatus('error');
        } finally {
            setIsProcessing(false);
            setIsGeneratingPreviews(false);
        }
    };

    if (isProcessing) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {isGeneratingPreviews ? 'Generating Previews...' : 'Processing PDF...'}
                        </h3>
                        <p className="text-gray-600">
                            {isGeneratingPreviews
                                ? 'Creating thumbnail previews of your booklet'
                                : 'Creating imposed layout and arranging pages'}
                        </p>
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
                    <Button onClick={processFile}>Retry Processing</Button>
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
                    Review the imposed layout before downloading
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

                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700 font-medium">Total Spreads</span>
                        <span className="text-gray-900 font-semibold">
              {impositionResult.spreads.length}
            </span>
                    </div>
                </div>
            </Card>

            {previews.length > 0 ? (
                <Card title="Preview Thumbnails">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div
                                key={index}
                                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={preview.thumbnailUrl}
                                    alt={`Sheet ${preview.sheetNumber}`}
                                    className="w-full h-auto"
                                />
                                <div className="p-2 bg-gray-50 text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        Sheet {preview.sheetNumber}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ) : (
                <Alert type="info" title="Previews Not Available">
                    Preview generation was skipped. You can still download your processed booklet.
                </Alert>
            )}

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