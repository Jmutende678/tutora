import { Navigation } from '@/components/Navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Tutora - AI Employee Training Platform',
  description: 'Learn about how Tutora uses cookies to improve your experience. Our transparent cookie policy explains what data we collect and how you can manage your preferences.',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto pt-32 pb-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> September 15, 2025
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Tutora uses cookies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Remember your login status and preferences</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Improve our website performance and user experience</li>
                  <li>Provide personalized content and features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                    <p className="text-gray-700">
                      These cookies are necessary for the website to function properly. They enable core functionality 
                      such as security, network management, and accessibility.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                    <p className="text-gray-700">
                      These cookies collect information about how visitors use our website, such as which pages are 
                      visited most often. This data helps us improve our website performance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                    <p className="text-gray-700">
                      These cookies allow our website to remember choices you make and provide enhanced, 
                      more personal features.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                    <p className="text-gray-700">
                      We use analytics cookies to understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We may use third-party services that set cookies on our website, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Stripe:</strong> For secure payment processing</li>
                  <li><strong>Supabase:</strong> For authentication and database services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
                <p className="text-gray-700 mb-4">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use the cookie consent banner when you first visit our website</li>
                  <li>Adjust your browser settings to block or delete cookies</li>
                  <li>Use browser extensions that manage cookie preferences</li>
                </ul>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website 
                    and your user experience.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser-Specific Cookie Management</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Chrome</h3>
                    <p className="text-gray-700">Settings → Privacy and security → Cookies and other site data</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Firefox</h3>
                    <p className="text-gray-700">Options → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Safari</h3>
                    <p className="text-gray-700">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Edge</h3>
                    <p className="text-gray-700">Settings → Cookies and site permissions → Cookies and site data</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Retention</h2>
                <p className="text-gray-700 mb-4">
                  Different cookies have different retention periods:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until manually deleted</li>
                  <li><strong>Authentication cookies:</strong> Typically expire after 30 days of inactivity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or 
                  applicable laws. We will notify you of any material changes by posting the updated policy 
                  on our website with a new "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> <a href="mailto:privacy@tutoralearn.com" className="text-blue-600 hover:underline">privacy@tutoralearn.com</a><br />
                    <strong>Address:</strong> Tutora Learning Solutions<br />
                    Level 12, 333 Collins Street<br />
                    Melbourne, VIC 3000<br />
                    Australia
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
