// components/tools/booklet-imposition/PreviewDiagnostics.ts

'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/booklet-imposition/Card';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { checkPdfJsConfig } from '@/lib/booklet-imposition/pdf/pdfjs-config';

/**
 * Component to diagnose PDF.js and preview issues
 * Only shown when preview generation fails
 */
export function PreviewDiagnostics() {
    const [diagnostics, setDiagnostics] = useState<{
        isConfigured: boolean;
        version: string;
        workerSrc: string;
        issues: string[];
    } | null>(null);

    const [canvasSupport, setCanvasSupport] = useState<boolean>(false);
    const [workerAccessible, setWorkerAccessible] = useState<boolean | null>(null);

    useEffect(() => {
        // Check PDF.js configuration
        const config = checkPdfJsConfig();
        setDiagnostics(config);

        // Check canvas support
        try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            setCanvasSupport(!!context);
        } catch {
            setCanvasSupport(false);
        }

        // Check if worker is accessible
        if (config.workerSrc) {
            fetch(config.workerSrc, { method: 'HEAD' })
                .then(response => {
                    setWorkerAccessible(response.ok);
                })
                .catch(() => {
                    setWorkerAccessible(false);
                });
        }
    }, []);

    if (!diagnostics) {
        return null;
    }

    const hasIssues = diagnostics.issues.length > 0 || !canvasSupport || workerAccessible === false;

    return (
        <Card title="🔍 Preview Diagnostics">
            <div className="space-y-4">
                {/* PDF.js Configuration */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">PDF.js Configuration</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Version:</span>
                            <span className="font-mono text-gray-900">{diagnostics.version}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Configured:</span>
                            <span className={diagnostics.isConfigured ? 'text-green-600' : 'text-red-600'}>
                {diagnostics.isConfigured ? '✓ Yes' : '✗ No'}
              </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-600">Worker Source:</span>
                            <span className="font-mono text-xs text-gray-900 break-all bg-gray-50 p-2 rounded">
                {diagnostics.workerSrc || 'Not configured'}
              </span>
                        </div>
                    </div>
                </div>

                {/* Canvas Support */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Browser Capabilities</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Canvas Support:</span>
                            <span className={canvasSupport ? 'text-green-600' : 'text-red-600'}>
                {canvasSupport ? '✓ Supported' : '✗ Not Supported'}
              </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Worker Accessible:</span>
                            <span className={
                                workerAccessible === null ? 'text-gray-500' :
                                    workerAccessible ? 'text-green-600' : 'text-red-600'
                            }>
                {workerAccessible === null ? '⏳ Checking...' :
                    workerAccessible ? '✓ Accessible' : '✗ Not Accessible'}
              </span>
                        </div>
                    </div>
                </div>

                {/* Issues */}
                {diagnostics.issues.length > 0 && (
                    <Alert type="warning" title="Configuration Issues">
                        <ul className="list-disc list-inside space-y-1">
                            {diagnostics.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                    </Alert>
                )}

                {workerAccessible === false && (
                    <Alert type="error" title="Worker Not Accessible">
                        The PDF.js worker file cannot be loaded. This may be due to:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Network/firewall blocking CDN access</li>
                            <li>Corporate proxy settings</li>
                            <li>Browser security restrictions</li>
                        </ul>
                    </Alert>
                )}

                {!canvasSupport && (
                    <Alert type="error" title="Canvas Not Supported">
                        Your browser does not support HTML5 Canvas, which is required for preview generation.
                    </Alert>
                )}

                {/* Suggested Actions */}
                {hasIssues && (
                    <Alert type="info" title="Suggested Actions">
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Try a different browser (Chrome/Edge recommended)</li>
                            <li>Check your network connection</li>
                            <li>Disable ad blockers or privacy extensions</li>
                            <li>If on corporate network, contact IT about CDN access</li>
                        </ol>
                        <p className="mt-3 font-semibold">
                            Your PDF is ready to download even without preview!
                        </p>
                    </Alert>
                )}

                {!hasIssues && (
                    <Alert type="success" title="All Checks Passed">
                        PDF.js is properly configured. If previews still fail, check browser console for errors.
                    </Alert>
                )}
            </div>
        </Card>
    );
}
