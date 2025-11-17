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
        // Check file type
        if (!isPdfFile(file)) {
            return 'Please upload a PDF file';
        }

        // Check file size
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
                <div className="flex items-center justify-between p-4 bg-primary-50 border-2 border-primary-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary-600" />
                        <div>
                            <p className="font-medium text-gray-900">{currentFile.name}</p>
                            <p className="text-sm text-gray-600">
                                {formatFileSize(currentFile.size)}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <X className="w-5 h-5" />
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
                    'relative border-2 border-dashed rounded-lg p-8 transition-all',
                    isDragging
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400',
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
                    <Upload
                        className={cn(
                            'w-12 h-12 mb-4',
                            isDragging ? 'text-primary-600' : 'text-gray-400'
                        )}
                    />

                    <p className="text-lg font-medium text-gray-900 mb-2">
                        {isDragging ? 'Drop your PDF here' : 'Upload PDF File'}
                    </p>

                    <p className="text-sm text-gray-600 mb-4">
                        Drag and drop or click to browse
                    </p>

                    <p className="text-xs text-gray-500">
                        Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
                    </p>
                </div>
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}