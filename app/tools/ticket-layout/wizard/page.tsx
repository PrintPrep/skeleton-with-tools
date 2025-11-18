// app/tools/ticket-layout/wizard/page.tsx

"use client";

import { useState } from "react";
import SideSelector from "@/components/tools/ticket-layout/SideSelector";
import WizardUploader from "@/components/tools/ticket-layout/WizardUploader";

export default function WizardPage() {
    const [step, setStep] = useState(1);

    return (
        <main className="relative mx-auto max-w-4xl px-6 py-12 text-center bg-gradient-to-br from-[#E0F7F4] to-gray-100 relative overflow-hidden">
            <h1 className="text-xl font-bold mb-10 text-gray-800 tracking-tight">
                Ticket & Card Wizard
            </h1>

            {step === 1 && (
                <div className="space-y-6">
                    <SideSelector onSelect={() => setStep(2)} />
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8">
                    <WizardUploader />
                    <div className="flex justify-center">
                        <button
                            onClick={() => setStep(1)}
                            className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm border border-gray-200 bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
