// components/tools/booklet-imposition/steps/StepExport.tsx

import React from 'react';
import { useBookletStore } from '@/lib/booklet-imposition/store/useBookletStore';
import { Button } from '@/components/ui/booklet-imposition/Button';
import { Card } from '@/components/ui/booklet-imposition/Card';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { Download, RotateCcw, CheckCircle, FileText, Printer } from 'lucide-react';
import { downloadFile, generateOutputFilename } from '@/lib/booklet-imposition/utils';

export function StepExport() {
    const {
        uploadedFile,
        processedPdfUrl,
        impositionResult,
        settings,
        reset,
    } = useBookletStore();

    const handleDownload = () => {
        if (processedPdfUrl && uploadedFile) {
            const filename = generateOutputFilename(uploadedFile.name);
            downloadFile(processedPdfUrl, filename);
        }
    };

    const handleStartOver = () => {
        if (confirm('Are you sure you want to start over? This will clear all your work.')) {
            reset();
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-primary-500 rounded-2xl mb-4 shadow-xl shadow-green-500/30">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Booklet Ready!
                </h2>
                <p className="text-gray-600">
                    Your booklet has been successfully created
                </p>
            </div>

            <Card title="Download Your Booklet">
                <div className="space-y-6">
                    <div className="flex items-center justify-center">
                        <Button
                            size="lg"
                            onClick={handleDownload}
                            className="min-w-[250px]"
                        >
                            <Download className="mr-2 w-5 h-5" />
                            Download PDF
                        </Button>
                    </div>

                    {uploadedFile && (
                        <div className="text-center text-sm text-gray-600">
                            Filename: {generateOutputFilename(uploadedFile.name)}
                        </div>
                    )}
                </div>
            </Card>

            {impositionResult && (
                <Card title="Printing Instructions">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Printer className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900 mb-1">1. Print Settings</p>
                                <p className="text-sm text-gray-600">
                                    Print double-sided using{' '}
                                    <strong>
                                        {settings.duplexMode === 'long_edge' ? 'Flip on Long Edge' : 'Flip on Short Edge'}
                                    </strong>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900 mb-1">2. Paper Information</p>
                                <p className="text-sm text-gray-600">
                                    You will need <strong>{impositionResult.totalSheets} sheet(s)</strong> of paper
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <RotateCcw className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900 mb-1">3. Fold and Staple</p>
                                <p className="text-sm text-gray-600">
                                    After printing, fold all sheets in half and staple along the spine
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <Alert type="info" title="Printing Tips">
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Use the correct duplex mode in your printer settings</li>
                    <li>Print all pages in order (do not shuffle)</li>
                    <li>Fold carefully to ensure pages align properly</li>
                    <li>Consider using heavier paper stock for durability</li>
                </ul>
            </Alert>

            <div className="flex justify-center">
                <Button
                    variant="outline"
                    onClick={handleStartOver}
                    className="min-w-[200px]"
                >
                    <RotateCcw className="mr-2 w-5 h-5" />
                    Create Another Booklet
                </Button>
            </div>
        </div>
    );
}