// components/tools/ticket-layout/WorkspaceLayout.tsx

"use client";

import React, { useRef } from "react";
import ExportButton from "./ExportButton";
import PaperPreview from "./PaperPreview";

export default function WorkspaceLayout() {
    const previewWrapperRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex w-full flex-col items-center gap-4">
            {/* Top controls */}
            {/* viewport wrapper with proper constraints */}
            <div
                ref={previewWrapperRef}
                className="preview relative flex w-full items-center justify-center rounded-2xl border border-white/70 px-6 py-8 backdrop-blur-xl overflow-hidden"
                style={{
                    maxHeight: "calc(100vh - 240px)",
                    minHeight: "400px",
                    height: "calc(100vh - 240px)"
                }}
            >
                <PaperPreview wrapperRef={previewWrapperRef} />
            </div>
        </div>
    );
}