// lib/sticker-pack/utils.ts

export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            // Convert pixels to mm (assuming 96 DPI)
            const widthMM = (img.width / 96) * 25.4;
            const heightMM = (img.height / 96) * 25.4;
            URL.revokeObjectURL(url);
            resolve({ width: widthMM, height: heightMM });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

export function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}