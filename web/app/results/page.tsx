'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultsData = searchParams.get('data');

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">No Results Found</h1>
          <p className="mt-4 text-slate-600">Please run a preflight check first.</p>
          <a href="/preflight" className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">Run Preflight Check</a>
        </div>
      </div>
    );
  }

  const results = JSON.parse(decodeURIComponent(resultsData));
  const { airspace, weather, tfr, checklist } = results;

  const getStatusBadge = (status: string) => {
    if (status === 'GO') return 'bg-green-100 text-green-800';
    if (status === 'GO_WITH_CONDITIONS') return 'bg-yellow-100 text-yellow-800';
    if (status === 'NO_GO') return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700">UAS FlightCheck</a>
            <div className="flex gap-4">
              <a href="/preflight" className="text-sm text-slate-600 hover:text-slate-900">New Check</a>
              <a href="/" className="text-sm text-slate-600 hover:text-slate-900">Home</a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Preflight Advisory Results</h1>
          <p className="mt-2 text-base text-slate-600">Review all constraints before flight</p>
        </div>

        <div className={`mb-6 rounded-lg border-2 p-6 ${getStatusBadge(checklist.overall_status)}`}>
          <h2 className="text-2xl font-bold mb-2">Overall Status: {checklist.overall_status.replace(/_/g, ' ')}</h2>
          <p className="text-sm">{checklist.rationale}</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Airspace</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Class:</span> {airspace.result.airspace_class || 'Unknown'}</p>
              <p><span className="font-medium">Facility:</span> {airspace.result.facility || 'N/A'}</p>
              <p><span className="font-medium">LAANC Required:</span> {airspace.result.laanc_required ? 'Yes' : airspace.result.laanc_required === false ? 'No' : 'Unknown'}</p>
              {airspace.result.max_altitude_ft && <p><span className="font-medium">Max Altitude:</span> {airspace.result.max_altitude_ft} ft</p>}
              {airspace.result.restrictions && airspace.result.restrictions.length > 0 && (
                <div>
                  <p className="font-medium mt-3">Restrictions:</p>
                  <ul className="list-disc pl-5 mt-1">{airspace.result.restrictions.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Weather</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Visibility:</span> {weather.result.current_conditions.visibility_sm ? `${weather.result.current_conditions.visibility_sm} SM` : 'Unknown'}</p>
              <p><span className="font-medium">Ceiling:</span> {weather.result.current_conditions.cloud_ceiling_ft ? `${weather.result.current_conditions.cloud_ceiling_ft} ft` : 'Unknown'}</p>
              <p><span className="font-medium">Wind:</span> {weather.result.current_conditions.wind_speed_kt ? `${weather.result.current_conditions.wind_speed_kt} kt` : 'Unknown'}</p>
              <p><span className="font-medium">Part 107 Compliance:</span> {weather.result.part107_compliance.compliant ? 'Yes' : weather.result.part107_compliance.compliant === false ? 'No' : 'Unknown'}</p>
              {weather.result.part107_compliance.warnings && weather.result.part107_compliance.warnings.length > 0 && (
                <div>
                  <p className="font-medium mt-3 text-amber-900">Warnings:</p>
                  <ul className="list-disc pl-5 mt-1 text-amber-900">{weather.result.part107_compliance.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Temporary Flight Restrictions (TFR)</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Status:</span> {tfr.result.status}</p>
              <p><span className="font-medium">Active TFRs in State:</span> {tfr.result.tfr_count}</p>
              <p className="text-amber-900 mt-3">{tfr.result.advisory}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Required Actions</h3>
            {checklist.required_actions && checklist.required_actions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-sm">{checklist.required_actions.map((action: string, i: number) => <li key={i}>{action}</li>)}</ul>
            ) : (
              <p className="text-sm text-slate-600">No specific actions required beyond standard preflight verification.</p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Preflight Checklist</h3>
            {checklist.checklist_items && checklist.checklist_items.length > 0 ? (
              <ul className="space-y-2">{checklist.checklist_items.map((item: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-blue-600">✓</span><span>{item}</span></li>)}</ul>
            ) : (
              <p className="text-sm text-slate-600">Standard preflight checklist applies.</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3">Important Disclaimers</h3>
          <ul className="space-y-2 text-sm text-amber-900">{checklist.disclaimers.map((disclaimer: string, i: number) => <li key={i}>• {disclaimer}</li>)}</ul>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <a href="/preflight" className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">Run Another Check</a>
          <a href="/" className="rounded-md border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50">Back to Home</a>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}