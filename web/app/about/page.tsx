export default function AboutPage() {
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

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">About UAS FlightCheck</h1>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* Overview */}
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
            <p className="text-base text-slate-700 leading-relaxed">
              UAS FlightCheck is a free, web-based preflight advisory tool that answers one critical question: <strong>"Can I fly here right now?"</strong>
            </p>
            <p className="text-base text-slate-700 leading-relaxed mt-4">
              Built for experienced Part 107 commercial pilots who need fast, clear GO/NO-GO decisions with client-ready documentation.
            </p>
          </section>

          {/* What Makes Us Different */}
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Makes Us Different</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Clear Decisions, Not Just Scores</h3>
                <p className="text-base text-slate-700">
                  Unlike tools that give you a "Fly Score" and make you interpret it, UAS FlightCheck provides clear advisory decisions: <strong>GO</strong>, <strong>GO WITH CONDITIONS</strong>, or <strong>NO-GO</strong> - with specific rationale and required actions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Part 107 Compliance Checking</h3>
                <p className="text-base text-slate-700">
                  Automatically verifies weather conditions against Part 107 minimums (3 SM visibility, 500ft cloud clearance) - something most tools don't do.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">PDF Reports for Clients</h3>
                <p className="text-base text-slate-700">
                  Export timestamped advisory reports perfect for client billing, insurance documentation, and liability protection. No other free tool offers this.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Web-Based - No App Required</h3>
                <p className="text-base text-slate-700">
                  Works instantly in any browser. No downloads, no installation, no permissions. Just bookmark and go.
                </p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Airspace Assessment</h3>
                <ul className="list-disc pl-5 space-y-1 text-base text-slate-700">
                  <li>Airspace classification (B, C, D, E, G)</li>
                  <li>LAANC requirement detection</li>
                  <li>Facility identification</li>
                  <li>Conservative uncertainty flagging</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Weather Advisory</h3>
                <ul className="list-disc pl-5 space-y-1 text-base text-slate-700">
                  <li>Current NOAA/NWS observations</li>
                  <li>Part 107 compliance verification</li>
                  <li>Wind speed and gusts</li>
                  <li>Visibility and ceiling data</li>
                  <li>Data freshness timestamps</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">TFR Awareness</h3>
                <ul className="list-disc pl-5 space-y-1 text-base text-slate-700">
                  <li>State-level TFR checking</li>
                  <li>Active restriction counts</li>
                  <li>Clear verification reminders</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Documentation</h3>
                <ul className="list-disc pl-5 space-y-1 text-base text-slate-700">
                  <li>PDF export for clients</li>
                  <li>Timestamped reports</li>
                  <li>Advisory history (90 days)</li>
                  <li>All disclaimers included</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Why Free */}
          <section className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Is It Free?</h2>
            <p className="text-base text-slate-700 leading-relaxed">
              UAS FlightCheck started as a personal tool to solve my own frustration with slow, complex preflight apps. I built exactly what I needed: fast GO/NO-GO decisions with client documentation.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mt-4">
              Currently in beta with free unlimited access. No subscriptions. No premium tiers. Just a tool that works.
            </p>
          </section>

          {/* Data Sources */}
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sources</h2>
            <p className="text-base text-slate-700 mb-4">UAS FlightCheck uses publicly available data from official sources:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-base text-slate-700"><strong>FAA UAS Data Delivery System:</strong> Airspace classifications and facility maps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-base text-slate-700"><strong>NOAA/NWS API:</strong> Real-time weather observations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-base text-slate-700"><strong>FAA TFR Feed:</strong> Temporary flight restriction data</span>
              </li>
            </ul>
          </section>

          {/* What It's NOT */}
          <section className="bg-amber-50 rounded-lg border-2 border-amber-200 p-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">What UAS FlightCheck Is NOT</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✗</span>
                <span className="text-base text-amber-900"><strong>Not authorization or approval</strong> - Advisory only, does not grant airspace clearance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✗</span>
                <span className="text-base text-amber-900"><strong>Not route planning</strong> - Use DroneDeck, Litchi, or Dronelink for flight path creation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✗</span>
                <span className="text-base text-amber-900"><strong>Not LAANC submission</strong> - Use Aloft, Airmap, or Kittyhawk for actual authorization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✗</span>
                <span className="text-base text-amber-900"><strong>Not for beginners</strong> - Assumes familiarity with Part 107 regulations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">✗</span>
                <span className="text-base text-amber-900"><strong>Not comprehensive forecasting</strong> - Shows current conditions, not multi-day predictions</span>
              </li>
            </ul>
          </section>

          {/* Tech Stack */}
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Tech Stack</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Frontend</h3>
                <ul className="list-disc pl-5 space-y-1 text-base text-slate-700">
                  <li>Next.js 16 (React)</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Deployed on Vercel</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Backend</h3>
                <ul className="list-disc pl-5 space-y-1 text-base text-slate-700">
                  <li>FastAPI (Python)</li>
                  <li>Supabase (PostgreSQL)</li>
                  <li>Deployed on Render</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-red-50 rounded-lg border-2 border-red-200 p-6">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Important Disclaimer</h2>
            <p className="text-base text-red-900 leading-relaxed">
              UAS FlightCheck provides <strong>advisory decision support only</strong>. It does not authorize, approve, certify, or permit any flight operation.
            </p>
            <p className="text-base text-red-900 leading-relaxed mt-4">
              Operators remain solely responsible for verifying airspace, weather, and regulatory requirements with official FAA and authoritative sources before flight.
            </p>
            <p className="text-base text-red-900 leading-relaxed mt-4">
              This is a personal project provided "as-is" for educational and planning purposes. No warranty is provided, express or implied.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Feedback & Contact</h2>
            <p className="text-base text-slate-700 leading-relaxed">
              UAS FlightCheck is a personal project built to solve real problems for Part 107 pilots. Feedback from commercial operators is especially welcome.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mt-4">
              Find me on X (Twitter): <a href="https://x.com/devdrop_xyz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">@devdrop_xyz</a>
            </p>
          </section>

          {/* Footer Note */}
          <div className="text-center pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Made for pilots, by a pilot. Currently in beta - free unlimited access.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Version 1.0 · Last Updated: March 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}