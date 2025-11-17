// components/tools/booklet-imposition/steps/StepAnalysis.tsx

import React, { useEffect, useState } from 'react';
import { useBookletStore } from '@/lib/booklet-imposition/store/useBookletStore';
import { Button } from '@/components/ui/booklet-imposition/Button';
import { Card } from '@/components/ui/booklet-imposition/Card';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { ArrowRight, ArrowLeft, FileText, Layers, AlertCircle } from 'lucide-react';
import { pointsToMm } from '@/lib/booklet-imposition/utils';

export function StepAnalysis() {
    const {
        uploadedFile,
        analysis,
        setAnalysis,
        setProcessingStatus,
        setError,
        nextStep,
        previousStep,
    } = useBookletStore();

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (uploadedFile && !analysis) {
            analyzeFile();
        }
    }, [uploadedFile, analysis]);

    const analyzeFile = async () => {
        if (!uploadedFile) return;

        setIsAnalyzing(true);
        setProcessingStatus('analyzing');
        setError(null);

        try {
            // Read file as ArrayBuffer
            const arrayBuffer = await uploadedFile.arrayBuffer();

            // Call the analyze API
            const response = await fetch('/api/booklet-imposition/analyze', {
                method: 'POST',
                body: arrayBuffer,
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze PDF');
            }

            const result = await response.json();
            setAnalysis(result.data);
            setProcessingStatus('idle');
        } catch (error) {
            console.error('Analysis error:', error);
            setError(error instanceof Error ? error.message : 'Failed to analyze PDF');
            setProcessingStatus('error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isAnalyzing) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Analyzing PDF...
                        </h3>
                        <p className="text-gray-600">
                            Reading page information and dimensions
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="max-w-2xl mx-auto">
                <Alert type="error" title="Analysis Failed">
                    Unable to analyze the PDF. Please try uploading the file again.
                </Alert>
                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={previousStep}>
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Back
                    </Button>
                    <Button onClick={analyzeFile}>Retry Analysis</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    PDF Analysis
                </h2>
                <p className="text-gray-600">
                    Review your document information
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                    <FileText className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {analysis.totalPages}
                    </p>
                    <p className="text-sm text-gray-600">Total Pages</p>
                </Card>

                <Card className="text-center">
                    <Layers className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {analysis.dominantOrientation}
                    </p>
                    <p className="text-sm text-gray-600">Orientation</p>
                </Card>

                <Card className="text-center">
                    <AlertCircle className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {analysis.hasConsistentSize ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm text-gray-600">Consistent Size</p>
                </Card>
            </div>

            <Card title="Document Details">
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Average Page Size</span>
                        <span className="text-gray-900">
              {Math.round(pointsToMm(analysis.averageWidth))} × {Math.round(pointsToMm(analysis.averageHeight))} mm
            </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Dominant Orientation</span>
                        <span className="text-gray-900 capitalize">{analysis.dominantOrientation}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700 font-medium">Pages Have Consistent Size</span>
                        <span className="text-gray-900">
              {analysis.hasConsistentSize ? 'Yes' : 'No'}
            </span>
                    </div>
                </div>
            </Card>

            {analysis.needsBlankPage && (
                <Alert type="info" title="Blank Page Required">
                    Your document has an odd number of pages ({analysis.totalPages}).
                    A blank page will be automatically added to complete the booklet.
                </Alert>
            )}

            {!analysis.hasConsistentSize && (
                <Alert type="warning" title="Mixed Page Sizes">
                    Your document contains pages of different sizes. The imposition will
                    use the average size, but some pages may not fit perfectly.
                </Alert>
            )}

            <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                </Button>
                <Button size="lg" onClick={nextStep}>
                    Continue to Settings
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}