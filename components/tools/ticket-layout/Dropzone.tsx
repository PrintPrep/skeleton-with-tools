// components/tools/ticket-layout/Dropzone.tsx

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SideFile, useStore } from "@/lib/ticket-layout/zustandStore";
import { v4 as uuidv4 } from "uuid";

interface DropzoneProps {
    side: "front" | "back";
    isDisabled?: boolean;
}

// Define types for PDF.js from CDN
declare global {
    interface Window {
        pdfjsLib?: any;
    }
}

export default function Dropzone({ side, isDisabled }: DropzoneProps) {
    const file = useStore((s) => (side === "front" ? s.front : s.back));
    const setSide = useStore((s) => s.setSide);
    const removeSide = useStore((s) => s.removeSide);
    const setLayout = useStore((s) => s.setLayout);

    const [isConverting, setIsConverting] = useState(false);

    // Load PDF.js from CDN if not already loaded
    const loadPdfJs = async () => {
        if (window.pdfjsLib) {
            return window.pdfjsLib;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                    resolve(window.pdfjsLib);
                } else {
                    reject(new Error("PDF.js failed to load"));
                }
            };
            script.onerror = () => reject(new Error("Failed to load PDF.js script"));
            document.head.appendChild(script);
        });
    };

    // Function to convert PDF first page to PNG
    const convertPdfToImage = async (pdfFile: File): Promise<{ url: string; width: number; height: number }> => {
        try {
            console.log("Starting PDF conversion...");

            // Load PDF.js from CDN
            const pdfjsLib = await loadPdfJs();

            // Read file as array buffer
            const arrayBuffer = await pdfFile.arrayBuffer();
            console.log("PDF file loaded, size:", arrayBuffer.byteLength);

            // Load the PDF document
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            console.log("PDF loaded, pages:", pdf.numPages);

            // Get first page
            const page = await pdf.getPage(1);
            console.log("First page retrieved");

            // Set scale for good quality
            const scale = 2;
            const viewport = page.getViewport({ scale });
            console.log("Viewport size:", viewport.width, "x", viewport.height);

            // Create canvas
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (!context) {
                throw new Error("Could not get canvas 2D context");
            }

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render PDF page to canvas
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;
            console.log("PDF page rendered to canvas");

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((b) => {
                    if (b) {
                        console.log("Canvas converted to blob");
                        resolve(b);
                    } else {
                        reject(new Error("Failed to convert canvas to blob"));
                    }
                }, "image/png", 0.95);
            });

            const url = URL.createObjectURL(blob);
            console.log("Image URL created:", url);

            return {
                url,
                width: viewport.width,
                height: viewport.height,
            };
        } catch (error) {
            console.error("PDF conversion error:", error);
            throw error;
        }
    };

    const handleDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const f = acceptedFiles[0];
            if (!f) return;

            const isPdf = f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf");

            if (isPdf) {
                // Handle PDF: convert to image first
                setIsConverting(true);
                try {
                    const { url, width, height } = await convertPdfToImage(f);

                    const aspectRatio = width / height;

                    // Create SideFile as IMAGE type (not PDF)
                    const sideFile: SideFile = {
                        id: uuidv4(),
                        name: f.name.replace(/\.pdf$/i, " (converted).png"),
                        type: "image",
                        file: f,
                        url: url,
                    };

                    setSide(side, sideFile);

                    // Set card dimensions based on PDF page aspect ratio
                    const defaultHeight = 90;
                    const calculatedWidth = defaultHeight * aspectRatio;

                    setLayout({
                        cardWidthMm: calculatedWidth,
                        cardHeightMm: defaultHeight,
                        aspectRatio: aspectRatio,
                        aspectRatioLocked: true,
                    });

                    console.log("PDF successfully converted and uploaded!");
                } catch (error) {
                    console.error("Failed to convert PDF:", error);
                    alert(`Failed to convert PDF: ${error instanceof Error ? error.message : "Unknown error"}. Please try a different file or use an image instead.`);
                } finally {
                    setIsConverting(false);
                }
            } else {
                // Handle regular image
                const sideFile: SideFile = {
                    id: uuidv4(),
                    name: f.name,
                    type: "image",
                    file: f,
                    url: URL.createObjectURL(f),
                };
                setSide(side, sideFile);

                // Detect aspect ratio for images
                const img = new Image();
                img.onload = () => {
                    const aspectRatio = img.width / img.height;
                    const defaultHeight = 90;
                    const calculatedWidth = defaultHeight * aspectRatio;

                    setLayout({
                        cardWidthMm: calculatedWidth,
                        cardHeightMm: defaultHeight,
                        aspectRatio: aspectRatio,
                        aspectRatioLocked: true,
                    });
                };
                img.onerror = () => {
                    console.error("Failed to load image");
                };
                img.src = sideFile.url;
            }
        },
        [side, setSide, setLayout]
    );

    const drop = useDropzone({
        onDrop: handleDrop,
        accept: { "application/pdf": [".pdf"], "image/*": [] },
        multiple: false,
        disabled: isDisabled || isConverting,
    });

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <h3 className="font-heading mb-2 text-base text-gray-800">
                {side === "front" ? "Front side" : "Back side"}
            </h3>
            <p className="mb-3 text-xs text-gray-600">
                Upload an image or PDF to use as the {side} design.
            </p>
            <div
                {...drop.getRootProps()}
                className={`w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md ${
                    isDisabled || isConverting ? "pointer-events-none opacity-40" : "cursor-pointer hover:border-[#00BFA6] focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
                }`}
            >
                <input {...drop.getInputProps()} />

                {isConverting && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#00BFA6]"></div>
                        <p className="text-sm text-gray-600">Converting PDF to image...</p>
                    </div>
                )}

                {!file && !isConverting && (
                    <p className="text-sm text-gray-600">
                        Drag & drop {side} image/PDF here, or click to browse
                    </p>
                )}

                {file && !isConverting && (
                    <div className="mt-4 flex flex-col items-center gap-3">
                        <img
                            src={file.url}
                            alt={file.name}
                            className="max-h-40 w-full rounded-lg object-contain shadow-sm"
                        />

                        <div className="mt-2 flex gap-2">
                            <button
                                className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSide(side);
                                }}
                            >
                                Remove
                            </button>
                            <button
                                className="rounded-lg bg-[#00BFA6] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#00D1B2]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    drop.open();
                                }}
                            >
                                Replace
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}