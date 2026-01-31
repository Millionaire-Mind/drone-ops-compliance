export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <p className="text-sm text-slate-500">Last Updated: January 31, 2026</p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">1.1 Advisory Request Data</h3>
            <p>When you run a preflight check, we collect and store:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Flight location (latitude, longitude)</li>
              <li>Planned altitude (feet AGL)</li>
              <li>Mission type (recreational, Part 107 commercial)</li>
              <li>Planned date and time of flight</li>
              <li>Advisory result (GO, GO_WITH_CONDITIONS, NO_GO)</li>
              <li>Timestamp of request</li>
            </ul>
            <p>This data is stored in our database (Supabase) for service operation and improvement.</p>

            <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">1.2 Payment Information</h3>
            <p>If you subscribe to a paid tier, payment processing is handled by Stripe. We do not store your credit card information. Stripe collects:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Billing name and email</li>
              <li>Payment method details</li>
              <li>Billing address</li>
            </ul>
            <p>See Stripe's Privacy Policy at https://stripe.com/privacy for details.</p>

            <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">1.3 Technical Data</h3>
            <p>We automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Access times and referring URLs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide advisory preflight assessments</li>
              <li>Maintain advisory history for user reference</li>
              <li>Process subscription payments and billing</li>
              <li>Improve service accuracy and coverage</li>
              <li>Analyze usage patterns and system performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Supabase (database), Stripe (payments), Render (hosting)</li>
              <li><strong>Legal Requirements:</strong> If required by law, subpoena, or regulatory inquiry</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Data Retention</h2>
            <p>We retain:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Advisory snapshots:</strong> Indefinitely for service operation (Pro tier: 90 days of accessible history)</li>
              <li><strong>Payment records:</strong> As required for tax and accounting purposes (typically 7 years)</li>
              <li><strong>Technical logs:</strong> Up to 90 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Data Security</h2>
            <p>We implement reasonable security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encrypted database storage</li>
              <li>Access controls and authentication</li>
              <li>Regular security monitoring</li>
            </ul>
            <p>However, no system is completely secure. We cannot guarantee absolute security of your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
            </ul>
            <p>To exercise these rights, contact support@uasflightcheck.io</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Cookies and Tracking</h2>
            <p>We use essential cookies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Session management</li>
              <li>Authentication (when implemented)</li>
              <li>Service functionality</li>
            </ul>
            <p>We do not currently use third-party analytics or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">8. Third-Party Services</h2>
            <p>Our service integrates with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>FAA UAS Data:</strong> Public airspace and facility data</li>
              <li><strong>NOAA/NWS API:</strong> Weather observations</li>
              <li><strong>FAA TFR Feed:</strong> Temporary flight restrictions</li>
            </ul>
            <p>These services have their own privacy policies and data handling practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p>UAS FlightCheck is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">10. International Users</h2>
            <p>Our service is operated in the United States. If you access the service from outside the U.S., your data may be transferred to and processed in the United States.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">12. Contact Information</h2>
            <p>For privacy-related questions or requests, contact:</p>
            <p className="font-semibold">support@uasflightcheck.io</p>
          </section>

          <p className="text-sm text-slate-500 mt-8 pt-8 border-t border-slate-200">By using UAS FlightCheck, you acknowledge that you have read and understood this Privacy Policy.</p>
        </div>
      </main>
    </div>
  );
}