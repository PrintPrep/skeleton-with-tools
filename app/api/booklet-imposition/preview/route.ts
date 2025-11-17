// app/api/booklet-imposition/preview/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: POST /api/preview
 *
 * Generates preview thumbnails for an imposed PDF
 *
 * Note: This is a server-side endpoint, but preview generation
 * is typically done client-side using PDF.js for better performance.
 * This endpoint is kept for compatibility but may not be used in the final app.
 *
 * Request body: JSON with { pdfData: base64 string }
 * Response: Array of preview image data URLs
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pdfData } = body;

        if (!pdfData) {
            return NextResponse.json(
                { error: 'No PDF data provided' },
                { status: 400 }
            );
        }

        // Convert base64 to Uint8Array
        const binaryString = atob(pdfData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Note: Server-side rendering of PDFs to images is complex
        // and requires additional dependencies like canvas or sharp.
        // For this application, we'll handle preview generation client-side.

        return NextResponse.json({
            success: true,
            message: 'Preview generation is handled client-side',
            note: 'Use the renderer.ts utility on the client for better performance',
        });

    } catch (error) {
        console.error('Error in preview API:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to generate previews',
            },
            { status: 500 }
        );
    }
}

/**
 * GET method - return API information
 */
export async function GET() {
    return NextResponse.json({
        endpoint: '/api/preview',
        method: 'POST',
        description: 'Generates preview thumbnails (handled client-side)',
        note: 'Preview generation is typically done in the browser using PDF.js',
    });
}