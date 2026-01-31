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

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
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

          <div className="mt-10">
            <a href="/preflight" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Start Preflight Check
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="text-center text-3xl font-bold text-slate-900">Phase 1 Advisory Capabilities</h3>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h4 className="text-lg font-semibold text-slate-900">Airspace Assessment</h4>
            <p className="mt-2 text-sm text-slate-600">
              Identifies airspace class (B, C, D, E, G), controlled vs. uncontrolled areas, and whether prior authorization may be required. Results are presented conservatively with explicit uncertainty where applicable.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h4 className="text-lg font-semibold text-slate-900">Weather Advisory</h4>
            <p className="mt-2 text-sm text-slate-600">
              Displays current observations from NOAA/NWS, including visibility, ceiling, and wind conditions. Missing or incomplete data is clearly flagged for user verification.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h4 className="text-lg font-semibold text-slate-900">TFR Awareness</h4>
            <p className="mt-2 text-sm text-slate-600">
              Checks for active Temporary Flight Restrictions using FAA data with state-level relevance. All TFR results require independent confirmation by the operator.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h4 className="text-lg font-semibold text-slate-900">GO / NO-GO Summary</h4>
            <p className="mt-2 text-sm text-slate-600">
              Provides an advisory mission status: GO, GO WITH CONDITIONS, or NO-GO. GO does not mean authorized. NO-GO indicates unresolved constraints that must be verified before any flight is considered.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h4 className="text-lg font-semibold text-slate-900">Preflight Checklist</h4>
            <p className="mt-2 text-sm text-slate-600">
              FAA-aligned advisory checklist highlighting required verifications and emphasizing pilot responsibility.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">1</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Enter Flight Details</h4>
                <p className="mt-2 text-slate-600">Provide your planned location, altitude, date/time, and mission type.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">2</div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Receive Advisory Assessment</h4>
                <p className="mt-2 text-slate-600">Review airspace, weather, and TFR constraints with conservative decision-support guidance.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">3</div>
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
          <p className="text-center text-sm text-slate-500">
            © 2026 UAS FlightCheck. Advisory decision support only. Not legal advice. Not authorization to fly.
          </p>
        </div>
      </footer>
    </div>
  );
}