// components/tools/ticket-layout/PlacementSlot.tsx

"use client";

import React from "react";
import type { SideFile } from "@/lib/ticket-layout/zustandStore";

type Placement = {
    index: number;
    xMm: number;
    yMm: number;
    widthMm: number;
    heightMm: number;
    rotation?: number;
};

function looksLikeImageByName(name?: string) {
    if (!name) return false;
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name);
}

/**
 * PlacementSlot
 * - Render image preview for uploaded images (object URL) or for PDF preview images (previewUrl).
 * - Tries several heuristics to decide whether the uploaded side is an image:
 *    1) front.type === "image"
 *    2) front.file?.type startsWith("image/")
 *    3) filename extension indicates an image
 * - If rotation === 90, the image is drawn inside a rotated container so it visually fits.
 */
export default function PlacementSlot({
                                          p,
                                          front,
                                          pxPerMm,
                                      }: {
    p: Placement;
    front?: SideFile;
    pxPerMm: number;
}) {
    const left = p.xMm * pxPerMm;
    const top = p.yMm * pxPerMm;
    const w = p.widthMm * pxPerMm;
    const h = p.heightMm * pxPerMm;
    const isRot = (p.rotation ?? 0) === 90;

    const slotStyle: React.CSSProperties = {
        position: "absolute",
        left,
        top,
        width: w,
        height: h,
        border: "1px dashed rgba(0,0,0,0.12)",
        boxSizing: "border-box",
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    // Heuristic: decide if we have an image source for preview
    const fileType = (front as any)?.file?.type as string | undefined;
    const name = front?.name;
    const explicitImageType = front?.type === "image";
    const fileMimeImage = typeof fileType === "string" && fileType.startsWith("image/");
    const nameLooksImage = looksLikeImageByName(name);

    const hasImageSource = explicitImageType || fileMimeImage || nameLooksImage;
    // If it's a PDF but a previewUrl was generated (by other code), prefer that
    const pdfPreviewUrl = (front as any)?.previewUrl as string | undefined;

    // imageSrc chosen in priority:
    // - if we have an obvious image, use front.url
    // - else if PDF previewUrl exists, use it
    // - else undefined (show placeholder)
    const imageSrc = hasImageSource ? front?.url : pdfPreviewUrl ?? undefined;

    return (
        <div key={p.index} style={slotStyle} title={`#${p.index + 1}`}>
            {imageSrc ? (
                !isRot ? (
                    <img
                        src={imageSrc}
                        alt={front?.name ?? `slot-${p.index}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                ) : (
                    // rotated container: center and rotate 90deg so the image appears rotated inside the slot
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: `${h}px`,
                            height: `${w}px`,
                            transform: "translate(-50%,-50%) rotate(90deg)",
                            transformOrigin: "center center",
                            overflow: "hidden",
                            display: "flex",
                        }}
                    >
                        <img
                            src={imageSrc}
                            alt={front?.name ?? `slot-${p.index}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </div>
                )
            ) : (
                <div className="flex items-center justify-center h-full w-full text-xs text-gray-500">
                    {front ? "Front page (PDF/image)" : "No front uploaded"}
                </div>
            )}

            <div
                style={{
                    position: "absolute",
                    bottom: 6,
                    right: 8,
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "#ffffff",
                    backgroundColor: "#00BFA6",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    pointerEvents: "none",
                }}
            >
                {p.index + 1}
            </div>
        </div>
    );
}
