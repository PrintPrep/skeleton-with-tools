// components/tools/ticket-layout/SideSelector.tsx

"use client";

import { useStore } from "@/lib/ticket-layout/zustandStore";

interface SideSelectorProps {
    onSelect: () => void;
}

export default function SideSelector({ onSelect }: SideSelectorProps) {
    const setDoubleSided = useStore((s) => s.setDoubleSided);

    const handleSideChoice = (choice: "single" | "double") => {
        setDoubleSided(choice === "double");
        onSelect();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#E0F7F4] p-8">
            {/* Card Container */}
            <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center w-full max-w-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-8 font-sans">
                    Choose Ticket Type
                </h2>

                <div className="flex justify-center gap-4 w-full">
                    {/* Single-sided */}
                    <div className="flex-1 max-w-[240px]">
                        <button
                            onClick={() => handleSideChoice("single")}
                            className="w-full px-6 py-4 bg-[#00BFA6] text-white font-semibold text-lg rounded-lg shadow-sm hover:shadow-lg hover:bg-[#00D1B2] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00BFA6] font-sans"
                        >
                            Single-sided
                        </button>
                    </div>

                    {/* Double-sided */}
                    <div className="flex-1 max-w-[240px]">
                        <button
                            onClick={() => handleSideChoice("double")}
                            className="w-full px-6 py-4 bg-[#00BFA6] text-white font-semibold text-lg rounded-lg shadow-sm hover:shadow-lg hover:bg-[#00D1B2] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00BFA6] font-sans"
                        >
                            Double-sided
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
