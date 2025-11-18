// app/api/booklet-imposition/preview/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
// Note: Server-side PDF rendering requires canvas package
// For now, we'll return page info and let client handle rendering

/**
 * API Route: POST /api/preview
 *
 * Generates preview metadata for an imposed PDF
 * Returns page information that client can use to render previews
 *
 * Request: FormData with 'pdf' file
 * Response: JSON with page information
 */
export async function POST(request: NextRequest) {
    try {
        console.log('Preview API called');

        // Parse FormData
        const formData = await request.formData();
        const pdfFile = formData.get('pdf') as File;

        if (!pdfFile) {
            return NextResponse.json(
                { error: 'No PDF file provided' },
                { status: 400 }
            );
        }

        console.log('Received file for preview:', pdfFile.name);

        // Convert file to ArrayBuffer
        const arrayBuffer = await pdfFile.arrayBuffer();

        // Load PDF to get page count and dimensions
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();

        console.log('PDF loaded. Pages:', pageCount);

        // Get dimensions of each page
        const pages = [];
        for (let i = 0; i < pageCount; i++) {
            const page = pdf.getPage(i);
            const { width, height } = page.getSize();
            pages.push({
                pageNumber: i + 1,
                width,
                height,
            });
        }

        // Return PDF as base64 for client-side rendering
        const base64Pdf = Buffer.from(arrayBuffer).toString('base64');

        return NextResponse.json({
            success: true,
            pageCount,
            pages,
            pdfData: base64Pdf, // Client will use this with PDF.js
            message: 'PDF ready for client-side preview rendering',
        });

    } catch (error) {
        console.error('Error in preview API:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to process PDF for preview',
                details: error instanceof Error ? error.stack : undefined,
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
        description: 'Returns PDF data for client-side preview rendering',
        accepts: 'multipart/form-data',
        fields: {
            pdf: 'PDF file to preview',
        },
        returns: 'JSON with page info and base64 PDF data',
    });
}