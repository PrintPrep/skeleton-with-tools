// app/lib/ticket-layout/pdfExport.ts

import { PDFDocument, degrees } from "pdf-lib";

/**
 * Placement definition (mm)
 */
export type Placement = {
    xMm: number;
    yMm: number;
    widthMm: number;
    heightMm: number;
    // support 0 | 90 | 180 | 270 rotations
    rotation?: 0 | 90 | 180 | 270;
    row?: number;
    col?: number;
    index?: number;
};

/** Convert millimeters to PDF points (1 pt = 1/72 in, 1 in = 25.4 mm) */
const mmToPt = (mm: number) => (mm * 72) / 25.4;

/** Helper: convert ArrayBuffer to ImageBitmap (browser-side) */
async function arrayBufferToImageBitmap(buf: ArrayBuffer): Promise<ImageBitmap> {
    const blob = new Blob([buf]);
    // @ts-ignore createImageBitmap is available in browsers
    return await createImageBitmap(blob);
}

/** Helper: canvas -> ArrayBuffer (PNG) */
function canvasToArrayBuffer(canvas: HTMLCanvasElement): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("Canvas toBlob produced no blob"));
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(blob);
        }, "image/png");
    });
}

/**
 * Create PNG ArrayBuffer containing the source image drawn to cover the target
 * rectangle and rotated by rotationDeg (0, 90, 180 or 270). Uses a canvas for pre-rotation.
 *
 * rotationDeg:
 * - 0   -> no rotation
 * - 90  -> rotate 90 degrees clockwise (w/h swap)
 * - 180 -> rotate 180 degrees
 * - 270 -> rotate 270 degrees clockwise (w/h swap)
 */
async function makePreRotatedImagePngBuffer(
    sourceBuffer: ArrayBuffer,
    rotationDeg: 0 | 90 | 180 | 270,
    targetWidthPt: number,
    targetHeightPt: number
): Promise<ArrayBuffer> {
    const SCALE = 2; // canvas resolution scale
    const canvasW = Math.max(1, Math.round(targetWidthPt * SCALE));
    const canvasH = Math.max(1, Math.round(targetHeightPt * SCALE));

    const imgBitmap = await arrayBufferToImageBitmap(sourceBuffer);

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rad = (rotationDeg * Math.PI) / 180;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotationDeg !== 0) ctx.rotate(rad);

    // If rotated 90° or 270°, the effective target box swaps dimensions
    const targetBoxW = rotationDeg === 90 || rotationDeg === 270 ? canvas.height : canvas.width;
    const targetBoxH = rotationDeg === 90 || rotationDeg === 270 ? canvas.width : canvas.height;

    // compute scale to cover (object-fit: cover)
    const scale = Math.max(targetBoxW / imgBitmap.width, targetBoxH / imgBitmap.height);
    const drawW = imgBitmap.width * scale;
    const drawH = imgBitmap.height * scale;
    const drawX = -drawW / 2;
    const drawY = -drawH / 2;

    ctx.drawImage(imgBitmap, drawX, drawY, drawW, drawH);
    ctx.restore();

    const arr = await canvasToArrayBuffer(canvas);
    try {
        // @ts-ignore
        if (typeof imgBitmap.close === "function") imgBitmap.close();
    } catch (_) {}

    return arr;
}

/**
 * Compute the rotation that should be applied when drawing the backside,
 * given the front rotation. This ensures the back aligns correctly when a
 * front slot has been rotated.
 *
 * Rules:
 * - front 0   => back 0
 * - front 90  => back 270
 * - front 270 => back 90
 * - front 180 => back 180
 */
function backsideRotationFor(frontRotation: 0 | 90 | 180 | 270): 0 | 90 | 180 | 270 {
    switch (frontRotation) {
        case 90:
            return 270;
        case 270:
            return 90;
        case 180:
            return 180;
        case 0:
        default:
            return 0;
    }
}

/**
 * Main exported function:
 * - frontUrl/backUrl: URLs (object URLs or remote)
 * - placements: pattern for one sheet (mm)
 * - options: { paperWidthMm, paperHeightMm, totalCount, marginMm?: number }
 *
 * Behavior:
 * - Interleaves pages: for each sheetIndex output front page (if any) then back page (if any).
 * - Pre-rotates images when placement.rotation === 90/180/270 using canvas; caches per-source+size+rotation.
 * - If the source is a PDF, the first page of that PDF is embedded and drawn to each slot (when possible).
 */
