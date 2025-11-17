// components/ui/booklet-imposition/Select.tsx

import React from 'react';
import { cn } from '@/lib/booklet-imposition/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Select({
                           label,
                           error,
                           helperText,
                           className,
                           children,
                           ...props
                       }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <select
                className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400',
                    'disabled:bg-gray-100 disabled:cursor-not-allowed',
                    className
                )}
                {...props}
            >
                {children}
            </select>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}