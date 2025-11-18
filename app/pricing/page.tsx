// app/pricing/page.tsx
'use client';

import React from 'react';
import { Pricing } from '@/components/home/Pricing';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export default function PricingPage() {
  return (
    <div className="w-full overflow-hidden">
      <Navbar />
      <Pricing />
      <Footer />
    </div>
  );
}