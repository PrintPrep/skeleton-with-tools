// app/pricing/page.tsx
'use client';

import React from 'react';
import { Pricing } from '@/components/home/Pricing';
import { Footer } from '@/components/home/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

export default function PricingPage() {
  return (
    <div className="w-full overflow-hidden">
      <DashboardNav />
      <Pricing />
      <Footer />
    </div>
  );
}