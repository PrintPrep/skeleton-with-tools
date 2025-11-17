// components/tools/booklet-imposition/steps/StepSettings.tsx

import React, { useState } from 'react';
import { useBookletStore } from '@/lib/booklet-imposition/store/useBookletStore';
import { Button } from '@/components/ui/booklet-imposition/Button';
import { Select } from '@/components/ui/booklet-imposition/Select';
import { Card } from '@/components/ui/booklet-imposition/Card';
import { Alert } from '@/components/ui/booklet-imposition/Alert';
import { ArrowRight, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import {
    PAPER_SIZE_DESCRIPTIONS,
    DUPLEX_MODE_DESCRIPTIONS,
    MARGIN_PRESET_DESCRIPTIONS,
    MARGIN_PRESETS,
} from '@/lib/booklet-imposition/constants';
import { PaperSize, DuplexMode, MarginPreset } from '@/types/booklet-imposition/settings.types';

export function StepSettings() {
    const { settings, updateSettings, nextStep, previousStep } = useBookletStore();

    const handlePaperSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateSettings({ paperSize: e.target.value as PaperSize });
    };

    const handleDuplexModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateSettings({ duplexMode: e.target.value as DuplexMode });
    };

    const handleMarginPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const preset = e.target.value as MarginPreset;
        updateSettings({
            marginPreset: preset,
            margins: MARGIN_PRESETS[preset],
        });
    };

    const handleScaleToFitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettings({ scaleToFit: e.target.checked });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Booklet Settings
                </h2>
                <p className="text-gray-600">
                    Configure how your booklet should be printed
                </p>
            </div>

            <Card title="Paper Size" description="Select the paper size for printing">
                <Select
                    value={settings.paperSize}
                    onChange={handlePaperSizeChange}
                    helperText={PAPER_SIZE_DESCRIPTIONS[settings.paperSize]}
                >
                    {Object.entries(PAPER_SIZE_DESCRIPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Select>
            </Card>

            <Card
                title="Duplex Mode"
                description="How pages flip when printing double-sided"
            >
                <Select
                    value={settings.duplexMode}
                    onChange={handleDuplexModeChange}
                    helperText={DUPLEX_MODE_DESCRIPTIONS[settings.duplexMode].description}
                >
                    {Object.entries(DUPLEX_MODE_DESCRIPTIONS).map(([value, { title, icon }]) => (
                        <option key={value} value={value}>
                            {icon} {title}
                        </option>
                    ))}
                </Select>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                        <strong>Tip:</strong> Most portrait booklets use "Flip on Long Edge".
                        Landscape or calendar-style booklets typically use "Flip on Short Edge".
                    </p>
                </div>
            </Card>

            <Card title="Margins" description="Set margins and gutter for binding">
                <Select
                    value={settings.marginPreset}
                    onChange={handleMarginPresetChange}
                    helperText={MARGIN_PRESET_DESCRIPTIONS[settings.marginPreset]}
                >
                    {Object.entries(MARGIN_PRESET_DESCRIPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Select>
            </Card>

            <Card title="Additional Options">
                <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.scaleToFit}
                            onChange={handleScaleToFitChange}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div>
                            <p className="font-medium text-gray-900">Scale pages to fit</p>
                            <p className="text-sm text-gray-600">
                                Automatically resize pages to fit the target sheet size
                            </p>
                        </div>
                    </label>
                </div>
            </Card>

            <Alert type="info" title="Ready to Process">
                Your settings have been configured. Click "Next" to process your PDF
                and create the booklet imposition.
            </Alert>

            <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                </Button>
                <Button size="lg" onClick={nextStep}>
                    Process PDF
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}