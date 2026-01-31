'use client';

import { useEffect, useState } from 'react';

interface AdvisorySnapshot {
  id: string;
  timestamp_utc: string;
  location_lat: number;
  location_lon: number;
  altitude_ft: number | null;
  mission_type: string;
  advisory_result: string;
}

export default function HistoryPage() {
  const [snapshots, setSnapshots] = useState<AdvisorySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setSnapshots(data.snapshots || []);
    } catch (err) {
      setError('Unable to load advisory history. Please try again later.');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'GO') return 'bg-green-100 text-green-800';
    if (status === 'GO_WITH_CONDITIONS') return 'bg-yellow-100 text-yellow-800';
    if (status === 'NO_GO') return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <h1 className="text-3xl font-bold text-slate-900">Advisory History</h1>
          <p className="mt-2 text-base text-slate-600">Recent preflight advisory assessments (informational only)</p>
        </div>

        <div className="mb-6 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            <strong>Important:</strong> These are advisory snapshots only, not compliance records or regulatory documentation. They do not authorize any flight operation.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading history...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}

        {!loading && !error && snapshots.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">No advisory history found.</p>
            <a href="/preflight" className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">Run Your First Preflight Check</a>
          </div>
        )}

        {!loading && !error && snapshots.length > 0 && (
          <div className="space-y-4">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(snapshot.advisory_result)}`}>
                        {snapshot.advisory_result.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-slate-500">{formatDate(snapshot.timestamp_utc)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Location:</span>
                        <span className="ml-2 text-slate-900">{snapshot.location_lat.toFixed(4)}°, {snapshot.location_lon.toFixed(4)}°</span>
                      </div>
                      {snapshot.altitude_ft && (
                        <div>
                          <span className="font-medium text-slate-700">Altitude:</span>
                          <span className="ml-2 text-slate-900">{snapshot.altitude_ft} ft AGL</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-slate-700">Mission Type:</span>
                        <span className="ml-2 text-slate-900">{snapshot.mission_type.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">Showing recent advisory assessments • Not compliance documentation</p>
        </div>
      </main>
    </div>
  );
}