// components/home/Footer.tsx

import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#features" className="hover:text-teal-400 transition">Features</a></li>
                            <li><a href="#pricing" className="hover:text-teal-400 transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition">For Print Shops</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition">For Schools</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition">Terms</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-center text-sm">
                    <p>&copy; 2025 PrintPrev. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};