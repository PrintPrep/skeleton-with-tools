// components/tools/pdf-toolkit/ExportDialog.tsx
// ADDED: Select All functionality with order preservation

import React from 'react';
import { Download } from 'lucide-react';
import { Page, Section } from '@/lib/pdf-toolkit/types';

interface ExportDialogProps {
    sections: Section[];
    pages: Page[];
    selectedSections: string[];
    isProcessing: boolean;
    onToggleSection: (sectionId: string) => void;
    onExport: () => void;
    onClose: () => void;
}

export default function ExportDialog({
                                         sections,
                                         pages,
                                         selectedSections,
                                         isProcessing,
                                         onToggleSection,
                                         onExport,
                                         onClose,
                                     }: ExportDialogProps) {
    // Check if all sections are selected
    const allSelected = sections.length > 0 && selectedSections.length === sections.length;

    // Check if some (but not all) sections are selected
    const someSelected = selectedSections.length > 0 && selectedSections.length < sections.length;

    // Handle Select All / Deselect All
    const handleSelectAll = () => {
        if (allSelected) {
            // Deselect all - pass empty array to parent
            sections.forEach(section => {
                if (selectedSections.includes(section.id)) {
                    onToggleSection(section.id);
                }
            });
        } else {
            // Select all sections that aren't already selected (preserves order)
            sections.forEach(section => {
                if (!selectedSections.includes(section.id)) {
                    onToggleSection(section.id);
                }
            });
        }
    };

    // Get preview pages in user's selection order
    const getPreviewPages = (): Page[] => {
        const previewPages: Page[] = [];

        selectedSections.forEach(sectionId => {
            const section = sections.find(s => s.id === sectionId);
            if (section) {
                const sectionPages = pages.filter(p => section.pageIds.includes(p.id));
                previewPages.push(...sectionPages);
            }
        });

        return previewPages;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Merge & Export PDF</h2>
                    <p className="text-sm text-gray-600 mt-1">Select sections to include in the final PDF</p>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Section Selection */}
                    <div className="w-2/5 border-r border-gray-200 overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-700">Select Sections</h3>

                            {/* Select All Button */}
                            <button
                                onClick={handleSelectAll}
                                disabled={sections.length === 0}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#00BFA6] hover:bg-[#00A890] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={() => {}} // Handled by button click
                                    ref={(el) => {
                                        if (el) {
                                            el.indeterminate = someSelected;
                                        }
                                    }}
                                    className="w-3.5 h-3.5 cursor-pointer accent-white pointer-events-none"
                                />
                                {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {sections.map((section) => {
                                const isSelected = selectedSections.includes(section.id);
                                const selectionOrder = selectedSections.indexOf(section.id) + 1;

                                return (
                                    <label
                                        key={section.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-[#E0F7F4] hover:border-[#00BFA6] transition-all"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onToggleSection(section.id)}
                                                className="w-5 h-5 cursor-pointer accent-[#00BFA6]"
                                            />
                                            {isSelected && (
                                                <span className="absolute -top-1 -right-1 bg-[#A259FF] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                                                    {selectionOrder}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-gray-800 truncate">
                                                {section.name}
                                            </div>
                                            <div className="text-xs text-gray-600 font-medium">
                                                {section.pageIds.length} page(s)
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview - Vertical Scrollable Thumbnails */}
                    <div className="w-3/5 overflow-y-auto p-6 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Preview ({getPreviewPages().length} pages)
                        </h3>

                        {selectedSections.length === 0 ? (
                            <div className="text-center py-24 text-gray-400">
                                <Download size={48} className="mx-auto mb-4 opacity-40" />
                                <p className="text-sm">Select sections to preview</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-w-md mx-auto">
                                {getPreviewPages().map((page, index) => (
                                    <div
                                        key={page.id}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {/* Page Number Header */}
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-700">
                                                Page {index + 1}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {page.fileName} (p{page.pageNumber})
                                            </span>
                                        </div>

                                        {/* Thumbnail */}
                                        <div className="p-4 flex justify-center bg-gray-100">
                                            {page.thumbnail ? (
                                                <img
                                                    src={page.thumbnail}
                                                    alt={`Page ${index + 1} preview`}
                                                    className="max-w-full h-auto shadow-md rounded border border-gray-300"
                                                    style={{ maxHeight: '300px' }}
                                                />
                                            ) : (
                                                <div className="w-full aspect-[3/4] bg-white flex items-center justify-center border border-gray-300 rounded">
                                                    <div className="text-center text-gray-400">
                                                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="text-sm">Page {page.pageNumber}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onExport}
                        disabled={selectedSections.length === 0 || isProcessing}
                        className="flex-1 bg-[#34C759] hover:bg-[#28A745] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                    >
                        <Download size={18} />
                        Export & Download ({selectedSections.length})
                    </button>
                </div>
            </div>
        </div>
    );
}