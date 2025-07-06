'use client'

export default function TestNewDeployment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          🚀 NEW DEPLOYMENT WORKING! 🚀
        </h1>
        <p className="text-2xl text-white mb-8">
          If you can see this page, the deployment system is working!
        </p>
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-white">
          <p className="text-lg mb-4">Timestamp: {new Date().toISOString()}</p>
          <p className="text-lg">Commit: 37464fb6</p>
          <p className="text-lg">Status: ✅ DEPLOYMENT SUCCESS</p>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
} 