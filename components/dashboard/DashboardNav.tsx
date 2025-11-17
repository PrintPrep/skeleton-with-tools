// components/dashboard/DashboardHeader.tsx

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, Settings, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const DashboardNav = ({ isPro = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            PrintPrev
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/dashboard" className="text-gray-700 hover:text-teal-600 transition font-medium">
                            Dashboard
                        </Link>

                        {/* Tools Dropdown */}
                        <div className="relative group">
                            <button className="text-gray-700 hover:text-teal-600 transition font-medium flex items-center gap-1">
                                Tools <ChevronDown size={16} />
                            </button>
                            <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <Link href="/tools/pdf-toolkit" className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded-t-lg">
                                    PDF Toolkit
                                </Link>
                                <Link href="/tools/booklet-imposition" className="block px-4 py-3 text-gray-700 hover:bg-teal-50">
                                    Booklet Imposition
                                </Link>
                                <Link href="/tools/ticket-layout" className="block px-4 py-3 text-gray-700 hover:bg-teal-50">
                                    Ticket Layout
                                </Link>
                                <Link href="/tools/sticker-pack" className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded-b-lg">
                                    Sticker Pack
                                </Link>
                            </div>
                        </div>

                        {/* Assets - Pro only */}
                        {isPro ? (
                            <Link href="/dashboard/assets" className="text-gray-700 hover:text-teal-600 transition font-medium">
                                Assets
                            </Link>
                        ) : (
                            <div className="relative group cursor-help">
                                <button className="text-gray-400 font-medium flex items-center gap-1">
                                    Assets
                                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Pro</span>
                                </button>
                            </div>
                        )}

                        {/* Pricing/Upgrade */}
                        {!isPro && (
                            <Link href="/pricing" className="text-teal-600 hover:text-cyan-600 transition font-bold">
                                Upgrade
                            </Link>
                        )}
                    </div>

                    {/* Account Menu */}
                    <div className="hidden md:flex items-center gap-4 relative">
                        <button
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 hover:shadow-lg transition-all cursor-pointer"
                        />

                        {isAccountOpen && (
                            <div className="absolute right-0 mt-32 w-48 bg-white rounded-lg shadow-lg">
                                <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-teal-50">
                                    <Settings size={16} /> Settings
                                </Link>
                                <Link href="/dashboard/billing" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-teal-50">
                                    <CreditCard size={16} /> Billing
                                </Link>
                                <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-teal-50 rounded-b-lg">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2 bg-white/95 backdrop-blur-md rounded-lg mt-2">
                        <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/tools/pdf-toolkit" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded">
                            PDF Toolkit
                        </Link>
                        <Link href="/dashboard/tools/booklet" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded">
                            Booklet Imposition
                        </Link>
                        <Link href="/dashboard/tools/tickets" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded">
                            Ticket Layout
                        </Link>
                        <Link href="/dashboard/tools/sticker-pack" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded">
                            Sticker Pack
                        </Link>
                        {isPro && (
                            <Link href="/dashboard/assets" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded">
                                Assets
                            </Link>
                        )}
                        {!isPro && (
                            <Link href="/pricing" className="block px-4 py-2 text-teal-600 font-bold hover:bg-teal-50 rounded">
                                Upgrade
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};