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

  const formatTimestamp = (isoString: string) => {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getDataAge = (isoString: string) => {
    if (!isoString) return null;
    const now = new Date();
    const dataTime = new Date(isoString);
    const diffMinutes = Math.floor((now.getTime() - dataTime.getTime()) / 60000);
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
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
          <p className="mt-1 text-sm text-slate-500">Advisory generated: {formatTimestamp(new Date().toISOString())}</p>
        </div>

        <div className={`mb-6 rounded-lg border-2 p-6 ${getStatusBadge(checklist.overall_status)}`}>
          <h2 className="text-2xl font-bold mb-2">Overall Status: {checklist.overall_status.replace(/_/g, ' ')}</h2>
          {checklist.rationale && checklist.rationale.length > 0 && <p className="text-sm">{checklist.rationale.join(' ')}</p>}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-slate-900">Airspace</h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Data retrieved: Just now</span>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Class:</span> {airspace.airspace_class || 'Unknown'}</p>
              <p><span className="font-medium">Facility:</span> {airspace.facility || 'N/A'}</p>
              <p><span className="font-medium">LAANC Required:</span> {airspace.laanc_required ? 'Yes' : airspace.laanc_required === false ? 'No' : 'Unknown'}</p>
              {airspace.max_altitude_ft && <p><span className="font-medium">Max Altitude:</span> {airspace.max_altitude_ft} ft</p>}
              {airspace.restrictions && airspace.restrictions.length > 0 && (
                <div>
                  <p className="font-medium mt-3">Restrictions:</p>
                  <ul className="list-disc pl-5 mt-1">{airspace.restrictions.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-slate-900">Weather</h3>
              {weather.current_conditions.timestamp && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  Observed: {getDataAge(weather.current_conditions.timestamp)}
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Visibility:</span> {weather.current_conditions.visibility_sm ? `${weather.current_conditions.visibility_sm} SM` : 'Unknown'}</p>
              <p><span className="font-medium">Ceiling:</span> {weather.current_conditions.cloud_ceiling_ft ? `${weather.current_conditions.cloud_ceiling_ft} ft` : 'Unknown'}</p>
              <p><span className="font-medium">Wind:</span> {weather.current_conditions.wind_speed_kt ? `${weather.current_conditions.wind_speed_kt} kt` : 'Unknown'}</p>
              {weather.current_conditions.wind_gust_kt && <p><span className="font-medium">Gusts:</span> {weather.current_conditions.wind_gust_kt} kt</p>}
              <p><span className="font-medium">Part 107 Status:</span> {weather.part107_compliance.overall_status}</p>
              {weather.current_conditions.timestamp && (
                <p className="text-xs text-slate-500 mt-3">Last observation: {formatTimestamp(weather.current_conditions.timestamp)}</p>
              )}
              {weather.part107_compliance.notes && weather.part107_compliance.notes.length > 0 && (
                <div>
                  <p className="font-medium mt-3 text-slate-700">Notes:</p>
                  <ul className="list-disc pl-5 mt-1 text-slate-600">{weather.part107_compliance.notes.map((n: string, i: number) => <li key={i}>{n}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border-2 border-amber-500 bg-amber-50 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-amber-900">⚠️ Temporary Flight Restrictions (TFR)</h3>
              <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">Checked: Just now</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-amber-100 border border-amber-300 rounded p-3">
                <p className="font-bold text-amber-900 mb-1">IMPORTANT LIMITATION:</p>
                <p className="text-amber-900">This check uses <strong>state-level filtering only</strong>. TFR boundaries and exact locations are NOT verified by this tool.</p>
              </div>
              <p><span className="font-medium text-amber-900">Status:</span> <span className="text-amber-900">{tfr.status}</span></p>
              <p><span className="font-medium text-amber-900">Active TFRs in State:</span> <span className="text-amber-900">{tfr.tfr_count}</span></p>
              <div className="bg-white border border-amber-300 rounded p-3 mt-3">
                <p className="font-bold text-amber-900 mb-1">REQUIRED ACTION:</p>
                <p className="text-amber-900">You MUST verify exact TFR boundaries at <a href="https://tfr.faa.gov" target="_blank" rel="noopener noreferrer" className="underline font-semibold">tfr.faa.gov</a> or an FAA-approved provider before flight.</p>
              </div>
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
              <ul className="space-y-2">{checklist.checklist_items.map((item: any, i: number) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-blue-600">✓</span><span><strong>{item.category}:</strong> {item.item}</span></li>)}</ul>
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