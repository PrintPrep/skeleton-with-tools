// components/ui/booklet-imposition/Card.tsx

import React from 'react';
import { cn } from '@/lib/booklet-imposition/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function Card({ children, className, title, description }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden',
                className
            )}
        >
            {(title || description) && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    )}
                    {description && (
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    )}
                </div>
            )}

            <div className="p-6">{children}</div>
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('px-6 py-4 border-b border-gray-200 bg-gray-50', className)}>
            {children}
        </div>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return <div className={cn('p-6', className)}>{children}</div>;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>
            {children}
        </div>
    );
}