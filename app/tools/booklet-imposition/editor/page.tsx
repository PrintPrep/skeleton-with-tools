// app/tools/booklet-imposition/editor/page.tsx

/*
export default function Booklet()  {
    return <h1>COMING SOON BRO...</h1>
}
*/

'use client';

import React from 'react';
import { useBookletStore } from '@/lib/booklet-imposition/store/useBookletStore';
import { ProgressBar } from '@/components/ui/booklet-imposition/ProgressBar';
import { StepUpload } from '@/components/tools/booklet-imposition/steps/StepUpload';
import { StepAnalysis } from '@/components/tools/booklet-imposition/steps/StepAnalysis';
import { StepSettings } from '@/components/tools/booklet-imposition/steps/StepSettings';
import { StepPreview } from '@/components/tools/booklet-imposition/steps/StepPreview';
import { StepExport } from '@/components/tools/booklet-imposition/steps/StepExport';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { BookOpen } from 'lucide-react';


export default function Home() {
    const { currentStep, errorMessage } = useBookletStore();

    return (
        <>
            {/* Header */}
            <header className="glass-effect border-b border-primary-100/50 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary-600 tracking-wider uppercase">
                        Workspace
                      </span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Booklet Imposition Tool
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="w-full max-w-7xl mx-auto">
                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} />

                {/* Error Display */}
                {errorMessage && (
                    <div className="mb-6 animate-fade-in">
                        <Alert type="error" title="Error">
                            {errorMessage}
                        </Alert>
                    </div>
                )}

                {/* Step Content */}
                <div className="animate-fade-in">
                    {currentStep === 1 && <StepUpload />}
                    {currentStep === 2 && <StepAnalysis />}
                    {currentStep === 3 && <StepSettings />}
                    {currentStep === 4 && <StepPreview />}
                    {currentStep === 5 && <StepExport />}
                </div>

                {/* Help Section */}
                <div className="mt-12 max-w-3xl mx-auto">
                    <div className="glass-effect border border-primary-200/50 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg text-white text-sm shadow-lg shadow-primary-500/30">
                  ?
                </span>
                            How to Use This Tool
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>
                                <strong className="text-primary-700">Upload:</strong> Select your PDF file (maximum 50MB)
                            </li>
                            <li>
                                <strong className="text-primary-700">Analysis:</strong> Review your document information
                            </li>
                            <li>
                                <strong className="text-primary-700">Settings:</strong> Configure paper size, duplex mode, and margins
                            </li>
                            <li>
                                <strong className="text-primary-700">Preview:</strong> Check the imposed layout
                            </li>
                            <li>
                                <strong className="text-primary-700">Export:</strong> Download and print your booklet
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="glass-effect border-t border-primary-100/50 mt-auto">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2025 Booklet Imposition Tool. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}