// app/tools/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Layout, Download, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F7F4] via-[#B3EDE5] to-[#80E3D7]">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/30 px-4 py-2 backdrop-blur">
                        <Sparkles className="h-5 w-5 text-[#00BFA6]" />
                        <span className="text-sm font-semibold text-gray-700">
              Smart Sticker Pack Creator
            </span>
                    </div>

                    <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-7xl">
                        Design Stunning
                        <br />
                        <span className="text-[#00BFA6]">Stickers & Cards</span> 🎨
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-700 md:text-xl">
                        Create, customize, and export printable designs effortlessly — a Canva-style
                        experience made just for sticker creators.
                    </p>

                    <button
                        onClick={() => router.push('/tools/sticker-pack/editor')}
                        className="group inline-flex items-center gap-3 rounded-lg bg-[#00BFA6] px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:bg-[#00D1B2] hover:shadow-2xl hover:scale-105"
                    >
                        Start Designing
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="mt-4 text-sm text-gray-600">
                        No accounts. No clutter. Just creativity unleashed.
                    </p>
                </div>

                {/* Features */}
                <div className="mx-auto mt-20 grid max-w-5xl gap-8 md:grid-cols-3">
                    <div className="rounded-2xl bg-white/60 p-6 backdrop-blur transition-all hover:bg-white/80 hover:shadow-lg">
                        <div className="mb-4 inline-flex rounded-full bg-[#00BFA6]/10 p-3">
                            <Upload className="h-6 w-6 text-[#00BFA6]" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900">Easy Upload</h3>
                        <p className="text-gray-600">
                            Upload multiple images in seconds. Supports JPEG, PNG formats.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/60 p-6 backdrop-blur transition-all hover:bg-white/80 hover:shadow-lg">
                        <div className="mb-4 inline-flex rounded-full bg-[#00BFA6]/10 p-3">
                            <Layout className="h-6 w-6 text-[#00BFA6]" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900">Smart Layout</h3>
                        <p className="text-gray-600">
                            Our algorithm optimizes sticker placement for maximum efficiency.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/60 p-6 backdrop-blur transition-all hover:bg-white/80 hover:shadow-lg">
                        <div className="mb-4 inline-flex rounded-full bg-[#00BFA6]/10 p-3">
                            <Download className="h-6 w-6 text-[#00BFA6]" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900">Export PDF</h3>
                        <p className="text-gray-600">
                            Download high-quality, print-ready PDFs with one click.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-sm text-gray-600">
                    Made with ❤️ for creators
                </div>
            </div>
        </div>
    );
}

function Upload({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
        </svg>
    );
}