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
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <select
                className={cn(
                    'w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200',
                    'focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-teal-500',
                    'hover:border-teal-300 cursor-pointer',
                    'bg-white text-gray-900 font-medium',
                    error
                        ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                        : 'border-gray-200',
                    'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60',
                    className
                )}
                {...props}
            >
                {children}
            </select>

            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            )}

            {helperText && !error && (
                <p className="mt-2 text-sm text-gray-600">{helperText}</p>
            )}
        </div>
    );
}