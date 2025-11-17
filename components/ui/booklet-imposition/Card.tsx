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
                'glass-effect rounded-2xl shadow-lg border border-primary-100/50 overflow-hidden hover:shadow-glow transition-all duration-300',
                className
            )}
        >
            {(title || description) && (
                <div className="px-6 py-4 border-b border-primary-100/50 bg-gradient-to-r from-primary-50/50 to-accent-50/30">
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
        <div className={cn('px-6 py-4 border-b border-primary-100/50 bg-gradient-to-r from-primary-50/50 to-accent-50/30', className)}>
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
        <div className={cn('px-6 py-4 border-t border-primary-100/50 bg-gradient-to-r from-primary-50/50 to-accent-50/30', className)}>
            {children}
        </div>
    );
}