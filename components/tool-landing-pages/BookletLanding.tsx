// app/tools/booklet-imposition/page.tsx

import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0F7F4] via-white to-gray-50">
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
                        PDF Booklet Tools
                    </h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        Transform your PDFs into professionally formatted booklets for printing
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Link
                        href="/flipbook"
                        className="group"
                    >
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#00BFA6] p-8 h-full flex flex-col">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-20 h-20 bg-[#E0F7F4] rounded-lg flex items-center justify-center group-hover:bg-[#00BFA6] transition-colors">
                                    <BookOpen className="w-12 h-12 text-[#00BFA6] group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-semibold mb-3 text-gray-900 text-center">
                                Flipbook Converter
                            </h2>
                            <p className="text-gray-600 text-center flex-1">
                                Convert your PDF into a booklet with interactive flipbook preview and sheet-wise layout
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-[#00BFA6] font-medium group-hover:gap-3 transition-all">
                                Get Started
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/booklet"
                        className="group"
                    >
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#A259FF] p-8 h-full flex flex-col">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-[#A259FF] transition-colors">
                                    <FileText className="w-12 h-12 text-[#A259FF] group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-semibold mb-3 text-gray-900 text-center">
                                Booklet Designer
                            </h2>
                            <p className="text-gray-600 text-center flex-1">
                                Design and preview print-ready booklets with customizable settings and layout preview
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-[#A259FF] font-medium group-hover:gap-3 transition-all">
                                Get Started
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}