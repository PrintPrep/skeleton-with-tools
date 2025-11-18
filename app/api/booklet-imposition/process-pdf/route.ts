// app/api/booklet-imposition/process-pdf/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { calculateImposition } from '@/lib/booklet-imposition/pdf/imposer';
import { processPdf } from '@/lib/booklet-imposition/pdf/processor';
import { BookletSettings } from '@/types/booklet-imposition/settings.types';

/**
 * API Route: POST /api/process-pdf
 *
 * Processes a PDF and creates an imposed booklet
 * Now actually used for better reliability with large files
 *
 * Request: FormData with 'pdf' file and 'settings' JSON string
 * Response: Processed PDF as binary + metadata headers
 */
export async function POST(request: NextRequest) {
    try {
        console.log('Process PDF API called');

        // Parse FormData
        const formData = await request.formData();
        const pdfFile = formData.get('pdf') as File;
        const settingsStr = formData.get('settings') as string;

        if (!pdfFile || !settingsStr) {
            return NextResponse.json(
                { error: 'Missing PDF file or settings' },
                { status: 400 }
            );
        }

        console.log('Received file:', pdfFile.name, 'Size:', pdfFile.size);

        // Parse settings
        const settings = JSON.parse(settingsStr) as BookletSettings;
        console.log('Settings:', settings);

        // Convert file to ArrayBuffer
        const arrayBuffer = await pdfFile.arrayBuffer();
        console.log('File converted to ArrayBuffer');

        // Get page count for imposition calculation
        const pdf = await PDFDocument.load(arrayBuffer);
        const totalPages = pdf.getPageCount();
        console.log('Total pages:', totalPages);

        // Calculate imposition
        const impositionResult = calculateImposition(totalPages, settings.duplexMode);
        console.log('Imposition calculated:', impositionResult);

        // Process the PDF
        console.log('Starting PDF processing...');
        const processedPdf = await processPdf(arrayBuffer, impositionResult, settings);
        console.log('PDF processed successfully. Size:', processedPdf.length);

        // Return the processed PDF with metadata
        return new NextResponse(processedPdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${pdfFile.name.replace('.pdf', '')}_booklet.pdf"`,
                'X-Total-Sheets': impositionResult.totalSheets.toString(),
                'X-Blanks-Added': impositionResult.blanksAdded.toString(),
                'X-Total-Spreads': impositionResult.spreads.length.toString(),
            },
        });

    } catch (error) {
        console.error('Error in process-pdf API:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to process PDF',
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
        endpoint: '/api/process-pdf',
        method: 'POST',
        description: 'Processes a PDF and creates an imposed booklet (server-side)',
        accepts: 'multipart/form-data',
        fields: {
            pdf: 'PDF file',
            settings: 'JSON string of BookletSettings',
        },
        returns: 'application/pdf with metadata headers',
    });
}