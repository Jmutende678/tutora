'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Users, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Flame,
  Target,
  Zap,
  LogOut,
  Copy,
  Send,
  Building,
  Phone,
  Clock
} from 'lucide-react'

export default function SimpleCEODashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<any[]>([])

  // CEO Password
  const CEO_PASSWORD = 'TutoraCEO2024!'

  // Check authentication on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('ceo_authenticated') === 'true'
    setIsAuthenticated(isAuth)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (password === CEO_PASSWORD) {
      sessionStorage.setItem('ceo_authenticated', 'true')
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password. Access denied.')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('ceo_authenticated')
    setIsAuthenticated(false)
  }

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/track-activity?limit=20')
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchActivities()
      const interval = setInterval(fetchActivities, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CEO Portal Access</h1>
            <p className="text-gray-600">Enter password to access live activity dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter CEO password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Authorized access only • Tutora CEO Portal
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 CEO Live Activity Dashboard</h1>
            <p className="text-gray-600">Real-time website activity and lead tracking</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-blue-600">{activities.length}</p>
                <p className="text-xs text-gray-500">All tracked events</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">
                  {activities.filter(a => a.type === 'contact_form' || a.type === 'ai_demo_complete').length}
                </p>
                <p className="text-xs text-gray-500">High priority</p>
              </div>
              <Flame className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registrations</p>
                <p className="text-2xl font-bold text-green-600">
                  {activities.filter(a => a.type === 'registration').length}
                </p>
                <p className="text-xs text-gray-500">New users</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activities.filter(a => a.type === 'page_view').length}
                </p>
                <p className="text-xs text-gray-500">Website traffic</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Live Activity Feed
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                LIVE
              </span>
            </h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No activity data yet. Activity will appear here as users interact with your website.</p>
                <p className="text-sm mt-2">Try submitting the contact form or using the AI demo to test!</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {activity.type === 'contact_form' && <Mail className="h-5 w-5 text-blue-600 mt-1" />}
                      {activity.type === 'ai_demo_complete' && <Zap className="h-5 w-5 text-purple-600 mt-1" />}
                      {activity.type === 'registration' && <Users className="h-5 w-5 text-green-600 mt-1" />}
                      {activity.type === 'page_view' && <Eye className="h-5 w-5 text-gray-600 mt-1" />}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {activity.user?.name || 'Anonymous User'}
                          </span>
                          {(activity.type === 'contact_form' || activity.type === 'ai_demo_complete') && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              🔥 HOT LEAD
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.user?.email || 'No email'} • {activity.user?.company || 'No company'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {activity.type?.replace('_', ' ')} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 How to Generate Leads:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Contact Form:</strong> Visit /contact and submit the form
            </div>
            <div>
              <strong>AI Demo:</strong> Visit /demo/ai-module-builder and complete the demo
            </div>
            <div>
              <strong>User Registration:</strong> Any signup or registration activity
            </div>
            <div>
              <strong>Page Views:</strong> General website navigation and engagement
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
