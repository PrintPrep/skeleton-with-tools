// app/api/booklet-imposition/process-pdf/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { calculateImposition } from '@/lib/booklet-imposition/pdf/imposer';
import { processPdf } from '@/lib/booklet-imposition/pdf/processor';
import { BookletSettings } from '@/types/booklet-imposition/settings.types';

// Increase body size limit for large PDFs
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb',
        },
    },
};

/**
 * API Route: POST /api/booklet-imposition/process-pdf
 *
 * Processes a PDF and creates an imposed booklet
 * Server-side processing for better reliability with large files
 *
 * Request: FormData with 'pdf' file and 'settings' JSON string
 * Response: Processed PDF as binary + metadata headers
 */
export async function POST(request: NextRequest) {
    try {
        console.log('📥 Process PDF API called');

        // Parse FormData
        const formData = await request.formData();
        const pdfFile = formData.get('pdf');
        const settingsStr = formData.get('settings');

        // Validate inputs
        if (!pdfFile || !(pdfFile instanceof File || pdfFile instanceof Blob)) {
            console.error('❌ Invalid or missing PDF file');
            return NextResponse.json(
                { error: 'Invalid or missing PDF file' },
                { status: 400 }
            );
        }

        if (!settingsStr || typeof settingsStr !== 'string') {
            console.error('❌ Invalid or missing settings');
            return NextResponse.json(
                { error: 'Invalid or missing settings' },
                { status: 400 }
            );
        }

        const fileName = pdfFile instanceof File ? pdfFile.name : 'document.pdf';
        const fileSize = pdfFile.size;

        console.log(`📄 Received file: ${fileName}`);
        console.log(`📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

        // Parse settings
        let settings: BookletSettings;
        try {
            settings = JSON.parse(settingsStr);
            console.log('⚙️ Settings parsed:', {
                paperSize: settings.paperSize,
                duplexMode: settings.duplexMode,
                marginPreset: settings.marginPreset,
            });
        } catch (parseError) {
            console.error('❌ Failed to parse settings:', parseError);
            return NextResponse.json(
                { error: 'Invalid settings format' },
                { status: 400 }
            );
        }

        // Convert file to ArrayBuffer
        console.log('🔄 Converting file to ArrayBuffer...');
        const arrayBuffer = await pdfFile.arrayBuffer();
        console.log(`✅ ArrayBuffer created: ${arrayBuffer.byteLength} bytes`);

        // Validate PDF
        console.log('🔍 Validating PDF...');
        let pdf: PDFDocument;
        try {
            pdf = await PDFDocument.load(arrayBuffer);
        } catch (loadError) {
            console.error('❌ Invalid PDF file:', loadError);
            return NextResponse.json(
                { error: 'Invalid PDF file. Please ensure the file is not corrupted.' },
                { status: 400 }
            );
        }

        const totalPages = pdf.getPageCount();
        console.log(`📖 Total pages: ${totalPages}`);

        if (totalPages === 0) {
            console.error('❌ PDF has no pages');
            return NextResponse.json(
                { error: 'PDF file has no pages' },
                { status: 400 }
            );
        }

        if (totalPages > 1000) {
            console.error('❌ PDF has too many pages');
            return NextResponse.json(
                { error: 'PDF has too many pages (maximum 1000)' },
                { status: 400 }
            );
        }

        // Calculate imposition
        console.log('📐 Calculating imposition...');
        const impositionResult = calculateImposition(totalPages, settings.duplexMode);
        console.log(`📊 Imposition calculated:`, {
            totalSheets: impositionResult.totalSheets,
            blanksAdded: impositionResult.blanksAdded,
            spreads: impositionResult.spreads.length,
        });

        // Process the PDF
        console.log('🔧 Starting PDF processing...');
        const startTime = Date.now();

        const processedPdf = await processPdf(arrayBuffer, impositionResult, settings);

        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ PDF processed successfully in ${processingTime}s`);
        console.log(`📦 Output size: ${(processedPdf.length / 1024 / 1024).toFixed(2)} MB`);

        // Generate output filename
        const outputFilename = fileName.replace(/\.pdf$/i, '') + '_booklet.pdf';

        // Return the processed PDF with metadata headers
        return new NextResponse(processedPdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${outputFilename}"`,
                'Content-Length': processedPdf.length.toString(),
                'X-Total-Sheets': impositionResult.totalSheets.toString(),
                'X-Blanks-Added': impositionResult.blanksAdded.toString(),
                'X-Total-Spreads': impositionResult.spreads.length.toString(),
                'X-Processing-Time': processingTime,
            },
        });

    } catch (error) {
        console.error('❌ Error in process-pdf API:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorStack = error instanceof Error ? error.stack : undefined;

        console.error('Error details:', { errorMessage, errorStack });

        return NextResponse.json(
            {
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
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
        endpoint: '/api/booklet-imposition/process-pdf',
        method: 'POST',
        description: 'Processes a PDF and creates an imposed booklet (server-side)',
        version: '2.0',
        accepts: 'multipart/form-data',
        fields: {
            pdf: 'PDF file (File or Blob, max 100MB)',
            settings: 'JSON string of BookletSettings',
        },
        returns: {
            contentType: 'application/pdf',
            headers: [
                'X-Total-Sheets: number of physical sheets needed',
                'X-Blanks-Added: number of blank pages added',
                'X-Total-Spreads: total number of page spreads',
                'X-Processing-Time: processing time in seconds',
            ],
        },
        limits: {
            maxFileSize: '100MB',
            maxPages: 1000,
        },
    });
}