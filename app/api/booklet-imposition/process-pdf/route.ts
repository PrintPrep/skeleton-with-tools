// app/api/booklet-imposition/process-pdf/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { calculateImposition } from '@/lib/booklet-imposition/pdf/imposer';
import { processPdf, validatePdfForProcessing } from '@/lib/booklet-imposition/pdf/processor';
import { BookletSettings } from '@/types/booklet-imposition/settings.types';

/**
 * API Route: POST /api/process-pdf
 *
 * Processes a PDF and creates an imposed booklet
 *
 * Request body: JSON with { pdfData: base64 string, settings: BookletSettings }
 * Response: Processed PDF as binary
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pdfData, settings } = body;

        if (!pdfData || !settings) {
            return NextResponse.json(
                { error: 'Missing PDF data or settings' },
                { status: 400 }
            );
        }

        // Convert base64 to ArrayBuffer
        const binaryString = atob(pdfData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const pdfBuffer = bytes.buffer;

        // Validate PDF
        const validation = await validatePdfForProcessing(pdfBuffer);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error || 'Invalid PDF' },
                { status: 400 }
            );
        }

        // Get page count for imposition calculation
        const { PDFDocument } = await import('pdf-lib');
        const pdf = await PDFDocument.load(pdfBuffer);
        const totalPages = pdf.getPageCount();

        // Calculate imposition
        const impositionResult = calculateImposition(
            totalPages,
            settings.duplexMode
        );

        // Process the PDF
        const processedPdf = await processPdf(
            pdfBuffer,
            impositionResult,
            settings as BookletSettings
        );

        // Return the processed PDF with imposition metadata
        return new NextResponse(processedPdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="booklet.pdf"',
                'X-Total-Sheets': impositionResult.totalSheets.toString(),
                'X-Blanks-Added': impositionResult.blanksAdded.toString(),
            },
        });

    } catch (error) {
        console.error('Error in process-pdf API:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to process PDF',
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
        endpoint: '/api/process-pdf',
        method: 'POST',
        description: 'Processes a PDF and creates an imposed booklet',
        accepts: 'application/json',
        body: {
            pdfData: 'base64 encoded PDF',
            settings: 'BookletSettings object',
        },
        returns: 'application/pdf',
    });
}