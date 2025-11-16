// components/tools/ticket-layout/ExportButton.tsx

// app/components/ExportButton.tsx
"use client";

import { saveAs } from "file-saver";
import { useStore } from "@/lib/ticket-layout/zustandStore";
import { generatePDFFromPattern } from "@/lib/ticket-layout/pdfExport";

export default function ExportButton() {
    const front = useStore((s) => s.front);
    const back = useStore((s) => s.back);
    const layout = useStore((s) => s.layout);
    const placements = useStore((s) => s.placements);

    const handleExport = async () => {
        try {
            if (!front) {
                alert("Please upload a front side before exporting.");
                return;
            }
            if (!placements || placements.length === 0) {
                alert("Nothing optimized yet — run Optimize first.");
                return;
            }

            const totalCount = Number(layout.cardCount ?? 0) || placements.length;
            if (!totalCount || totalCount <= 0) {
                alert("Set number of cards/tickets needed in the Optimize panel.");
                return;
            }

            // front/back urls (could be object URLs)
            const frontUrl = front.url;
            const backUrl = back?.url ?? null;

            const pdfBytes = await generatePDFFromPattern(frontUrl, backUrl, placements, {
                paperWidthMm: layout.paperWidthMm ?? 210,
                paperHeightMm: layout.paperHeightMm ?? 297,
                totalCount,
                marginMm: 5,
            });

            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, "tickets_export.pdf");
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to export PDF. Check the console for details.");
        }
    };

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#28A745] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#34C759]"
        >
      <span className="inline-flex h-5 w-5 items-center justify-center">
        <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="h-3.5 w-3.5 text-white"
        >
          <path
              fill="currentColor"
              d="M10 2.5a.75.75 0 0 1 .75.75v7.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5A.75.75 0 0 1 6.53 8.2l2.22 2.22V3.25A.75.75 0 0 1 10 2.5Zm-5 9.75a.75.75 0 0 1 .75.75v1.75c0 .69.56 1.25 1.25 1.25h6a1.25 1.25 0 0 0 1.25-1.25V13a.75.75 0 0 1 1.5 0v1.75A2.75 2.75 0 0 1 13 17.5H7A2.75 2.75 0 0 1 4.25 14.75V13a.75.75 0 0 1 .75-.75Z"
          />
        </svg>
      </span>
            <span>Export PDF</span>
        </button>
    );
}
