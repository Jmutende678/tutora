import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* 404 Hero */}
          <div className="mb-16">
            <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The page you're looking for seems to have wandered off. Don't worry, 
              it happens to the best of us! Let's get you back on track.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Link 
              href="/"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-300 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Go Home</h3>
              <p className="text-sm text-gray-600">Return to our homepage</p>
            </Link>

            <Link 
              href="/features"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-purple-300 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Explore Features</h3>
              <p className="text-sm text-gray-600">See what Tutora can do</p>
            </Link>

            <Link 
              href="/pricing"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-green-300 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <ArrowLeft className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">View Pricing</h3>
              <p className="text-sm text-gray-600">Check our plans</p>
            </Link>

            <Link 
              href="/support"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-orange-300 group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <HelpCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Help</h3>
              <p className="text-sm text-gray-600">Contact our support team</p>
            </Link>
          </div>

          {/* Popular Pages */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Pages</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
                Start Free Trial
              </Link>
              <Link href="/demo/ai-module-builder" className="text-blue-600 hover:text-blue-800 hover:underline">
                AI Demo
              </Link>
              <Link href="/enterprise-contact" className="text-blue-600 hover:text-blue-800 hover:underline">
                Enterprise Sales
              </Link>
              <Link href="/faq" className="text-blue-600 hover:text-blue-800 hover:underline">
                FAQ
              </Link>
              <Link href="/about" className="text-blue-600 hover:text-blue-800 hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 hover:underline">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Still can't find what you're looking for?
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:support@tutoralearn.com" className="text-blue-600 hover:underline">
                  support@tutoralearn.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+61383766284" className="text-blue-600 hover:underline">
                  +61 3 8376 6284
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
