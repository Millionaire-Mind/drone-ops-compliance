'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || 'price_1SvUIxRV6m7EMVWiPLqD7rXj',
        }),
      });

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700">UAS FlightCheck</a>
            <a href="/" className="text-sm text-slate-600 hover:text-slate-900">Back to Home</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-slate-600">Choose the plan that fits your needs</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          <div className="rounded-lg border-2 border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-bold text-slate-900">Education</h3>
            <p className="mt-2 text-slate-600">For flight schools and instructors</p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-slate-900">Free</span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Basic preflight advisory checks</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Airspace, weather, and TFR assessments</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">GO/NO-GO advisory summaries</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Limited usage (ideal for training)</span>
              </li>
            </ul>
            <a href="/preflight" className="mt-8 block w-full rounded-md border border-slate-300 bg-white px-6 py-3 text-center font-medium text-slate-700 hover:bg-slate-50">Get Started Free</a>
          </div>

          <div className="rounded-lg border-2 border-blue-500 bg-white p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">RECOMMENDED</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
            <p className="mt-2 text-slate-600">For professional operators</p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-slate-900">$79</span>
              <span className="text-slate-600">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Everything in Education, plus:</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Unlimited preflight checks</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Advisory history (90 days)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Export capabilities (CSV, JSON)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Priority support</span>
              </li>
            </ul>
            <button onClick={handleUpgrade} disabled={loading} className="mt-8 block w-full rounded-md bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed">{loading ? 'Loading...' : 'Upgrade to Pro'}</button>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
            <h3 className="text-lg font-bold text-amber-900 mb-2">Important Notice</h3>
            <p className="text-sm text-amber-900">UAS FlightCheck provides advisory decision support only. Neither tier authorizes, approves, or certifies any flight operation. All users remain solely responsible for verifying airspace, weather, and regulatory requirements with official FAA sources before flight.</p>
          </div>
        </div>
      </main>
    </div>
  );
}