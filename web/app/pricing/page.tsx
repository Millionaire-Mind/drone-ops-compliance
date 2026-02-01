'use client';

import { useState } from 'react';

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

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
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

        <div id="education" className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto mb-16">
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

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg border border-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Education (Free)</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900 bg-blue-50">Pro ($79/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Preflight Checks</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">Limited (for training)</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Airspace Assessment</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Weather Advisory</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">TFR Checks</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">GO/NO-GO Advisory</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Advisory History</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="h-5 w-5 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600 bg-blue-50">90 days</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Export Data (CSV, JSON)</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="h-5 w-5 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Priority Support</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="h-5 w-5 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6 bg-white rounded-lg border border-slate-200 p-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What's the difference between Education and Pro?</h3>
              <p className="text-sm text-slate-600">Education tier is free and perfect for flight schools and instructors for training purposes with limited usage. Pro tier is designed for professional operators who need unlimited checks, history tracking, and export capabilities for regular operations.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How many checks can I run on the free tier?</h3>
              <p className="text-sm text-slate-600">The Education tier is designed for training and instructional use. For regular operational use with unlimited checks, we recommend the Pro tier.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I cancel my Pro subscription anytime?</h3>
              <p className="text-sm text-slate-600">Yes, you can cancel your Pro subscription at any time through your Stripe billing portal. You'll retain access until the end of your current billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Does a "GO" status mean I'm authorized to fly?</h3>
              <p className="text-sm text-slate-600">No. UAS FlightCheck provides advisory decision support only. A "GO" status does not authorize, approve, or certify any flight operation. You remain solely responsible for verifying all requirements with official FAA sources and obtaining necessary authorizations.</p>
            </div>
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