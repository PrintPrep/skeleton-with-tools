// components/home/Pricing.tsx
'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { LEMON_SQUEEZY_PRODUCTS, createLemonSqueezyCheckout, type LemonSqueezyProduct } from '@/lib/lemon-squeezy';

export const Pricing = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  const plans = [
    { 
      name: 'Free', 
      price: '$0', 
      desc: 'Basic PDF operations with limited projects.',
      features: ['5 projects', 'Basic tools', 'Community support']
    },
    { 
      name: 'Pro', 
      price: '$5.99', 
      original: '$9.99', 
      desc: 'Unlimited projects, all tools unlocked.',
      product: LEMON_SQUEEZY_PRODUCTS.PRO_MONTHLY,
      features: ['Unlimited projects', 'All tools', 'Priority support', 'Cloud storage']
    },
    { 
      name: 'Yearly', 
      price: '$49', 
      desc: 'Best value for frequent users.',
      product: LEMON_SQUEEZY_PRODUCTS.PRO_YEARLY,
      features: ['All Pro features', 'Save 30%', 'Billed annually']
    },
    { 
      name: 'Lifetime', 
      price: '$79', 
      desc: 'One payment for forever access.',
      product: LEMON_SQUEEZY_PRODUCTS.LIFETIME,
      features: ['Lifetime access', 'All future updates', 'Best value long-term']
    },
  ];

  const handleCheckout = async (product: LemonSqueezyProduct) => {
    if (!isSignedIn) {
      router.push('/sign-up');
      return;
    }

    setLoadingProduct(product.id);
    try {
      console.log('🛒 Starting checkout for product:', product.name);
      
      const checkoutUrl = await createLemonSqueezyCheckout(
        product.id,
        user.id,
        user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || ''
      );
      
      console.log('✅ Redirecting to checkout:', checkoutUrl);
      window.location.href = checkoutUrl;
      
    } catch (error: unknown) {
      console.error('❌ Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to start checkout: ${errorMessage}. Please try again.`);
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-white to-cyan-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-600 text-center mb-16">No hidden fees. Cancel anytime.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 group hover:-translate-y-1 ${
              plan.name === 'Pro' 
                ? 'border-teal-500 shadow-xl scale-105' 
                : 'border-gray-200 hover:border-teal-300 hover:shadow-xl'
            }`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-teal-600">{plan.price}</span>
                {plan.original && (
                  <span className="text-gray-400 line-through ml-2 text-lg">{plan.original}</span>
                )}
                {plan.product?.interval === 'month' && (
                  <span className="block text-gray-500 text-sm">per month</span>
                )}
                {plan.product?.interval === 'year' && (
                  <span className="block text-gray-500 text-sm">per year</span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{plan.desc}</p>
              
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.product ? (
                <button 
                  onClick={() => handleCheckout(plan.product)}
                  disabled={loadingProduct === plan.product.id}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProduct === plan.product.id ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Choose Plan'
                  )}
                </button>
              ) : (
                <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium cursor-default">
                  Current Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};