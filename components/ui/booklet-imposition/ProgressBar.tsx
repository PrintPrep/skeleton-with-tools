// components/ui/booklet-imposition/ProgressBar.tsx

import React from 'react';
import { cn } from '@/lib/booklet-imposition/utils';
import { WorkflowStep } from '@/types/booklet-imposition/store.types';
import { Check } from 'lucide-react';

interface ProgressBarProps {
    currentStep: WorkflowStep;
}

const steps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Analysis' },
    { number: 3, label: 'Settings' },
    { number: 4, label: 'Preview' },
    { number: 5, label: 'Export' },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        {/* Step circle */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={cn(
                                    'w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                                    currentStep > step.number
                                        ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                                        : currentStep === step.number
                                            ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white ring-4 ring-primary-200 shadow-lg shadow-primary-500/40'
                                            : 'bg-gray-200 text-gray-500'
                                )}
                            >
                                {currentStep > step.number ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </div>

                            <span
                                className={cn(
                                    'mt-2 text-sm font-medium transition-colors',
                                    currentStep >= step.number
                                        ? 'text-primary-700'
                                        : 'text-gray-500'
                                )}
                            >
                {step.label}
              </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-2 mb-8">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all duration-500',
                                        currentStep > step.number
                                            ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                                            : 'bg-gray-200'
                                    )}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}