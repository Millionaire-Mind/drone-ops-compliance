'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { runPreflightCheck } from '@/lib/api';
import dynamic from 'next/dynamic';

const FlightLocationMap = dynamic(() => import('@/components/FlightLocationMap'), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center mb-4">
      <p className="text-sm text-slate-400">Loading map...</p>
    </div>
  ),
});

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

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

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchError(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (value.trim().length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams({
          q: value,
          format: 'json',
          limit: '5',
          countrycodes: 'us',
          email: 'support@uasflightcheck.io',
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
        if (!res.ok) throw new Error('Search failed');
        const data: NominatimResult[] = await res.json();
        setSearchResults(data);
        setShowDropdown(true);
      } catch {
        setSearchError('Location search unavailable. Enter coordinates manually.');
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelectResult = (result: NominatimResult) => {
    setSearchQuery(result.display_name);
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(result.lat).toFixed(6),
      longitude: parseFloat(result.lon).toFixed(6),
    }));
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
        setSearchQuery(`Current Location (${lat}, ${lon})`);
      },
      () => {
        setGeoError('Unable to retrieve your location. Enter coordinates manually.');
      }
    );
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
    setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  };

  const mapLat = formData.latitude !== '' && !Number.isNaN(parseFloat(formData.latitude)) ? parseFloat(formData.latitude) : null;
  const mapLng = formData.longitude !== '' && !Number.isNaN(parseFloat(formData.longitude)) ? parseFloat(formData.longitude) : null;

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

      console.log('Preflight results:', results); // Debug log

      // Navigate to results page with data
      const resultsParam = encodeURIComponent(JSON.stringify(results));
      router.push(`/results?data=${resultsParam}`);
    } catch (err) {
      console.error('Preflight check error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while running the preflight check. Please try again.';
      setError(errorMessage);
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
          <p className="mt-2 text-sm text-blue-600 font-medium">
            ✓ Real-time checks (0-24 hours) · ✓ 7-day forecasts
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

            {/* Address Search */}
            <div className="mb-4">
              <label htmlFor="address-search" className="block text-sm font-medium text-slate-700">
                Search by Address or Place Name
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="address-search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="e.g. Denver City Park, Denver CO"
                  autoComplete="off"
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                />
                {isSearching && (
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">Searching...</span>
                )}
                {showDropdown && searchResults.length > 0 && (
                  <ul className="absolute z-[1000] mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((result) => (
                      <li
                        key={result.place_id}
                        onMouseDown={() => handleSelectResult(result)}
                        className="cursor-pointer px-4 py-2 text-sm text-slate-800 hover:bg-blue-50 border-b border-slate-100 last:border-0"
                      >
                        {result.display_name}
                      </li>
                    ))}
                  </ul>
                )}
                {showDropdown && searchResults.length === 0 && !isSearching && (
                  <div className="absolute z-[1000] mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-lg">
                    No results found.
                  </div>
                )}
              </div>
              {searchError && <p className="mt-1 text-xs text-red-600">{searchError}</p>}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Use Current Location
              </button>
              {geoError && <p className="mt-1 text-xs text-red-600">{geoError}</p>}
              <p className="mt-1 text-xs text-slate-500">Selecting a result above will auto-fill the coordinates. You can still edit them manually.</p>
            </div>

            <FlightLocationMap
              lat={mapLat}
              lng={mapLng}
              onLocationSelect={handleMapLocationSelect}
            />

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
                <p className="mt-1 text-xs text-slate-500">Up to 7 days in advance - local time at the flight location</p>
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