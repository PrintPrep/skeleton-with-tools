// components/tools/ticket-layout/PaperPreview.tsx

"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useStore } from "@/lib/ticket-layout/zustandStore";
import PlacementSlot from "./PlacementSlot";
import FittedBadge from "./FittedBadge";
import BottomAccent from "./BottomAccent";

type Placement = {
    index: number;
    xMm: number;
    yMm: number;
    widthMm: number;
    heightMm: number;
    rotation?: number;
};

interface PaperPreviewProps {
    wrapperRef?: React.RefObject<HTMLDivElement>;
}

export default function PaperPreview({ wrapperRef }: PaperPreviewProps) {
    const front = useStore((s) => s.front);
    const layout = useStore((s) => s.layout);
    const placements = useStore((s) => s.placements) as Placement[];

    const BASE_PX_PER_MM = 3;
    const pxPerMm = BASE_PX_PER_MM;

    const paperPx = useMemo(() => {
        const w = Math.round((layout.paperWidthMm ?? 210) * BASE_PX_PER_MM);
        const h = Math.round((layout.paperHeightMm ?? 297) * BASE_PX_PER_MM);
        return { w, h };
    }, [layout.paperWidthMm, layout.paperHeightMm]);

    const internalWrapperRef = useRef<HTMLDivElement | null>(null);
    const pageRef = useRef<HTMLDivElement | null>(null);

    const effectiveWrapperRef = wrapperRef || internalWrapperRef;

    const [scale, setScale] = useState<number>(1);
    const [fitted, setFitted] = useState<boolean>(false);

    useEffect(() => {
        function recompute() {
            const wrapper = effectiveWrapperRef.current;
            if (!wrapper) return;

            const style = getComputedStyle(wrapper);
            const padLeft = parseFloat(style.paddingLeft || "0");
            const padRight = parseFloat(style.paddingRight || "0");
            const padTop = parseFloat(style.paddingTop || "0");
            const padBottom = parseFloat(style.paddingBottom || "0");

            // Account for padding and give some margin for safety
            const availableWidth = Math.max(120, wrapper.clientWidth - padLeft - padRight - 40);
            const availableHeight = Math.max(200, wrapper.clientHeight - padTop - padBottom - 40);

            const scaleByWidth = availableWidth / paperPx.w;
            const scaleByHeight = availableHeight / paperPx.h;

            const newScale = Math.min(1, scaleByWidth, scaleByHeight);

            if (Math.abs(newScale - scale) > 0.001) {
                setScale(newScale);
                setFitted(newScale < 1);
            } else {
                setFitted(newScale < 1);
            }
        }

        recompute();
        const rAFHandler = () => window.requestAnimationFrame(recompute);
        window.addEventListener("resize", rAFHandler);
        const ro = new ResizeObserver(recompute);
        if (effectiveWrapperRef.current) ro.observe(effectiveWrapperRef.current);

        return () => {
            window.removeEventListener("resize", rAFHandler);
            try {
                ro.disconnect();
            } catch {}
        };
    }, [paperPx.w, paperPx.h, scale, effectiveWrapperRef]);

    // Calculate the actual display size after scaling
    const scaledWidth = paperPx.w * scale;
    const scaledHeight = paperPx.h * scale;

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {fitted && <FittedBadge />}

            {/* Container that matches the scaled size */}
            <div
                style={{
                    position: "relative",
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    flexShrink: 0
                }}
            >
                <div
                    ref={pageRef}
                    className="relative rounded-md border bg-white shadow-xl"
                    style={{
                        width: `${paperPx.w}px`,
                        height: `${paperPx.h}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        transition: "transform 200ms ease",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                        border: "1px solid rgba(15,23,42,0.06)",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        {placements.map((p) => (
                            <PlacementSlot
                                key={p.index}
                                p={p}
                                pxPerMm={pxPerMm}
                                front={front}
                            />
                        ))}
                    </div>
                </div>

                <BottomAccent paperPx={paperPx} scale={scale} />
            </div>
        </div>
    );
}