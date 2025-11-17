// components/dashboard/RecentProjects.tsx

import React, { useState } from 'react';
import { FileText, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import Link from 'next/link';

const ProjectCard = ({ id, filename, lastModified, thumbnail, tool }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            {/* Thumbnail */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 flex items-center justify-center relative group">
                <FileText className="text-gray-400" size={48} />

                {/* Quick action overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <Link
                        href={`/dashboard/projects/${id}`}
                        className="bg-teal-500 text-white px-4 py-2 rounded-full font-medium hover:bg-teal-600 transition"
                    >
                        Continue Editing
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-1 truncate">{filename}</h3>
                <p className="text-sm text-gray-500 mb-4">{lastModified}</p>

                <div className="flex items-center justify-between">
          <span className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-medium">
            {tool}
          </span>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <MoreVertical size={16} className="text-gray-500" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-teal-50 border-b border-gray-200">
                                    <Edit2 size={16} /> Rename
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-teal-50 border-b border-gray-200">
                                    <Copy size={16} /> Duplicate
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RecentProjects = ({ isPro = false }) => {
    const projects = [
        {
            id: '1',
            filename: 'Company Brochure 2025.pdf',
            lastModified: 'Modified 2 days ago',
            tool: 'Booklet Imposition',
            thumbnail: null
        },
        {
            id: '2',
            filename: 'Event Tickets.pdf',
            lastModified: 'Modified 5 days ago',
            tool: 'Ticket Layout',
            thumbnail: null
        },
        {
            id: '3',
            filename: 'Sticker Sheet v3.pdf',
            lastModified: 'Modified 1 week ago',
            tool: 'Sticker Pack',
            thumbnail: null
        },
        {
            id: '4',
            filename: 'Product Manual.pdf',
            lastModified: 'Modified 2 weeks ago',
            tool: 'PDF Toolkit',
            thumbnail: null
        }
    ];

    if (!isPro) {
        return null;
    }

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Projects</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            </div>
        </section>
    );
};