export async function generatePDFFromPattern(
    frontUrl: string | null,
    backUrl: string | null | undefined,
    placements: Placement[],
    options: { paperWidthMm: number; paperHeightMm: number; totalCount: number; marginMm?: number }
): Promise<Uint8Array> {
    const { paperWidthMm, paperHeightMm, totalCount } = options;
    const marginMm = options.marginMm ?? 5;

    const pdfDoc = await PDFDocument.create();

    const paperWidthPt = mmToPt(paperWidthMm);
    const paperHeightPt = mmToPt(paperHeightMm);

    if (!placements || placements.length === 0) {
        throw new Error("No placements provided for export.");
    }

    const slotsPerPage = placements.length;
    const pagesNeeded = Math.ceil(totalCount / slotsPerPage);

    // Fetch bytes + metadata
    async function fetchBytes(url: string | null) {
        if (!url) return null;
        try {
            const res = await fetch(url);
            const buffer = await res.arrayBuffer();
            const contentType = res.headers?.get?.("content-type") ?? "";
            const looksLikePdf = url.toLowerCase().endsWith(".pdf") || contentType.includes("pdf");
            return { buffer, looksLikePdf, url };
        } catch (err) {
            console.warn("Failed to fetch asset:", url, err);
            return null;
        }
    }

    const frontFetch = await fetchBytes(frontUrl);
    const backFetch = await fetchBytes(backUrl ?? null);

    // Caches (per-export)
    const rotatedPngCache = new Map<string, ArrayBuffer>(); // key: `${srcUrl}||${rotation}_${w}x${h}`
    const embeddedImageCache = new Map<string, { kind: "image"; embeddedImg: any }>();
    const pdfEmbeddedPagesCache = new Map<string, any[]>(); // key: srcUrl -> array of embedded PDF page objects

    // For raster sources: returns embedded PNG/JPG object (cached)
    // NOTE: we now accept isFront so we can compute the correct rotation for back/front drawing
    async function getEmbeddedImageForPlacement(
        sourceInfo: { buffer: ArrayBuffer; looksLikePdf: boolean; url: string } | null,
        p: Placement,
        isFront: boolean
    ) {
        if (!sourceInfo) return null;
        if (sourceInfo.looksLikePdf) return { kind: "pdf" as const };

        // determine rotation we should pre-apply to the raster source for this draw
        const frontRot = (p.rotation ?? 0) as 0 | 90 | 180 | 270;
        const rotationToApply = isFront ? frontRot : backsideRotationFor(frontRot);

        const wPt = mmToPt(p.widthMm);
        const hPt = mmToPt(p.heightMm);
        const key = `${sourceInfo.url}||${rotationToApply}_${wPt.toFixed(3)}x${hPt.toFixed(3)}`;

        if (embeddedImageCache.has(key)) return embeddedImageCache.get(key);

        let pngBytes: ArrayBuffer;
        if (rotatedPngCache.has(key)) {
            pngBytes = rotatedPngCache.get(key)!;
        } else {
            // Create pre-rotated PNG bytes using canvas (supports 0|90|180|270)
            pngBytes = await makePreRotatedImagePngBuffer(sourceInfo.buffer, rotationToApply, wPt, hPt);
            rotatedPngCache.set(key, pngBytes);
        }

        // embed into pdfDoc
        let embeddedImg;
        try {
            embeddedImg = await pdfDoc.embedPng(pngBytes);
        } catch (err) {
            try {
                embeddedImg = await pdfDoc.embedJpg(pngBytes);
            } catch (e) {
                console.error("Failed to embed image bytes into PDF:", e);
                return null;
            }
        }

        const record = { kind: "image" as const, embeddedImg };
        embeddedImageCache.set(key, record);
        return record;
    }

    // For PDF sources: embed PDF once and cache the embedded pages (we will use the first page)
    async function getPdfEmbeddedPages(sourceInfo: { buffer: ArrayBuffer; looksLikePdf: boolean; url: string } | null) {
        if (!sourceInfo) return null;
        if (!sourceInfo.looksLikePdf) return null;

        const key = sourceInfo.url;
        if (pdfEmbeddedPagesCache.has(key)) return pdfEmbeddedPagesCache.get(key);

        try {
            // pdf-lib: embedPdf returns an array of embedded page objects
            const embeddedPages = await pdfDoc.embedPdf(sourceInfo.buffer);
            pdfEmbeddedPagesCache.set(key, embeddedPages);
            return embeddedPages;
        } catch (err) {
            console.warn("Failed to embed PDF pages for", sourceInfo.url, err);
            return null;
        }
    }

    // Draw slots for a specific source onto a pdf page
    async function drawSlotsOnPage(
        page: any,
        sourceInfo: { buffer: ArrayBuffer; looksLikePdf: boolean; url: string } | null,
        pageIndex: number,
        isFront: boolean
    ) {
        if (!sourceInfo) return;
        for (let slot = 0; slot < slotsPerPage; slot++) {
            const globalIndex = pageIndex * slotsPerPage + slot;
            if (globalIndex >= totalCount) break;

            const p = placements[slot];
            const xPt = mmToPt(p.xMm);
            const yPtFromTop = mmToPt(p.yMm);
            const wPt = mmToPt(p.widthMm);
            const hPt = mmToPt(p.heightMm);
            const drawY = page.getHeight() - yPtFromTop - hPt;

            // Horizontal flip for back side so printed front/back align
            const actualX = isFront ? xPt : (paperWidthPt - xPt - wPt);

            if (sourceInfo.looksLikePdf) {
                // Try to draw the first page of the embedded PDF
                const embeddedPages = await getPdfEmbeddedPages(sourceInfo);
                if (embeddedPages && embeddedPages.length > 0) {
                    try {
                        const embeddedFirst = embeddedPages[0];

                        // Compute desired rotation for drawing the PDF page:
                        const frontRot = (p.rotation ?? 0) as 0 | 90 | 180 | 270;
                        const rotToUse = isFront ? frontRot : backsideRotationFor(frontRot);

                        // If rotation is 0 or 180 we can draw with rotate option.
                        // For 90/270 handling of embedded PDF pages with rotate may require swapping width/height,
                        // but pdf-lib's drawPage allows rotate; we will attempt rotate for 90/270 as well.
                        // (If you find any alignment issues for 90/270 PDF pages we can convert PDF pages to raster first.)
                        if (rotToUse === 0) {
                            page.drawPage(embeddedFirst, {
                                x: actualX,
                                y: drawY,
                                width: wPt,
                                height: hPt,
                            });
                        } else {
                            page.drawPage(embeddedFirst, {
                                x: actualX,
                                y: drawY,
                                width: wPt,
                                height: hPt,
                                rotate: degrees(rotToUse),
                            });
                        }
                        continue;
                    } catch (err) {
                        console.warn("Failed to draw embedded PDF page, falling back to placeholder", err);
                    }
                }

                // fallback placeholder if embedding failed
                page.drawRectangle({ x: actualX, y: drawY, width: wPt, height: hPt });
                page.drawText("PDF (not embedded)", { x: actualX + 5, y: drawY + 5, size: 8 });
                continue;
            }

            // Raster images
            const embedded = await getEmbeddedImageForPlacement(sourceInfo, p, isFront);
            if (!embedded) continue;

            if (embedded.kind === "image") {
                try {
                    // For images we pre-rotated according to desired rotation already, so just draw at actualX.
                    page.drawImage(embedded.embeddedImg, { x: actualX, y: drawY, width: wPt, height: hPt });
                } catch (err) {
                    console.error("Failed to draw embedded image on PDF page:", err);
                }
            }
        }
    }

    // INTERLEAVED FRONT + BACK PAGES
    for (let pageIndex = 0; pageIndex < pagesNeeded; pageIndex++) {
        if (frontFetch) {
            const frontPage = pdfDoc.addPage([paperWidthPt, paperHeightPt]);
            await drawSlotsOnPage(frontPage, frontFetch, pageIndex, true);
        }
        if (backFetch) {
            const backPage = pdfDoc.addPage([paperWidthPt, paperHeightPt]);
            await drawSlotsOnPage(backPage, backFetch, pageIndex, false);
        }
    }

    return await pdfDoc.save();
}
