// app/api/booklet-imposition/analyse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { analyzePdf, validatePdf } from '@/lib/booklet-imposition/pdf/analyzer';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "100mb",
        },
    },
};

/**
 * API Route: POST /api/analyze
 *
 * Analyzes an uploaded PDF and returns metadata
 *
 * Request body: PDF file as ArrayBuffer
 * Response: PdfAnalysis object
 */
export async function POST(request: NextRequest) {
    try {
        // Get the PDF file from the request
        const arrayBuffer = await request.arrayBuffer();

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate that it's a valid PDF
        const isValid = await validatePdf(arrayBuffer);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid PDF file' },
                { status: 400 }
            );
        }

        // Analyze the PDF
        const analysis = await analyzePdf(arrayBuffer);

        // Return the analysis results
        return NextResponse.json({
            success: true,
            data: analysis,
        });

    } catch (error) {
        console.error('Error in analyze API:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to analyze PDF',
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
        endpoint: '/api/analyze',
        method: 'POST',
        description: 'Analyzes a PDF file and returns page information',
        accepts: 'application/pdf',
        returns: 'PdfAnalysis object',
    });
}