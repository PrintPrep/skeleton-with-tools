// components/tools/ticket-layout/OptimizePanel.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/ticket-layout/zustandStore";
import { optimizeLayout } from "@/lib/ticket-layout/optimize";

// ----------------------------------------------------
// ALL COMMON PAPER SIZES (A-series, B-series, US)
// ----------------------------------------------------
const PRESET_SIZES = {
    // ISO A-series
    A0: { w: 841, h: 1189 },
    A1: { w: 594, h: 841 },
    A2: { w: 420, h: 594 },
    A3: { w: 297, h: 420 },
    A4: { w: 210, h: 297 },
    A5: { w: 148, h: 210 },
    A6: { w: 105, h: 148 },
    A7: { w: 74, h: 105 },
    A8: { w: 52, h: 74 },
    A9: { w: 37, h: 52 },
    A10: { w: 26, h: 37 },

    // ISO B-series
    B0: { w: 1000, h: 1414 },
    B1: { w: 707, h: 1000 },
    B2: { w: 500, h: 707 },
    B3: { w: 353, h: 500 },
    B4: { w: 250, h: 353 },
    B5: { w: 176, h: 250 },
    B6: { w: 125, h: 176 },
    B7: { w: 88, h: 125 },
    B8: { w: 62, h: 88 },
    B9: { w: 44, h: 62 },
    B10: { w: 31, h: 44 },

    // US common
    Letter: { w: 216, h: 279 },
    Legal: { w: 216, h: 356 },
    Tabloid: { w: 279, h: 432 },
    Executive: { w: 184, h: 267 },
};

type PaperSize = keyof typeof PRESET_SIZES | "Custom";

/**
 * Safety helpers:
 */
function clampNumber(raw: unknown, min = 3) {
    const n = Number(raw);
    if (!isFinite(n)) return min;
    return Math.max(min, n);
}
function clampInt(raw: unknown, min = 0) {
    const n = Number(raw);
    if (!isFinite(n)) return min;
    return Math.max(min, Math.floor(n));
}

