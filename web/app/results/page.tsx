'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import jsPDF from 'jspdf';
import toast, { Toaster } from 'react-hot-toast';

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultsData = searchParams.get('data');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const { airspace, weather, tfr, checklist, mode, hours_until_flight, recheck_deadline } = results;

  const isForecast = mode === 'FORECAST';

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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('UAS FLIGHTCHECK ADVISORY REPORT', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('INFORMATIONAL ONLY - NOT AUTHORIZATION TO FLY', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Advisory Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ADVISORY SUMMARY', 20, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${checklist.overall_status.replace(/_/g, ' ')}`, 20, yPos);
    yPos += 6;
    doc.text(`Generated: ${formatTimestamp(new Date().toISOString())}`, 20, yPos);
    yPos += 6;
    doc.text(`Location: ${airspace.coordinates.lat}°, ${airspace.coordinates.lon}°`, 20, yPos);
    yPos += 6;
    doc.text(`Mission Type: ${results.mission_type || 'Not specified'}`, 20, yPos);
    yPos += 10;

    // Mode indicator
    if (isForecast) {
      doc.setFont('helvetica', 'bold');
      doc.text(`MODE: FORECAST (${Math.round(hours_until_flight)} hours until flight)`, 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Recheck Deadline: ${formatTimestamp(recheck_deadline)}`, 20, yPos);
      yPos += 10;
    }

    // Rationale
    if (checklist.rationale && checklist.rationale.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('RATIONALE', 20, yPos);
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const rationale = doc.splitTextToSize(checklist.rationale.join(' '), pageWidth - 40);
      doc.text(rationale, 20, yPos);
      yPos += (rationale.length * 5) + 8;
    }

    // Airspace
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('AIRSPACE ASSESSMENT', 20, yPos);
    yPos += 6;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Class: ${airspace.airspace_class || 'Unknown'}`, 20, yPos);
    yPos += 5;
    doc.text(`Facility: ${airspace.facility || 'N/A'}`, 20, yPos);
    yPos += 5;
    doc.text(`LAANC Required: ${airspace.laanc_required ? 'YES' : airspace.laanc_required === false ? 'NO' : 'Unknown'}`, 20, yPos);
    yPos += 5;
    doc.text(`Data Retrieved: ${formatTimestamp(new Date().toISOString())}`, 20, yPos);
    yPos += 8;

    if (airspace.restrictions && airspace.restrictions.length > 0) {
      doc.text('Restrictions:', 20, yPos);
      yPos += 5;
      airspace.restrictions.forEach((restriction: string) => {
        const lines = doc.splitTextToSize(`• ${restriction}`, pageWidth - 40);
        doc.text(lines, 25, yPos);
        yPos += lines.length * 5;
      });
      yPos += 3;
    }

    // Weather
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(isForecast ? 'WEATHER FORECAST' : 'WEATHER CONDITIONS', 20, yPos);
    yPos += 6;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Visibility: ${weather.current_conditions.visibility_sm ? weather.current_conditions.visibility_sm + ' SM' : 'Unknown'}`, 20, yPos);
    yPos += 5;
    doc.text(`Ceiling: ${weather.current_conditions.cloud_ceiling_ft ? weather.current_conditions.cloud_ceiling_ft + ' ft' : 'Unknown'}`, 20, yPos);
    yPos += 5;
    doc.text(`Wind: ${weather.current_conditions.wind_speed_kt ? weather.current_conditions.wind_speed_kt + ' kt' : 'Unknown'}`, 20, yPos);
    yPos += 5;
    if (weather.current_conditions.wind_gust_kt) {
      doc.text(`Gusts: ${weather.current_conditions.wind_gust_kt} kt`, 20, yPos);
      yPos += 5;
    }
    doc.text(`Part 107 Status: ${weather.part107_compliance.overall_status}`, 20, yPos);
    yPos += 5;
    if (weather.current_conditions.timestamp) {
      doc.text(`${isForecast ? 'Forecast for' : 'Observed'}: ${formatTimestamp(weather.current_conditions.timestamp)}`, 20, yPos);
      yPos += 8;
    } else {
      yPos += 3;
    }

    // TFR
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TEMPORARY FLIGHT RESTRICTIONS', 20, yPos);
    yPos += 6;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${tfr.status}`, 20, yPos);
    yPos += 5;
    doc.text(`Active TFRs in State: ${tfr.tfr_count}`, 20, yPos);
    yPos += 5;
    doc.text('Method: State-level filtering only', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    const warningLines = doc.splitTextToSize('IMPORTANT: Verify exact TFR boundaries at tfr.faa.gov', pageWidth - 40);
    doc.text(warningLines, 20, yPos);
    yPos += (warningLines.length * 5) + 8;

    // Required Actions
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('REQUIRED ACTIONS', 20, yPos);
    yPos += 6;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (checklist.required_actions && checklist.required_actions.length > 0) {
      checklist.required_actions.forEach((action: string) => {
        const lines = doc.splitTextToSize(`[ ] ${action}`, pageWidth - 40);
        doc.text(lines, 20, yPos);
        yPos += lines.length * 5;
      });
    } else {
      doc.text('No specific actions required beyond standard verification.', 20, yPos);
      yPos += 5;
    }
    yPos += 8;

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Disclaimers
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLAIMERS', 20, yPos);
    yPos += 6;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    checklist.disclaimers.forEach((disclaimer: string) => {
      const lines = doc.splitTextToSize(`• ${disclaimer}`, pageWidth - 40);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 4;
    });
    yPos += 8;

    // Data Sources
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DATA SOURCES', 20, yPos);
    yPos += 5;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Airspace: FAA UAS Data Delivery System', 20, yPos);
    yPos += 4;
    doc.text('Weather: NOAA/NWS API', 20, yPos);
    yPos += 4;
    doc.text('TFRs: FAA TFR Feed', 20, yPos);
    yPos += 10;

    // Footer
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by UAS FlightCheck - https://drone-ops-compliance.vercel.app', 20, yPos);
    yPos += 4;
    doc.text('This advisory report is for informational purposes only and does not constitute', 20, yPos);
    yPos += 3;
    doc.text('authorization to operate a UAS.', 20, yPos);

    // Save
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`UAS-FlightCheck-Advisory-${timestamp}.pdf`);

    // Show email capture after PDF downloads
    toast.success('PDF Downloaded!', {
      duration: 3000,
      icon: '📄',
    });
    
    setTimeout(() => {
      setShowEmailCapture(true);
    }, 500);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'pdf_export' }),
      });

      if (response.ok) {
        toast.success('Thanks! We\'ll keep you updated.', {
          duration: 4000,
          icon: '✅',
        });
        setShowEmailCapture(false);
        setEmail('');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipEmail = () => {
    setShowEmailCapture(false);
    toast('No problem! Enjoy your PDF.', {
      icon: '👍',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Toaster position="top-center" />
      
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

        {/* FORECAST MODE BANNER */}
        {isForecast && (
          <div className="mb-6 rounded-lg border-2 border-blue-500 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📅</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-blue-900 mb-2">FORECAST-BASED ADVISORY</h2>
                <p className="text-base text-blue-900 mb-3">
                  This is a <strong>preliminary check</strong> based on weather forecasts. Weather conditions will change. 
                  You must run a final check within 24 hours of flight.
                </p>
                <div className="bg-white border-2 border-blue-300 rounded p-3">
                  <p className="text-sm font-bold text-blue-900">📍 Flight scheduled for: {formatTimestamp(weather.current_conditions.timestamp)}</p>
                  <p className="text-sm font-bold text-blue-900 mt-1">⏰ Time until flight: ~{Math.round(hours_until_flight)} hours</p>
                  <p className="text-sm font-bold text-blue-900 mt-1">🔔 RECHECK DEADLINE: {formatTimestamp(recheck_deadline)}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-blue-800"><strong>✓ DEFINITIVE:</strong> Airspace classification, LAANC requirements</p>
                  <p className="text-sm text-blue-800"><strong>⚠️ FORECAST:</strong> Wind speed, precipitation probability</p>
                  <p className="text-sm text-blue-800"><strong>❌ NOT AVAILABLE:</strong> Visibility, cloud ceiling (verify day-of-flight)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REAL-TIME MODE BANNER */}
        {!isForecast && (
          <div className="mb-6 rounded-lg border-2 border-green-500 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <div>
                <h2 className="text-lg font-bold text-green-900">REAL-TIME ADVISORY</h2>
                <p className="text-sm text-green-800">Based on current conditions. Monitor weather until takeoff.</p>
              </div>
            </div>
          </div>
        )}

        <div className={`mb-6 rounded-lg border-2 p-6 ${getStatusBadge(checklist.overall_status)}`}>
          <h2 className="text-2xl font-bold mb-2">Overall Status: {checklist.overall_status.replace(/_/g, ' ')}</h2>
          {checklist.rationale && checklist.rationale.length > 0 && <p className="text-base font-medium">{checklist.rationale.join(' ')}</p>}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900">Airspace</h3>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded font-semibold">✓ DEFINITIVE</span>
            </div>
            <div className="space-y-2 text-base text-slate-800">
              <p><span className="font-semibold">Class:</span> {airspace.airspace_class || 'Unknown'}</p>
              <p><span className="font-semibold">Facility:</span> {airspace.facility || 'N/A'}</p>
              <p><span className="font-semibold">LAANC Required:</span> {airspace.laanc_required ? 'Yes' : airspace.laanc_required === false ? 'No' : 'Unknown'}</p>
              {airspace.max_altitude_ft && <p><span className="font-semibold">Max Altitude:</span> {airspace.max_altitude_ft} ft</p>}
              {airspace.restrictions && airspace.restrictions.length > 0 && (
                <div>
                  <p className="font-semibold mt-3">Restrictions:</p>
                  <ul className="list-disc pl-5 mt-1">{airspace.restrictions.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900">{isForecast ? 'Weather Forecast' : 'Weather'}</h3>
              {isForecast ? (
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded font-semibold">⚠️ FORECAST</span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {weather.current_conditions.timestamp ? `Observed: ${getDataAge(weather.current_conditions.timestamp)}` : 'Just now'}
                </span>
              )}
            </div>
            <div className="space-y-2 text-base text-slate-800">
              {isForecast && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-3">
                  <p className="text-sm font-semibold text-amber-900">Forecast for: {formatTimestamp(weather.current_conditions.timestamp)}</p>
                  {weather.current_conditions.period_name && (
                    <p className="text-sm text-amber-800">Period: {weather.current_conditions.period_name}</p>
                  )}
                </div>
              )}
              <p><span className="font-semibold">Visibility:</span> {weather.current_conditions.visibility_sm ? `${weather.current_conditions.visibility_sm} SM` : isForecast ? 'Not available in forecast' : 'Unknown'}</p>
              <p><span className="font-semibold">Ceiling:</span> {weather.current_conditions.cloud_ceiling_ft ? `${weather.current_conditions.cloud_ceiling_ft} ft` : isForecast ? 'Not available in forecast' : 'Unknown'}</p>
              <p><span className="font-semibold">Wind:</span> {weather.current_conditions.wind_speed_kt ? `${weather.current_conditions.wind_speed_kt} kt` : 'Unknown'}</p>
              {weather.current_conditions.wind_gust_kt && <p><span className="font-semibold">Gusts:</span> {weather.current_conditions.wind_gust_kt} kt</p>}
              {weather.current_conditions.temperature_f && <p><span className="font-semibold">Temperature:</span> {weather.current_conditions.temperature_f}°F</p>}
              {weather.current_conditions.precipitation_probability !== null && weather.current_conditions.precipitation_probability !== undefined && (
                <p><span className="font-semibold">Precipitation:</span> {weather.current_conditions.precipitation_probability}% chance</p>
              )}
              <p><span className="font-semibold">Part 107 Status:</span> {weather.part107_compliance.overall_status}</p>
              {weather.current_conditions.detailed_forecast && (
                <div className="mt-3">
                  <p className="font-semibold">Detailed Forecast:</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded mt-1">{weather.current_conditions.detailed_forecast}</p>
                </div>
              )}
              {weather.part107_compliance.notes && weather.part107_compliance.notes.length > 0 && (
                <div>
                  <p className="font-semibold mt-3 text-slate-800">Notes:</p>
                  <ul className="list-disc pl-5 mt-1 text-slate-700">{weather.part107_compliance.notes.map((n: string, i: number) => <li key={i}>{n}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border-2 border-amber-500 bg-amber-50 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-amber-900">⚠️ Temporary Flight Restrictions (TFR)</h3>
              <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">Checked: Just now</span>
            </div>
            <div className="space-y-3 text-base">
              <div className="bg-amber-100 border border-amber-300 rounded p-3">
                <p className="font-bold text-amber-900 mb-1">IMPORTANT LIMITATION:</p>
                <p className="text-amber-900">This check uses <strong>state-level filtering only</strong>. TFR boundaries and exact locations are NOT verified by this tool.</p>
              </div>
              <p><span className="font-semibold text-amber-900">Status:</span> <span className="text-amber-900">{tfr.status}</span></p>
              <p><span className="font-semibold text-amber-900">Active TFRs in State:</span> <span className="text-amber-900">{tfr.tfr_count}</span></p>
              <div className="bg-white border border-amber-300 rounded p-3 mt-3">
                <p className="font-bold text-amber-900 mb-1">REQUIRED ACTION:</p>
                <p className="text-amber-900">You MUST verify exact TFR boundaries at <a href="https://tfr.faa.gov" target="_blank" rel="noopener noreferrer" className="underline font-semibold">tfr.faa.gov</a> or an FAA-approved provider before flight.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Required Actions</h3>
            {checklist.required_actions && checklist.required_actions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-800">{checklist.required_actions.map((action: string, i: number) => <li key={i}>{action}</li>)}</ul>
            ) : (
              <p className="text-base text-slate-800">No specific actions required beyond standard preflight verification.</p>
            )}
            {isForecast && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
                <p className="font-semibold text-blue-900">Additional action for forecast mode:</p>
                <p className="text-sm text-blue-800 mt-1">☐ Run final real-time check within 24 hours of flight ({formatTimestamp(recheck_deadline)})</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Preflight Checklist</h3>
            {checklist.checklist_items && checklist.checklist_items.length > 0 ? (
              <ul className="space-y-2">{checklist.checklist_items.map((item: any, i: number) => <li key={i} className="flex items-start gap-2 text-base text-slate-800"><span className="text-blue-600 font-bold">✓</span><span><strong>{item.category}:</strong> {item.item}</span></li>)}</ul>
            ) : (
              <p className="text-base text-slate-800">Standard preflight checklist applies.</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3">Important Disclaimers</h3>
          <ul className="space-y-2 text-base text-amber-900">{checklist.disclaimers.map((disclaimer: string, i: number) => <li key={i}>• {disclaimer}</li>)}</ul>
        </div>

        {/* Email Capture Modal */}
        {showEmailCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">📬 Want updates on new features?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Get notified about Pro features, founder pricing, and tool improvements. No spam, unsubscribe anytime.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipEmail}
                    className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <a href="/preflight" className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">Run Another Check</a>
          <a href="/" className="rounded-md border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50">Back to Home</a>
          <button onClick={handleExportPDF} className="rounded-md border-2 border-[#FF6B35] bg-white px-6 py-3 text-[#FF6B35] font-semibold hover:bg-orange-50 transition-all">
            📄 Export PDF Report
          </button>
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