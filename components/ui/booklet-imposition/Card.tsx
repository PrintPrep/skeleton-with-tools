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
                'glass-effect rounded-3xl shadow-xl border border-teal-100 overflow-hidden hover:shadow-glow transition-all duration-300 hover:scale-[1.01]',
                className
            )}
        >
            {(title || description) && (
                <div className="px-8 py-5 border-b border-teal-100 bg-gradient-to-r from-teal-50/80 to-mint-50/50">
                    {title && (
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    )}
                    {description && (
                        <p className="mt-1.5 text-sm text-gray-600">{description}</p>
                    )}
                </div>
            )}

            <div className="p-8">{children}</div>
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('px-8 py-5 border-b border-teal-100 bg-gradient-to-r from-teal-50/80 to-mint-50/50', className)}>
            {children}
        </div>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return <div className={cn('p-8', className)}>{children}</div>;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn('px-8 py-5 border-t border-teal-100 bg-gradient-to-r from-teal-50/80 to-mint-50/50', className)}>
            {children}
        </div>
    );
}