export default function OptimizePanel() {
    const layout = useStore((s) => s.layout);
    const setLayout = useStore((s) => s.setLayout);
    const setPlacements = useStore((s) => s.setPlacements);

    const [paperSize, setPaperSize] = useState<PaperSize>(
        (layout.paperSize as PaperSize) || "A4"
    );

    // Use string state to allow empty inputs
    const [paperW, setPaperW] = useState<string>(String(layout.paperWidthMm ?? 210));
    const [paperH, setPaperH] = useState<string>(String(layout.paperHeightMm ?? 297));
    const [cardW, setCardW] = useState<string>(String(layout.cardWidthMm ?? 50));
    const [cardH, setCardH] = useState<string>(String(layout.cardHeightMm ?? 90));
    const [cardCount, setCardCount] = useState<string>(String(layout.cardCount ?? 0));

    const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(
        layout.aspectRatioLocked || false
    );
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(
        layout.aspectRatio
    );

    const [horizontalOnly, setHorizontalOnly] = useState(
        layout.horizontalOnly || false
    );
    const [verticalOnly, setVerticalOnly] = useState(
        layout.verticalOnly || false
    );
    const [autoRotate, setAutoRotate] = useState(layout.autoRotate ?? true);

    const [lastResult, setLastResult] = useState({ fitted: 0 });

    // -------------------------------
    // Sync paper preset
    // -------------------------------
    useEffect(() => {
        if (paperSize === "Custom") return;
        const preset = PRESET_SIZES[paperSize as keyof typeof PRESET_SIZES];
        if (preset) {
            setPaperW(String(preset.w));
            setPaperH(String(preset.h));
        }
    }, [paperSize]);

    // -------------------------------
    // Sync store when layout changes externally
    // -------------------------------
    useEffect(() => {
        if (layout.cardWidthMm !== undefined)
            setCardW(String(layout.cardWidthMm));
        if (layout.cardHeightMm !== undefined)
            setCardH(String(layout.cardHeightMm));
        if (layout.aspectRatioLocked !== undefined)
            setAspectRatioLocked(layout.aspectRatioLocked);
        if (layout.aspectRatio !== undefined) setAspectRatio(layout.aspectRatio);
        if (layout.paperWidthMm !== undefined)
            setPaperW(String(layout.paperWidthMm));
        if (layout.paperHeightMm !== undefined)
            setPaperH(String(layout.paperHeightMm));
        if (layout.cardCount !== undefined)
            setCardCount(String(layout.cardCount));
    }, [
        layout.cardWidthMm,
        layout.cardHeightMm,
        layout.aspectRatioLocked,
        layout.aspectRatio,
        layout.paperWidthMm,
        layout.paperHeightMm,
        layout.cardCount,
    ]);

    function applyToStore() {
        setLayout({
            paperSize: paperSize as any,
            paperWidthMm: clampNumber(paperW, 3),
            paperHeightMm: clampNumber(paperH, 3),
            cardWidthMm: clampNumber(cardW, 3),
            cardHeightMm: clampNumber(cardH, 3),
            cardCount: clampInt(cardCount, 0),
            horizontalOnly,
            verticalOnly,
            autoRotate,
            aspectRatioLocked,
            aspectRatio,
        });
    }

    // -------------------------------
    // Card dimension handlers
    // -------------------------------
    function handleCardHeightChange(newHeight: string) {
        setCardH(newHeight);

        if (aspectRatioLocked && newHeight) {
            const parsedHeight = Number(newHeight);
            if (isFinite(parsedHeight) && parsedHeight > 0) {
                const ratio = aspectRatio ?? (Number(cardW) / parsedHeight);
                if (ratio > 0 && isFinite(ratio)) {
                    const newW = parsedHeight * ratio;
                    setCardW(String(newW.toFixed(2)));
                }
            }
        }
    }

    function handleCardWidthChange(newWidth: string) {
        setCardW(newWidth);
    }

    function handleAspectRatioLockToggle(locked: boolean) {
        setAspectRatioLocked(locked);
        if (locked) {
            const currentW = Number(cardW);
            const currentH = Number(cardH);
            let currentRatio = aspectRatio;
            if (!currentRatio || !isFinite(currentRatio) || currentRatio === 0) {
                const denom = currentH || 1;
                currentRatio = currentW / denom;
                setAspectRatio(currentRatio);
            }
            if (currentRatio && currentRatio > 0 && currentH > 0) {
                const adjustedWidth = currentH * currentRatio;
                setCardW(String(adjustedWidth.toFixed(2)));
            }
        }
    }

    // -------------------------------
    // Checkbox handler
    // -------------------------------
    function handleCheckbox(type: "horizontal" | "vertical" | "auto") {
        if (type === "horizontal") {
            setHorizontalOnly(true);
            setVerticalOnly(false);
            setAutoRotate(false);
        } else if (type === "vertical") {
            setHorizontalOnly(false);
            setVerticalOnly(true);
            setAutoRotate(false);
        } else {
            setHorizontalOnly(false);
            setVerticalOnly(false);
            setAutoRotate(true);
        }
    }

    // -------------------------------
    // Paper dimension handlers
    // -------------------------------
    function handlePaperWidthChange(value: string) {
        setPaperW(value);
        const parsed = Number(value);
        if (isFinite(parsed)) {
            const matched = Object.entries(PRESET_SIZES).find(
                ([, dim]) => dim.w === parsed && dim.h === Number(paperH)
            );
            setPaperSize(matched ? (matched[0] as PaperSize) : "Custom");
        }
    }

    function handlePaperHeightChange(value: string) {
        setPaperH(value);
        const parsed = Number(value);
        if (isFinite(parsed)) {
            const matched = Object.entries(PRESET_SIZES).find(
                ([, dim]) => dim.w === Number(paperW) && dim.h === parsed
            );
            setPaperSize(matched ? (matched[0] as PaperSize) : "Custom");
        }
    }

    function handleCardCountChange(value: string) {
        setCardCount(value);
    }

    // -------------------------------
    // AUTO OPTIMIZE
    // -------------------------------
    useEffect(() => {
        applyToStore();

        const opts = {
            paperWidthMm: clampNumber(paperW, 3),
            paperHeightMm: clampNumber(paperH, 3),
            cardWidthMm: clampNumber(cardW, 3),
            cardHeightMm: clampNumber(cardH, 3),
            cardCount: clampInt(cardCount, 0) > 0 ? clampInt(cardCount, 0) : undefined,
            horizontalOnly,
            verticalOnly,
            autoRotate,
            marginMm: 5,
        };

        const res = optimizeLayout(opts);
        setPlacements(res.placements);
        setLastResult({ fitted: res.fittedCount });
    }, [
        paperW,
        paperH,
        cardW,
        cardH,
        cardCount,
        horizontalOnly,
        verticalOnly,
        autoRotate,
        aspectRatioLocked,
        aspectRatio,
    ]);

    // -------------------------------
    // RENDER
    // -------------------------------
    return (
        <aside className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="font-heading mb-4 text-lg text-gray-800">Optimize layout</h3>

            {/* Paper size */}
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                Paper
            </label>
            <div className="mb-4 flex gap-2">
                <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition-colors focus:border-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]"
                >
                    {Object.entries(PRESET_SIZES).map(([key, val]) => (
                        <option key={key} value={key}>
                            {key} ({val.w} × {val.h} mm)
                        </option>
                    ))}
                    <option value="Custom">Custom</option>
                </select>
            </div>

            {/* Paper dimensions */}
            <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                    <label className="mb-1 block text-xs text-gray-600">
                        Paper width (mm)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={paperW}
                        onChange={(e) => handlePaperWidthChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 shadow-sm outline-none transition-colors focus:border-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-gray-600">
                        Paper height (mm)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={paperH}
                        onChange={(e) => handlePaperHeightChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 shadow-sm outline-none transition-colors focus:border-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]"
                    />
                </div>
            </div>

            {/* Card size */}
            <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                    Card / Ticket size (mm)
                </label>
                <div className="flex items-center gap-2">
                    <input
                        id="aspectLock"
                        type="checkbox"
                        checked={aspectRatioLocked}
                        onChange={(e) => handleAspectRatioLockToggle(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#00BFA6] focus:ring-[#00BFA6]"
                    />
                    <label
                        htmlFor="aspectLock"
                        className="text-xs text-gray-600 cursor-pointer"
                    >
                        Lock aspect ratio
                    </label>
                </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
                <input
                    type="number"
                    min={0}
                    value={cardW}
                    onChange={(e) => handleCardWidthChange(e.target.value)}
                    disabled={aspectRatioLocked}
                    className={`rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 shadow-sm outline-none transition-colors ${
                        aspectRatioLocked ? "cursor-not-allowed opacity-60 bg-gray-50" : ""
                    }`}
                    placeholder="width"
                />
                <input
                    type="number"
                    min={0}
                    value={cardH}
                    onChange={(e) => handleCardHeightChange(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 shadow-sm outline-none transition-colors"
                    placeholder="height"
                />
            </div>

            {/* Card count */}
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                Number of cards (optional)
            </label>
            <input
                type="number"
                min={0}
                value={cardCount}
                onChange={(e) => handleCardCountChange(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 shadow-sm outline-none transition-colors focus:border-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6] placeholder:text-gray-400"
                placeholder="0 = fill maximum"
            />

            {/* Orientation */}
            <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        id="hor"
                        type="checkbox"
                        checked={horizontalOnly}
                        onChange={() => handleCheckbox("horizontal")}
                        className="h-4 w-4 rounded border-gray-300 text-[#00BFA6] focus:ring-[#00BFA6]"
                    />
                    <label htmlFor="hor" className="text-sm text-gray-600">
                        Horizontal only
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="ver"
                        type="checkbox"
                        checked={verticalOnly}
                        onChange={() => handleCheckbox("vertical")}
                        className="h-4 w-4 rounded border-gray-300 text-[#00BFA6] focus:ring-[#00BFA6]"
                    />
                    <label htmlFor="ver" className="text-sm text-gray-600">
                        Vertical only
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="autor"
                        type="checkbox"
                        checked={autoRotate}
                        onChange={() => handleCheckbox("auto")}
                        className="h-4 w-4 rounded border-gray-300 text-[#00BFA6] focus:ring-[#00BFA6]"
                    />
                    <label htmlFor="autor" className="text-sm text-gray-600">
                        Auto-rotate to fit more
                    </label>
                </div>
            </div>

            {/* Fitted */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Fitted</span>
                <strong className="rounded-full bg-[#00BFA6] px-2 py-0.5 text-xs font-bold text-white">
                    {lastResult.fitted}
                </strong>
            </div>
        </aside>
    );
}