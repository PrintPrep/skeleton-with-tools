// app/page.tsx

import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { Tools } from '@/components/home/Tools';
import { Features } from '@/components/home/Features';
import { HowItWorks } from '@/components/home/HowItWorks';
import { UseCases } from '@/components/home/UseCases';
import { SocialProof } from '@/components/home/SocialProof';
import { Pricing } from '@/components/home/Pricing';
import { CTASection } from '@/components/home/CTASection';
import { Footer } from '@/components/home/Footer';

export default function Home() {
    return (
        <div className="w-full overflow-hidden">
            <Navbar />
            <Hero />
            <Tools />
            <Features />
            <HowItWorks />
            <UseCases />
            <SocialProof />
            <Pricing />
            <CTASection />
            <Footer />
        </div>
    );
}