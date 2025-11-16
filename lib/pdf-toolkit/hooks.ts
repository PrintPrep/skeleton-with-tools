// lib/pdf-toolkit/hooks.ts
// FIXED: Back to simple working version with auto-scroll added

import { useState, useEffect, useRef } from 'react';

/**
 * Hook for managing drag and drop state for sections
 */
export function useSectionDragDrop() {
    const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedSectionIndex(index);
    };

    const handleDragOver = (index: number) => {
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedSectionIndex(null);
        setDragOverIndex(null);
    };

    return {
        draggedSectionIndex,
        dragOverIndex,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDragEnd,
    };
}

/**
 * Hook for managing drag and drop state for pages
 */
export function usePageDragDrop() {
    const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
    const [hoverPageId, setHoverPageId] = useState<string | null>(null);

    const handleDragStart = (pageId: string) => {
        setDraggedPageId(pageId);
    };

    const handleDragEnd = () => {
        setDraggedPageId(null);
        setHoverPageId(null);
    };

    const handleDragEnter = (pageId: string) => {
        setHoverPageId(pageId);
    };

    const handleDragLeave = () => {
        setHoverPageId(null);
    };

    return {
        draggedPageId,
        hoverPageId,
        handleDragStart,
        handleDragEnd,
        handleDragEnter,
        handleDragLeave,
    };
}

/**
 * Hook for managing section editing state
 */
export function useSectionEdit() {
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editingSectionName, setEditingSectionName] = useState<string>('');

    const startEdit = (sectionId: string, currentName: string) => {
        setEditingSectionId(sectionId);
        setEditingSectionName(currentName);
    };

    const cancelEdit = () => {
        setEditingSectionId(null);
        setEditingSectionName('');
    };

    return {
        editingSectionId,
        editingSectionName,
        setEditingSectionName,
        startEdit,
        cancelEdit,
    };
}

/**
 * Hook for smooth auto-scroll during drag and drop
 */
export function useAutoScroll() {
    const scrollIntervalRef = useRef<number | null>(null);
    const scrollSpeedRef = useRef<number>(0);

    useEffect(() => {
        return () => {
            if (scrollIntervalRef.current) {
                window.clearInterval(scrollIntervalRef.current);
            }
        };
    }, []);

    const handleDragOver = (e: React.DragEvent, containerElement: HTMLElement | null) => {
        if (!containerElement) return;

        const rect = containerElement.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const containerHeight = rect.height;

        // Define scroll zones (top 20% and bottom 20%)
        const scrollZoneSize = containerHeight * 0.2;
        const topZone = scrollZoneSize;
        const bottomZone = containerHeight - scrollZoneSize;

        let scrollSpeed = 0;

        // Top zone - scroll up
        if (mouseY < topZone && mouseY > 0) {
            const intensity = 1 - (mouseY / topZone);
            scrollSpeed = -15 * Math.pow(intensity, 1.5);
        }
        // Bottom zone - scroll down
        else if (mouseY > bottomZone && mouseY < containerHeight) {
            const intensity = (mouseY - bottomZone) / scrollZoneSize;
            scrollSpeed = 15 * Math.pow(intensity, 1.5);
        }

        scrollSpeedRef.current = scrollSpeed;

        // Start scroll interval if not already running
        if (scrollSpeed !== 0 && !scrollIntervalRef.current) {
            scrollIntervalRef.current = window.setInterval(() => {
                if (containerElement && scrollSpeedRef.current !== 0) {
                    containerElement.scrollTop += scrollSpeedRef.current;
                }
            }, 16); // ~60fps
        }
        // Stop scroll interval if speed is 0
        else if (scrollSpeed === 0 && scrollIntervalRef.current) {
            window.clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    const stopScrolling = () => {
        scrollSpeedRef.current = 0;
        if (scrollIntervalRef.current) {
            window.clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    return {
        handleDragOver,
        stopScrolling,
    };
}