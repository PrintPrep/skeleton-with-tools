// components/tools/booklet-imposition/FileUploader.tsx

import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn, formatFileSize, isPdfFile } from '@/lib/booklet-imposition/utils';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/booklet-imposition/constants';
import { Button } from '@/components/ui/booklet-imposition/Button';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    currentFile: File | null;
    onClear: () => void;
}

export function FileUploader({ onFileSelect, currentFile, onClear }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        if (!isPdfFile(file)) {
            return 'Please upload a PDF file';
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`;
        }
        return null;
    };

    const handleFile = useCallback(
        (file: File) => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }
            setError(null);
            onFileSelect(file);
        },
        [onFileSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                handleFile(files[0]);
            }
        },
        [handleFile]
    );

    if (currentFile) {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-50 to-mint-50 border-2 border-teal-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-md">
                            <FileText className="w-8 h-8 text-teal-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">{currentFile.name}</p>
                            <p className="text-sm text-gray-600 font-medium mt-1">
                                {formatFileSize(currentFile.size)}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    'relative border-3 border-dashed rounded-2xl p-12 transition-all duration-300',
                    'hover:border-teal-400 hover:bg-teal-50/30',
                    isDragging
                        ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-mint-50 scale-105 shadow-xl shadow-teal-500/20'
                        : 'border-gray-300 bg-white shadow-lg',
                    error && 'border-red-500 bg-red-50'
                )}
            >
                <input
                    type="file"
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center text-center">
                    <div className={cn(
                        'p-5 rounded-2xl mb-6 transition-all duration-300',
                        isDragging
                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-xl shadow-teal-500/40'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    )}>
                        <Upload
                            className={cn(
                                'w-16 h-16 transition-colors duration-300',
                                isDragging ? 'text-white' : 'text-gray-500'
                            )}
                        />
                    </div>

                    <p className="text-2xl font-bold text-gray-900 mb-3">
                        {isDragging ? 'Drop your PDF here' : 'Upload PDF File'}
                    </p>

                    <p className="text-base text-gray-600 mb-6 font-medium">
                        Drag and drop or click to browse
                    </p>

                    <div className="px-4 py-2 bg-gray-100 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">
                            Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                </div>
            )}
        </div>
    );
}