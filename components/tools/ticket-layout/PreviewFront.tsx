// components/tools/ticket-layout/PreviewFront.tsx

"use client";

import React from "react";
import { useStore } from "@/lib/ticket-layout/zustandStore";

/**
 * PreviewFront
 *
 * Simple front-side preview component that always displays an image.
 * For PDFs, the upload flow converts the first page into an image and stores
 * it as `front.previewUrl` / `front.url`, so this component does not need to
 * treat PDFs specially.
 */
export default function PreviewFront() {
    const front = useStore((s) => s.front);

    if (!front) {
        return (
            <div className="text-gray-500 italic text-sm">
                No front side uploaded
            </div>
        );
    }

    const src = front.previewUrl ?? front.url;

    return (
        <div className="w-full flex items-center justify-center p-2">
            <img
                src={src}
                alt={front.name || "Front Preview"}
                className="max-w-[220px] rounded shadow border bg-white object-contain"
            />
        </div>
    );
}
