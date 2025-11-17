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
        <div className="w-full py-10 mb-4">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        {/* Step circle */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={cn(
                                    'w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300',
                                    currentStep > step.number
                                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-xl shadow-teal-500/40 scale-105'
                                        : currentStep === step.number
                                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white ring-4 ring-teal-200 shadow-2xl shadow-teal-500/50 scale-110'
                                            : 'bg-white border-2 border-gray-200 text-gray-400 shadow-md'
                                )}
                            >
                                {currentStep > step.number ? (
                                    <Check className="w-7 h-7" strokeWidth={3} />
                                ) : (
                                    step.number
                                )}
                            </div>

                            <span
                                className={cn(
                                    'mt-3 text-sm font-semibold transition-colors',
                                    currentStep >= step.number
                                        ? 'text-teal-700'
                                        : 'text-gray-400'
                                )}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-1.5 mx-4 mb-10 relative">
                                <div className="absolute inset-0 bg-gray-200 rounded-full" />
                                <div
                                    className={cn(
                                        'absolute inset-0 rounded-full transition-all duration-500',
                                        currentStep > step.number
                                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30'
                                            : 'w-0'
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