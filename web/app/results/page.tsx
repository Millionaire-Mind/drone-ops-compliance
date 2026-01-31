'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PreflightCheckResponse } from '@/lib/api';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<PreflightCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resultsData = searchParams.get('data');
    if (resultsData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(resultsData));
        setResults(parsed);
      } catch (error) {
        console.error('Failed to parse results:', error);
      }
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700">
              UAS FlightCheck
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900">No Results Found</h1>
          <p className="mt-4 text-slate-600">Please run a preflight check first.</p>
          <a href="/preflight" className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Run Preflight Check
          </a>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'GO') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'GO_WITH_CONDITIONS') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status === 'NO_GO' || status === 'INSUFFICIENT_DATA') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'GO') return 'GO';
    if (status === 'GO_WITH_CONDITIONS') return 'GO WITH CONDITIONS';
    if (status === 'NO_GO') return 'NO-GO';
    if (status === 'INSUFFICIENT_DATA') return 'INSUFFICIENT DATA';
    return status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700">
              UAS FlightCheck
            </a>
            <a href="/preflight" className="text-sm text-slate-600 hover:text-slate-900">
              New Check
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Preflight Advisory Assessment</h1>
          <p className="mt-2 text-base text-slate-600">Results are advisory only and do not authorize flight.</p>
        </div>

        {/* Overall Status */}
        <div className={`mb-8 rounded-lg border-2 p-6 ${getStatusColor(results.checklist.overall_status)}`}>
          <h2 className="text-xl font-bold">Advisory Status: {getStatusLabel(results.checklist.overall_status)}</h2>
          {results.checklist.overall_status === 'GO' && (
            <p className="mt-2 text-sm">GO does not mean authorized. Verify all requirements before flight.</p>
          )}
          {results.checklist.overall_status === 'GO_WITH_CONDITIONS' && (
            <p className="mt-2 text-sm">Conditions must be addressed before flight consideration.</p>
          )}
          {results.checklist.overall_status === 'NO_GO' && (
            <p className="mt-2 text-sm">Unresolved constraints detected. Do not fly until verified.</p>
          )}
        </div>

        {/* Airspace Section */}
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Airspace Assessment</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-slate-700">Airspace Class:</span>
              <span className="ml-2 text-slate-900">{results.airspace.airspace_class}</span>
            </div>
            {results.airspace.facility && (
              <div>
                <span className="font-medium text-slate-700">Facility:</span>
                <span className="ml-2 text-slate-900">{results.airspace.facility}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-slate-700">LAANC Required:</span>
              <span className="ml-2 text-slate-900">
                {results.airspace.laanc_required === true ? 'Yes' : results.airspace.laanc_required === false ? 'No' : 'Unknown'}
              </span>
            </div>
            {results.airspace.restrictions.length > 0 && (
              <div>
                <span className="font-medium text-slate-700">Restrictions:</span>
                <ul className="mt-2 ml-4 list-disc text-sm text-slate-700">
                  {results.airspace.restrictions.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Weather Section */}
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Weather Advisory</h3>
          {results.weather.current_conditions ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {results.weather.current_conditions.visibility_sm !== null && (
                  <div>
                    <span className="font-medium text-slate-700">Visibility:</span>
                    <span className="ml-2 text-slate-900">{results.weather.current_conditions.visibility_sm} SM</span>
                  </div>
                )}
                {results.weather.current_conditions.cloud_ceiling_ft !== null && (
                  <div>
                    <span className="font-medium text-slate-700">Ceiling:</span>
                    <span className="ml-2 text-slate-900">{results.weather.current_conditions.cloud_ceiling_ft} ft</span>
                  </div>
                )}
                {results.weather.current_conditions.wind_speed_kt !== null && (
                  <div>
                    <span className="font-medium text-slate-700">Wind:</span>
                    <span className="ml-2 text-slate-900">{results.weather.current_conditions.wind_speed_kt} kt</span>
                  </div>
                )}
                {results.weather.current_conditions.temperature_f !== null && (
                  <div>
                    <span className="font-medium text-slate-700">Temperature:</span>
                    <span className="ml-2 text-slate-900">{results.weather.current_conditions.temperature_f}°F</span>
                  </div>
                )}
              </div>
              <div>
                <span className="font-medium text-slate-700">Part 107 Compliance Status:</span>
                <span className="ml-2 text-slate-900">{results.weather.part107_compliance.overall_status}</span>
              </div>
              {results.weather.part107_compliance.notes.length > 0 && (
                <div>
                  <span className="font-medium text-slate-700">Notes:</span>
                  <ul className="mt-2 ml-4 list-disc text-sm text-slate-700">
                    {results.weather.part107_compliance.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-600">Weather data unavailable. Verify conditions before flight.</p>
          )}
        </section>

        {/* TFR Section */}
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">TFR Status</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-slate-700">Status:</span>
              <span className="ml-2 text-slate-900">{results.tfr.status}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Active TFRs Found:</span>
              <span className="ml-2 text-slate-900">{results.tfr.tfr_count}</span>
            </div>
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
              {results.tfr.advisory}
            </div>
          </div>
        </section>

        {/* Checklist Section */}
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Preflight Checklist</h3>
          {results.checklist.required_actions.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-slate-900 mb-2">Required Actions:</h4>
              <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
                {results.checklist.required_actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-2">
            {results.checklist.checklist_items.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm p-2 rounded bg-slate-50">
                <span className={`mt-0.5 h-4 w-4 rounded-full flex-shrink-0 ${
                  item.status === 'OK' ? 'bg-green-500' : 
                  item.status === 'ACTION_NEEDED' ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}></span>
                <div className="flex-1">
                  <span className="font-medium text-slate-700">[{item.category}]</span>
                  <span className="ml-2 text-slate-900">{item.item}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimers */}
        <section className="mb-8 rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3">Important Disclaimers</h3>
          <ul className="ml-4 list-disc text-sm text-amber-900 space-y-1">
            {results.checklist.disclaimers.map((disclaimer, i) => (
              <li key={i}>{disclaimer}</li>
            ))}
          </ul>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <a href="/preflight" className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Run Another Check
          </a>
          <a href="/" className="rounded-md border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50">
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}