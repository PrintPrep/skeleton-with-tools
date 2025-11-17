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
            container: 'bg-gradient-to-r from-blue-50 via-teal-50 to-mint-50 border-teal-200 text-gray-900',
            icon: 'text-teal-600',
            IconComponent: Info,
            iconBg: 'bg-teal-100',
        },
        success: {
            container: 'bg-gradient-to-r from-green-50 via-mint-50 to-teal-50 border-green-200 text-gray-900',
            icon: 'text-green-600',
            IconComponent: CheckCircle,
            iconBg: 'bg-green-100',
        },
        warning: {
            container: 'bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 border-yellow-200 text-gray-900',
            icon: 'text-yellow-600',
            IconComponent: AlertCircle,
            iconBg: 'bg-yellow-100',
        },
        error: {
            container: 'bg-gradient-to-r from-red-50 via-pink-50 to-purple-50 border-red-200 text-gray-900',
            icon: 'text-red-600',
            IconComponent: XCircle,
            iconBg: 'bg-red-100',
        },
    };

    const { container, icon, IconComponent, iconBg } = styles[type];

    return (
        <div
            className={cn(
                'rounded-2xl border-2 p-5 flex gap-4 shadow-lg',
                container,
                className
            )}
        >
            <div className={cn('rounded-xl p-2 flex-shrink-0 h-fit', iconBg)}>
                <IconComponent className={cn('w-5 h-5', icon)} />
            </div>

            <div className="flex-1">
                {title && (
                    <h4 className="font-bold mb-2 text-lg">{title}</h4>
                )}
                <div className="text-sm leading-relaxed">{children}</div>
            </div>
        </div>
    );
}