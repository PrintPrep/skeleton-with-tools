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

export default function Home() {
    const { currentStep, errorMessage } = useBookletStore();

    return (
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        How to Use This Tool
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                        <li>
                            <strong>Upload:</strong> Select your PDF file (maximum 50MB)
                        </li>
                        <li>
                            <strong>Analysis:</strong> Review your document information
                        </li>
                        <li>
                            <strong>Settings:</strong> Configure paper size, duplex mode, and margins
                        </li>
                        <li>
                            <strong>Preview:</strong> Check the imposed layout
                        </li>
                        <li>
                            <strong>Export:</strong> Download and print your booklet
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}