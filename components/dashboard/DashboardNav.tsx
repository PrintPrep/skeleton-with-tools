'use client';
// components/dashboard/DashboardNav.tsx

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Settings, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

export const DashboardNav = ({ isPro = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const { user } = useUser();

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
                    <Link href="/" className="flex items-center gap-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            PrintPrev
                        </div>
                        {isPro && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                                PRO
                            </span>
                        )}
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
                            <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                                <Link 
                                    href="/tools/pdf-toolkit" 
                                    className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded-t-lg transition-colors"
                                >
                                    PDF Toolkit
                                </Link>
                                <Link 
                                    href="/tools/booklet-imposition" 
                                    className="block px-4 py-3 text-gray-700 hover:bg-teal-50 transition-colors"
                                >
                                    Booklet Imposition
                                </Link>
                                <Link 
                                    href="/tools/ticket-layout/wizard"
                                    className="block px-4 py-3 text-gray-700 hover:bg-teal-50 transition-colors"
                                >
                                    Ticket Layout
                                </Link>
                                <Link 
                                    href="/tools/sticker-pack" 
                                    className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded-b-lg transition-colors"
                                >
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
                                <span className="text-gray-400 font-medium flex items-center gap-1">
                                    Assets
                                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Pro</span>
                                </span>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
    Upgrade to Pro to access assets
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-4 border-transparent border-b-gray-800"></div>
</div>
                            </div>
                        )}

                        {/* Pricing/Upgrade */}
                        {!isPro && (
                            <Link 
                                href="/pricing" 
                                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                Upgrade to Pro
                            </Link>
                        )}
                    </div>

                    {/* Account Menu with Clerk UserButton */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <UserButton 
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10 border-2 border-teal-200 hover:border-teal-400 transition-colors",
                                        userButtonTrigger: "focus:shadow-lg"
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2 bg-white/95 backdrop-blur-md rounded-lg mt-2 border border-gray-200 shadow-lg">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {user?.firstName || user?.username || 'User'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {isPro ? 'Pro Plan' : 'Free Plan'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <Link 
                            href="/dashboard" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            href="/tools/pdf-toolkit" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            PDF Toolkit
                        </Link>
                        <Link 
                            href="/tools/booklet-imposition" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Booklet Imposition
                        </Link>
                        <Link 
                            href="/tools/ticket-layout" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Ticket Layout
                        </Link>
                        <Link 
                            href="/tools/sticker-pack" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Sticker Pack
                        </Link>
                        
                        {isPro && (
                            <Link 
                                href="/dashboard/assets" 
                                className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Assets
                            </Link>
                        )}
                        
                        {!isPro && (
                            <Link 
                                href="/pricing" 
                                className="block px-4 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold rounded mx-4 text-center hover:shadow-lg transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                Upgrade to Pro
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};