// components/tools/booklet-imposition/steps/StepUpload.tsx

import React from 'react';
import { useBookletStore } from '@/lib/booklet-imposition/store/useBookletStore';
import { FileUploader } from '../FileUploader';
import { Button } from '@/components/ui/booklet-imposition/Button';
import { Card } from '@/components/ui/booklet-imposition/Card';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { ArrowRight } from 'lucide-react';

export function StepUpload() {
    const { uploadedFile, uploadFile, clearFile, nextStep } = useBookletStore();

    const handleNext = () => {
        if (uploadedFile) {
            nextStep();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Upload Your PDF
                </h2>
                <p className="text-gray-600">
                    Select a PDF file to create a booklet imposition
                </p>
            </div>

            <Card>
                <FileUploader
                    onFileSelect={uploadFile}
                    currentFile={uploadedFile}
                    onClear={clearFile}
                />
            </Card>

            <Alert type="info" title="What is booklet imposition?">
                Booklet imposition automatically rearranges your PDF pages so they can be
                printed double-sided, folded in half, and stapled to create a booklet.
                The pages will be in the correct order after folding.
            </Alert>

            <div className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!uploadedFile}
                    className="min-w-[150px]"
                >
                    Next
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}