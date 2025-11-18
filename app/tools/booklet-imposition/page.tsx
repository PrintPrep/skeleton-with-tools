// app/tools/booklet-imposition/editor/page.tsx

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
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-mint-50 to-purple-50">
            {/* Header */}
            <header className="glass-effect border-b border-teal-100 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">
                                        Workspace
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Booklet Imposition Tool
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="w-full max-w-7xl mx-auto px-4 py-8">
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
                <div className="mt-16 max-w-3xl mx-auto">
                    <div className="glass-effect border border-teal-100 rounded-3xl p-8 shadow-lg hover:shadow-glow transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl text-white text-lg shadow-lg shadow-teal-500/30">
                                ?
                            </span>
                            How to Use This Tool
                        </h3>
                        <ol className="space-y-4 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                                <div>
                                    <strong className="text-teal-700">Upload:</strong> Select your PDF file (maximum 10MB)
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                                <div>
                                    <strong className="text-teal-700">Analysis:</strong> Review your document information
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                                <div>
                                    <strong className="text-teal-700">Settings:</strong> Configure paper size, duplex mode, and margins
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex-shrink-0 mt-0.5">4</span>
                                <div>
                                    <strong className="text-teal-700">Preview:</strong> Check the imposed layout
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex-shrink-0 mt-0.5">5</span>
                                <div>
                                    <strong className="text-teal-700">Export:</strong> Download and print your booklet
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="glass-effect border-t border-teal-100 mt-16">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2025 Booklet Imposition Tool. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}