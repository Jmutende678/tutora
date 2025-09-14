'use client'

import { useState } from 'react'

export default function TestTrackingPage() {
  const [status, setStatus] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testAPIDirectly = async () => {
    addLog('🔥 Testing API directly...')
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'test-123',
          type: 'manual_test',
          timestamp: new Date().toISOString(),
          source: '/test-tracking',
          metadata: {
            test: true,
            url: window.location.href
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        addLog('✅ API Response: ' + JSON.stringify(data))
        setStatus('API Working!')
      } else {
        addLog('❌ API Error: ' + response.status + ' ' + response.statusText)
        setStatus('API Failed!')
      }
    } catch (error) {
      addLog('❌ Network Error: ' + error)
      setStatus('Network Error!')
    }
  }

  const testHealthCheck = async () => {
    addLog('🏥 Testing API health check...')
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'GET'
      })

      if (response.ok) {
        const data = await response.json()
        addLog('✅ Health Check: ' + JSON.stringify(data))
      } else {
        addLog('❌ Health Check Failed: ' + response.status)
      }
    } catch (error) {
      addLog('❌ Health Check Error: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Activity Tracking Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          <div className="space-y-4">
            <button
              onClick={testAPIDirectly}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Test API Directly
            </button>
            
            <button
              onClick={testHealthCheck}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 ml-4"
            >
              Test Health Check
            </button>
          </div>
          
          {status && (
            <div className={`mt-4 p-4 rounded-lg ${
              status.includes('Working') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <strong>Status: {status}</strong>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Console Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div>No logs yet... Click a test button above.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>API Test:</strong> Should return success message from /api/analytics/track</li>
            <li><strong>Health Check:</strong> Should return service status from GET request</li>
            <li><strong>Console:</strong> Check browser console for additional logs</li>
            <li><strong>Network Tab:</strong> Check if requests are being made</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
