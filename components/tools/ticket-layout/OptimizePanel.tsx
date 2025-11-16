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

    // initialize with safe values (min 3)
    const initialPaperW = clampNumber(layout.paperWidthMm ?? 210, 3);
    const initialPaperH = clampNumber(layout.paperHeightMm ?? 297, 3);
    const initialCardW = clampNumber(layout.cardWidthMm ?? 50, 3);
    const initialCardH = clampNumber(layout.cardHeightMm ?? 90, 3);
    const initialCardCount = clampInt(layout.cardCount ?? 0, 0);

    const [paperW, setPaperW] = useState<number>(initialPaperW);
    const [paperH, setPaperH] = useState<number>(initialPaperH);
    const [cardW, setCardW] = useState<number>(initialCardW);
    const [cardH, setCardH] = useState<number>(initialCardH);
    const [cardCount, setCardCount] = useState<number>(initialCardCount);

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
            setPaperW(clampNumber(preset.w, 3));
            setPaperH(clampNumber(preset.h, 3));
        }
    }, [paperSize]);

    // -------------------------------
    // Sync store when layout changes externally
    // -------------------------------
    useEffect(() => {
        if (layout.cardWidthMm !== undefined)
            setCardW(clampNumber(layout.cardWidthMm, 3));
        if (layout.cardHeightMm !== undefined)
            setCardH(clampNumber(layout.cardHeightMm, 3));
        if (layout.aspectRatioLocked !== undefined)
            setAspectRatioLocked(layout.aspectRatioLocked);
        if (layout.aspectRatio !== undefined) setAspectRatio(layout.aspectRatio);
        if (layout.paperWidthMm !== undefined)
            setPaperW(clampNumber(layout.paperWidthMm, 3));
        if (layout.paperHeightMm !== undefined)
            setPaperH(clampNumber(layout.paperHeightMm, 3));
        if (layout.cardCount !== undefined)
            setCardCount(clampInt(layout.cardCount, 0));
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
            paperWidthMm: Number(Math.max(3, Number(paperW || 3))),
            paperHeightMm: Number(Math.max(3, Number(paperH || 3))),
            cardWidthMm: Number(Math.max(3, Number(cardW || 3))),
            cardHeightMm: Number(Math.max(3, Number(cardH || 3))),
            cardCount: Number(clampInt(cardCount, 0)),
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
    function handleCardHeightChange(newHeightRaw: string | number) {
        const parsed = Number(newHeightRaw);
        setCardH(isFinite(parsed) ? parsed : 0);

        if (aspectRatioLocked) {
            const ratio = aspectRatio ?? cardW / (cardH || 1);
            if (ratio > 0 && isFinite(ratio)) {
                const newW = Number((Number(newHeightRaw) * ratio).toFixed(2));
                setCardW(isFinite(newW) ? newW : cardW);
            }
        }
    }

    function handleCardWidthChange(newWidthRaw: string | number) {
        const parsed = Number(newWidthRaw);
        setCardW(isFinite(parsed) ? parsed : 0);
    }

    function handleAspectRatioLockToggle(locked: boolean) {
        setAspectRatioLocked(locked);
        if (locked) {
            let currentRatio = aspectRatio;
            if (!currentRatio || !isFinite(currentRatio) || currentRatio === 0) {
                const denom = cardH || 1;
                currentRatio = cardW / denom;
                setAspectRatio(currentRatio);
            }
            if (currentRatio && currentRatio > 0) {
                const adjustedWidth = Number((cardH * currentRatio).toFixed(2));
                setCardW(isFinite(adjustedWidth) ? adjustedWidth : cardW);
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
    function handlePaperWidthChange(valueRaw: string | number) {
        const parsed = Number(valueRaw);
        setPaperW(isFinite(parsed) ? parsed : 0);
        const matched = Object.entries(PRESET_SIZES).find(
            ([, dim]) => dim.w === parsed && dim.h === paperH
        );
        setPaperSize(matched ? (matched[0] as PaperSize) : "Custom");
    }

    function handlePaperHeightChange(valueRaw: string | number) {
        const parsed = Number(valueRaw);
        setPaperH(isFinite(parsed) ? parsed : 0);
        const matched = Object.entries(PRESET_SIZES).find(
            ([, dim]) => dim.w === paperW && dim.h === parsed
        );
        setPaperSize(matched ? (matched[0] as PaperSize) : "Custom");
    }

    function handleCardCountChange(raw: string | number) {
        const parsed = Number(raw);
        setCardCount(isFinite(parsed) ? Math.floor(parsed) : 0);
    }

    // -------------------------------
    // AUTO OPTIMIZE
    // -------------------------------
    useEffect(() => {
        applyToStore();

        const opts = {
            paperWidthMm: Math.max(3, Number(paperW || 3)),
            paperHeightMm: Math.max(3, Number(paperH || 3)),
            cardWidthMm: Math.max(3, Number(cardW || 3)),
            cardHeightMm: Math.max(3, Number(cardH || 3)),
            cardCount: Number(cardCount) > 0 ? Number(cardCount) : undefined,
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
