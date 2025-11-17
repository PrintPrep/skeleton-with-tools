// components/ui/booklet-imposition/Alert.tsx

import React from 'react';
import { cn } from '@/lib/booklet-imposition/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Alert({
                          type = 'info',
                          title,
                          children,
                          className,
                      }: AlertProps) {
    const styles = {
        info: {
            container: 'bg-gradient-to-r from-blue-50 to-accent-50/30 border-blue-200 text-blue-900',
            icon: 'text-blue-600',
            IconComponent: Info,
        },
        success: {
            container: 'bg-gradient-to-r from-green-50 to-primary-50/30 border-green-200 text-green-900',
            icon: 'text-green-600',
            IconComponent: CheckCircle,
        },
        warning: {
            container: 'bg-gradient-to-r from-yellow-50 to-orange-50/30 border-yellow-200 text-yellow-900',
            icon: 'text-yellow-600',
            IconComponent: AlertCircle,
        },
        error: {
            container: 'bg-gradient-to-r from-red-50 to-pink-50/30 border-red-200 text-red-900',
            icon: 'text-red-600',
            IconComponent: XCircle,
        },
    };

    const { container, icon, IconComponent } = styles[type];

    return (
        <div
            className={cn(
                'rounded-lg border p-4 flex gap-3',
                container,
                className
            )}
        >
            <IconComponent className={cn('w-5 h-5 flex-shrink-0 mt-0.5', icon)} />

            <div className="flex-1">
                {title && (
                    <h4 className="font-semibold mb-1">{title}</h4>
                )}
                <div className="text-sm">{children}</div>
            </div>
        </div>
    );
}