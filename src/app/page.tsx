import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Tutora
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Pricing
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Contact
                </Link>
                <Link href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Team with
              <span className="block text-yellow-300">AI-Powered Training</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Create, deploy, and track custom training modules with our intelligent platform. 
              Boost productivity, engagement, and results across your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo/ai-module-builder" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors">
                🚀 Try AI Course Builder
              </Link>
              <Link href="/pricing" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tutora?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and optimize your training programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-4">AI Course Creation</h3>
              <p className="text-gray-600">
                Generate comprehensive training modules in minutes using our advanced AI technology.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">Real-time Analytics</h3>
              <p className="text-gray-600">
                Track progress, engagement, and performance with detailed insights and reporting.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-4">Team Management</h3>
              <p className="text-gray-600">
                Organize teams, assign courses, and monitor completion rates across your organization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-200">Courses Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of companies already using Tutora to boost their team performance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started Today
            </Link>
            <Link href="/demo/ai-module-builder" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              Watch Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">Tutora</div>
              <p className="text-gray-400">
                AI-powered training platform for modern teams
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link href="/features" className="block text-gray-400 hover:text-white">Features</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
                <Link href="/demo/ai-module-builder" className="block text-gray-400 hover:text-white">Demo</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white">About</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
                <Link href="/careers" className="block text-gray-400 hover:text-white">Careers</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white">Privacy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white">Terms</Link>
                <Link href="/security" className="block text-gray-400 hover:text-white">Security</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tutora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}