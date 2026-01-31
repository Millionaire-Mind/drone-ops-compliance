'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { runPreflightCheck } from '@/lib/api';

export default function PreflightPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    altitude_ft_agl: '',
    flight_datetime: '',
    mission_type: 'recreational' as 'recreational' | 'part107_commercial',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const results = await runPreflightCheck({
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        altitude_ft_agl: parseFloat(formData.altitude_ft_agl),
        flight_datetime: formData.flight_datetime,
        mission_type: formData.mission_type,
      });

      // Navigate to results page with data
      const resultsParam = encodeURIComponent(JSON.stringify(results));
      router.push(`/results?data=${resultsParam}`);
    } catch (err) {
      console.error('Preflight check error:', err);
      setError('An error occurred while running the preflight check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700">
              UAS FlightCheck
            </a>
            <a href="/" className="text-sm text-slate-600 hover:text-slate-900">
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Preflight Advisory Check</h1>
          <p className="mt-2 text-base text-slate-600">
            Enter your planned flight details to receive an advisory assessment.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-900">
            <strong>Advisory Only:</strong> This assessment does not authorize, approve, or certify any flight operation. 
            You must verify all information with official FAA sources before flight.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          {/* Location Section */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Flight Location</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-slate-700">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="0.000001"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="39.7392"
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">Decimal degrees (e.g., 39.7392)</p>
              </div>

              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-slate-700">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="0.000001"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="-104.9903"
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">Decimal degrees (e.g., -104.9903)</p>
              </div>
            </div>
          </div>

          {/* Flight Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Flight Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="altitude" className="block text-sm font-medium text-slate-700">
                  Altitude (ft AGL)
                </label>
                <input
                  type="number"
                  id="altitude"
                  min="0"
                  max="400"
                  required
                  value={formData.altitude_ft_agl}
                  onChange={(e) => setFormData({ ...formData, altitude_ft_agl: e.target.value })}
                  placeholder="100"
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">Feet above ground level (typically ≤400 ft; verify limits for your location)</p>
              </div>

              <div>
                <label htmlFor="datetime" className="block text-sm font-medium text-slate-700">
                  Planned Flight Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="datetime"
                  required
                  value={formData.flight_datetime}
                  onChange={(e) => setFormData({ ...formData, flight_datetime: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">Local time at the flight location</p>
              </div>

              <div>
                <label htmlFor="mission_type" className="block text-sm font-medium text-slate-700">
                  Mission Type
                </label>
                <select
                  id="mission_type"
                  required
                  value={formData.mission_type}
                  onChange={(e) => setFormData({ ...formData, mission_type: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="recreational">Recreational</option>
                  <option value="part107_commercial">Part 107 Commercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Run Preflight Check'}
            </button>
          </div>

          {/* Bottom Disclaimer */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              By submitting this form, you acknowledge that this is an advisory assessment only and does not 
              authorize any flight operation. You remain solely responsible for verifying all requirements.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}