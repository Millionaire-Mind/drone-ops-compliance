export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <p className="text-sm text-slate-500">Last Updated: January 31, 2026</p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Service Description</h2>
            <p>UAS FlightCheck provides advisory preflight decision support for drone operations in the United States. This service aggregates publicly available data from FAA and NOAA sources to help operators identify potential airspace, weather, and regulatory constraints before flight planning.</p>
            <p className="font-semibold">UAS FlightCheck does not authorize, approve, certify, or permit any flight operation. All outputs are advisory only.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. No Authorization or Approval</h2>
            <p>Use of this service does not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Grant airspace authorization of any kind</li>
              <li>Satisfy any FAA regulatory requirement</li>
              <li>Replace official FAA briefings, LAANC applications, or waiver processes</li>
              <li>Constitute legal, aviation, or meteorological advice</li>
              <li>Create any regulatory compliance or flight safety certification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Operator Responsibility</h2>
            <p>You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You remain solely responsible for all flight planning, regulatory compliance, and safety determinations</li>
              <li>You must independently verify all information with official FAA and authoritative sources</li>
              <li>You must obtain all required authorizations through proper FAA channels (LAANC, DroneZone, etc.)</li>
              <li>You are responsible for understanding and complying with all applicable regulations (14 CFR Part 107, 14 CFR Part 101, etc.)</li>
              <li>Advisory outputs may be incomplete, outdated, or incorrect</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Data Sources and Limitations</h2>
            <p>UAS FlightCheck uses publicly available data from FAA and NOAA sources. We make no representations regarding:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data accuracy, completeness, or timeliness</li>
              <li>Availability or uptime of third-party data sources</li>
              <li>Coverage gaps in airspace, weather, or TFR data</li>
              <li>Detection of all relevant constraints or hazards</li>
            </ul>
            <p>TFR checks use state-level filtering and do not verify precise geographic boundaries. Weather data may be stale or incomplete. Airspace classifications are best-effort approximations.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Disclaimer of Warranties</h2>
            <p className="font-semibold">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
            <p>We do not warrant that the service will be uninterrupted, error-free, or suitable for flight operations.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW, UAS FLIGHTCHECK AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM USE OF THIS SERVICE, INCLUDING BUT NOT LIMITED TO:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Aircraft accidents, incidents, or damage</li>
              <li>Regulatory violations, fines, or enforcement actions</li>
              <li>Personal injury or property damage</li>
              <li>Loss of data, business interruption, or lost profits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any illegal purpose or in violation of FAA regulations</li>
              <li>Misrepresent advisory outputs as official authorizations</li>
              <li>Reverse engineer, scrape, or abuse the service infrastructure</li>
              <li>Share account credentials (if authentication is implemented)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">8. Advisory Logs</h2>
            <p>Advisory snapshots stored by the service are informational records only. They are not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Compliance documentation</li>
              <li>Regulatory flight logs</li>
              <li>Evidence of due diligence or authorization</li>
              <li>Admissible as proof of proper flight planning</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">9. Payment and Subscriptions</h2>
            <p>Paid tiers are billed through Stripe. Subscriptions renew automatically unless cancelled. Refunds are provided at our sole discretion. We reserve the right to modify pricing with notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">10. Modifications to Service</h2>
            <p>We reserve the right to modify, suspend, or discontinue the service at any time without notice or liability.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">11. Governing Law</h2>
            <p>These Terms are governed by the laws of the United States and the State of Washington, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">12. Contact</h2>
            <p>For questions about these Terms, contact: support@uasflightcheck.io</p>
          </section>

          <p className="text-sm text-slate-500 mt-8 pt-8 border-t border-slate-200">By using UAS FlightCheck, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        </div>
      </main>
    </div>
  );
}