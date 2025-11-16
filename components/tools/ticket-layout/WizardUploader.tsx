// components/tools/ticket-layout/WizardUploader.tsx

"use client";

import { useStore } from "@/lib/ticket-layout/zustandStore";
import { useRouter } from "next/navigation";
import Dropzone from "./Dropzone";

export default function WizardUploader() {
    const isDoubleSided = useStore((s) => s.isDoubleSided);
    const front = useStore((s) => s.front);
    const back = useStore((s) => s.back);
    const router = useRouter();

    const canContinue = !!front && (!isDoubleSided || !!back);

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Dropzone side="front" />
                <Dropzone side="back" isDisabled={!isDoubleSided} />
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                    {isDoubleSided ? "Front and back required" : "Front required"}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        disabled={!canContinue}
                        className={`inline-flex items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
                            canContinue
                                ? "bg-[#00BFA6] text-white shadow-sm hover:bg-[#00D1B2] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
                                : "cursor-not-allowed bg-gray-200 text-gray-400"
                        }`}
                        onClick={() => router.push("/tools/ticket-layout/editor")}
                    >
                        Continue to workspace
                    </button>
                </div>
            </div>
        </div>
    );
}
