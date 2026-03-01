export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">UAS FlightCheck</h1>
            <nav className="flex gap-6">
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900">How It Works</a>
              <a href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">Pricing</a>
              <a href="/history" className="text-sm text-slate-600 hover:text-slate-900">History</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Drone Image */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 opacity-40 pointer-events-none">
          <img src="/drone-hero.png" alt="" className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="relative text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Advisory Preflight Decision Support for U.S. Drone Operations
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            UAS FlightCheck helps drone operators surface airspace, weather, TFR, and operational constraints before committing time, money, or legal effort to a mission.
          </p>
          
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Operational constraints may include airspace authorization requirements, weather limitations, temporary restrictions, and verification steps required before flight.
          </p>
          
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-700">
            This tool is designed to support preflight awareness and planning decisions — not to authorize, approve, or certify any operation.
          </p>

          <div className="mt-10 flex gap-4 justify-center">
            <a href="/preflight" className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-base font-medium text-white shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
              Start Preflight Check
            </a>
            <a href="/pricing#education" className="inline-flex items-center justify-center rounded-md border-2 border-[#FF6B35] bg-white px-8 py-3 text-base font-medium text-[#FF6B35] shadow-sm hover:bg-orange-50 transition-all">
              Free for Educators
            </a>
          </div>
        </div>
      </section>

      {/* For Educators Banner */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 border-y border-orange-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-orange-900">🎓 For Flight Schools & Instructors: Free Access</h3>
            <p className="mt-2 text-base text-orange-800">Education tier includes basic preflight advisory checks, perfect for instruction and student awareness. No credit card required.</p>
            <a href="/pricing" className="mt-4 inline-block text-sm font-semibold text-[#FF6B35] hover:text-orange-700">View Pricing Details →</a>
          </div>
        </div>
      </section>

      {/* Beta Banner */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-white">
              🚀 Currently in beta - Free unlimited access for all users during testing phase
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="text-center text-3xl font-bold text-slate-900">Phase 1 Advisory Capabilities</h3>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Airspace Assessment</h4>
            <p className="mt-2 text-sm text-slate-600">
              Identifies airspace class (B, C, D, E, G), controlled vs. uncontrolled areas, and whether prior authorization may be required. Results are presented conservatively with explicit uncertainty where applicable.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF6B35] to-orange-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Weather Advisory</h4>
            <p className="mt-2 text-sm text-slate-600">
              Displays current observations from NOAA/NWS, including visibility, ceiling, and wind conditions. Missing or incomplete data is clearly flagged for user verification.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">TFR Awareness</h4>
            <p className="mt-2 text-sm text-slate-600">
              Checks for active Temporary Flight Restrictions using FAA data with state-level relevance. All TFR results require independent confirmation by the operator.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">GO / NO-GO Summary</h4>
            <p className="mt-2 text-sm text-slate-600">
              Provides an advisory mission status: GO, GO WITH CONDITIONS, or NO-GO. GO does not mean authorized. NO-GO indicates unresolved constraints that must be verified before any flight is considered.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Preflight Checklist</h4>
            <p className="mt-2 text-sm text-slate-600">
              FAA-aligned advisory checklist highlighting required verifications and emphasizing pilot responsibility.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Audit-Friendly Advisory Logs</h4>
            <p className="mt-2 text-sm text-slate-600">
              Timestamped advisory snapshots with transparent data sources. Informational only — not compliance records and not regulatory documentation.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h3 className="text-center text-3xl font-bold text-slate-900">How It Works</h3>
          <div className="mt-12 space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold shadow-lg">1</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Enter Flight Details</h4>
                <p className="mt-2 text-slate-600">Provide your planned location, altitude, date/time, and mission type.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-orange-600 text-white font-semibold shadow-lg">2</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Receive Advisory Assessment</h4>
                <p className="mt-2 text-slate-600">Review airspace, weather, and TFR constraints with conservative decision-support guidance.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-semibold shadow-lg">3</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Verify with Official Sources</h4>
                <p className="mt-2 text-slate-600">Confirm all information using FAA-approved tools and authoritative sources before flight.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="text-center text-3xl font-bold text-slate-900">Built For</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl">🎓</div>
            <h4 className="mt-4 font-semibold text-slate-900">Flight Schools</h4>
            <p className="mt-2 text-sm text-slate-600">Instruction, scenario planning, and student awareness</p>
          </div>
          <div className="text-center">
            <div className="text-4xl">📜</div>
            <h4 className="mt-4 font-semibold text-slate-900">Part 107 Pilots</h4>
            <p className="mt-2 text-sm text-slate-600">Commercial and professional operators</p>
          </div>
          <div className="text-center">
            <div className="text-4xl">🎯</div>
            <h4 className="mt-4 font-semibold text-slate-900">Recreational Pilots</h4>
            <p className="mt-2 text-sm text-slate-600">Situational awareness and risk understanding</p>
          </div>
          <div className="text-center">
            <div className="text-4xl">🏢</div>
            <h4 className="mt-4 font-semibold text-slate-900">Small Operators</h4>
            <p className="mt-2 text-sm text-slate-600">Real estate, inspection, and light commercial missions</p>
          </div>
        </div>
      </section>

      {/* Data Sources Badge Section */}
      <section className="bg-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-slate-700 mb-4">DATA SOURCED FROM OFFICIAL AUTHORITIES</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-slate-600">
              <p className="font-bold">FAA UAS Data</p>
              <p className="text-xs">Airspace & Facility Maps</p>
            </div>
            <div className="text-slate-600">
              <p className="font-bold">NOAA/NWS</p>
              <p className="text-xs">Weather Observations</p>
            </div>
            <div className="text-slate-600">
              <p className="font-bold">FAA TFR Feed</p>
              <p className="text-xs">Temporary Restrictions</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Advisory only - verify all information with official FAA sources before flight</p>
        </div>
      </section>

      {/* Important Disclaimer Section */}
      <section className="bg-amber-50 border-t border-amber-200">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-amber-900 text-center">Important Disclaimer</h3>
          <p className="mt-4 text-sm text-amber-900 leading-relaxed text-center">
            UAS FlightCheck provides advisory decision support only. It does not authorize, approve, certify, or permit any flight operation. Operators remain solely responsible for verifying airspace, weather, and regulatory requirements with official FAA and authoritative sources before flight.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-6 mb-4">
            <a href="/about" className="text-sm text-slate-600 hover:text-slate-900">About</a>
            <a href="/terms" className="text-sm text-slate-600 hover:text-slate-900">Terms of Service</a>
            <a href="/privacy" className="text-sm text-slate-600 hover:text-slate-900">Privacy Policy</a>
          </div>
          <p className="text-center text-sm text-slate-500">© 2026 UAS FlightCheck. Advisory decision support only. Not legal advice. Not authorization to fly.</p>
        </div>
      </footer>
    </div>
  );
}