// components/dashboard/AssetsPreview.tsx

import React from 'react';
import { Upload, FileText, Lock } from 'lucide-react';
import Link from 'next/link';

const AssetCard = ({ id, filename, type, size, uploadedDate }) => {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-24 rounded-lg flex items-center justify-center mb-3">
                <FileText className="text-gray-400" size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm truncate">{filename}</h4>
            <p className="text-xs text-gray-500">{size}</p>
            <p className="text-xs text-gray-400 mt-1">{uploadedDate}</p>
        </div>
    );
};

export const AssetsPreview = ({ isPro = false }) => {
    const assets = [
        { id: '1', filename: 'template-a.pdf', type: 'PDF', size: '2.4 MB', uploadedDate: '3 days ago' },
        { id: '2', filename: 'logo.png', type: 'Image', size: '1.2 MB', uploadedDate: '1 week ago' },
        { id: '3', filename: 'icon-set.svg', type: 'Image', size: '500 KB', uploadedDate: '2 weeks ago' },
        { id: '4', filename: 'brand-guide.pdf', type: 'PDF', size: '5.8 MB', uploadedDate: '1 month ago' },
    ];

    if (!isPro) {
        return (
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Assets Manager</h2>

                    {/* Locked State */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                                <Lock className="text-blue-600" size={32} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Cloud Storage Locked</h3>
                        <p className="text-gray-600 mb-6">Save your PDFs and images in the cloud, organize them into folders, and access them anytime.</p>
                        <Link
                            href="/pricing"
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all inline-block"
                        >
                            Unlock with Pro
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Assets Manager</h2>
                    <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2">
                        <Upload size={18} /> Upload Files
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>All Files</option>
                        <option>PDFs</option>
                        <option>Images</option>
                        <option>Exports</option>
                    </select>
                </div>

                {/* Asset Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {assets.map((asset) => (
                        <AssetCard key={asset.id} {...asset} />
                    ))}
                </div>
            </div>
        </section>
    );
};
