// components/home/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from "next/navigation";
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useAuth,
  useClerk
} from '@clerk/nextjs';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { openSignIn, openSignUp } = useClerk();

    const handleSignIn = () => {
        openSignIn({
            afterSignInUrl: '/dashboard',
            afterSignUpUrl: '/dashboard'
        });
    };

    const handleSignUp = () => {
        openSignUp({
            redirectUrl: '/dashboard',
            afterSignInUrl: '/dashboard',
            afterSignUpUrl: '/dashboard'
        });
    };

    const handleDashboard = () => {
        router.push('/dashboard');
    };

    const handleGetStarted = () => {
        if (isSignedIn) {
            router.push('/dashboard');
        } else {
            handleSignUp();
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div 
                            className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            PrintPrev
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-700 hover:text-teal-600 transition">Features</a>
                        <a href="#pricing" className="text-gray-700 hover:text-teal-600 transition">Pricing</a>
                        <a href="#how-it-works" className="text-gray-700 hover:text-teal-600 transition">How It Works</a>
                        <a href="#faq" className="text-gray-700 hover:text-teal-600 transition">FAQ</a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <SignedOut>
                            <button 
                                onClick={handleSignIn}
                                className="text-gray-700 hover:text-teal-600 transition font-medium"
                            >
                                Login
                            </button>
                            <button 
                                onClick={handleSignUp}
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all"
                            >
                                Get Started Free
                            </button>
                        </SignedOut>
                        <SignedIn>
                            <button
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all"
                                onClick={handleDashboard}
                            >
                                Dashboard
                            </button>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
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
                        <a 
                            href="#features" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Features
                        </a>
                        <a 
                            href="#pricing" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Pricing
                        </a>
                        <a 
                            href="#how-it-works" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            How It Works
                        </a>
                        <a 
                            href="#faq" 
                            className="block px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            FAQ
                        </a>
                        
                        <div className="border-t border-gray-200 pt-2">
                            <SignedOut>
                                <button 
                                    onClick={() => {
                                        handleSignIn();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 rounded transition-colors"
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => {
                                        handleSignUp();
                                        setIsOpen(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-3 rounded font-medium hover:shadow-lg transition-all mx-4 mt-2 text-center"
                                >
                                    Get Started Free
                                </button>
                            </SignedOut>
                            <SignedIn>
                                <button
                                    onClick={() => {
                                        handleDashboard();
                                        setIsOpen(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-3 rounded font-medium hover:shadow-lg transition-all mx-4 text-center"
                                >
                                    Dashboard
                                </button>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};  