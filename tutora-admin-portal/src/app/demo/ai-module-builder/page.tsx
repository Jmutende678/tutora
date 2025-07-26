'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Clock, BookOpen, TrendingUp, Award, Settings, Edit, Heart, Share, Plus, Play, Eye, Target, Star } from 'lucide-react'

export default function AIModuleBuilder() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState('')
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  })
  
  // Professional Dashboard
  const [currentStage, setCurrentStage] = useState<'welcome' | 'dashboard'>('welcome')
  const [generatedModule, setGeneratedModule] = useState<any>(null)
  const [showEnhanceOptions, setShowEnhanceOptions] = useState(false)
  const [showConversionModal, setShowConversionModal] = useState(false)
  const [roiCalculations, setRoiCalculations] = useState({
    monthlySavings: 0,
    yearlyROI: 0,
    timeReduction: 0
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleUserInfoSubmit = () => {
    if (userInfo.email && userInfo.name) {
      setShowContactForm(false)
      
      // Send data to sales team
      fetch('/api/sales/demo-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
      }).catch(err => console.log('Sales notification failed:', err))
    }
  }

  const generateThumbnail = (videoFile: File) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    video.src = URL.createObjectURL(videoFile)
    video.load()

    video.addEventListener('loadedmetadata', () => {
      // Set video duration
      setVideoDuration(video.duration)
      
      // Generate thumbnail at 1 second mark
      video.currentTime = 1
    })

    video.addEventListener('seeked', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert canvas to data URL
      const thumbnailUrl = canvas.toDataURL('image/jpeg')
      setThumbnail(thumbnailUrl)
      
      // Clean up
      URL.revokeObjectURL(video.src)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setVideoPreview(null)
    setThumbnail(null)
    setVideoDuration(null)
    
    const selectedFile = e.target.files?.[0]
    
    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    // Validate file size (100MB limit for videos)
    const maxSize = selectedFile.type.includes('video') ? 100 * 1024 * 1024 : 50 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return
    }

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/x-msvideo'
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a text, document, image, or video file (MP4, MOV, WEBM, AVI).')
      return
    }

    setFile(selectedFile)

    // Handle video preview and thumbnail generation
    if (selectedFile.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(selectedFile)
      setVideoPreview(videoUrl)
      generateThumbnail(selectedFile)
    }
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const processFile = async () => {
    if (!file) return
    
    // Show contact form first if user info not collected
    if (!userInfo.email || !userInfo.name) {
      setShowContactForm(true)
      return
    }

    setLoading(true)
    setError(null)
    setProgress(0)
    setProcessingStatus('Initializing...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', file.type.startsWith('video/') ? 'video' : 'document')

      setProgress(25)
      setProcessingStatus('Uploading file...')

      const response = await fetch('/api/ai/process-content', {
        method: 'POST',
        body: formData,
      })

      setProgress(75)
      setProcessingStatus('Processing with AI...')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Processing failed')
      }

      const data = await response.json()
      
      setProgress(100)
      setProcessingStatus('Complete!')

      if (data.success && data.module) {
        // Navigate to dashboard
        setCurrentStage('dashboard')
        setGeneratedModule(data.module)
      } else {
        throw new Error('No module data received')
      }

    } catch (err: any) {
      console.error('Processing error:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setTimeout(() => {
        setProgress(0)
        setProcessingStatus('')
      }, 2000)
    }
  }

  const handleKeepModule = () => {
    setShowConversionModal(true)
  }
  
  // Calculate ROI when module is generated
  useEffect(() => {
    if (generatedModule) {
      const teamSize = 50 // Example team size
      const traditionalTime = 80 // Hours for traditional development
      const aiTime = 2 // Hours with AI
      const hourlyRate = 75 // Average hourly rate
      
      const monthlySavings = teamSize * (traditionalTime - aiTime) * hourlyRate
      const yearlyROI = Math.round((monthlySavings * 12 / 5000) * 100) // Assuming $5000 annual cost
      const timeReduction = Math.round(((traditionalTime - aiTime) / traditionalTime) * 100)
      
      setRoiCalculations({
        monthlySavings,
        yearlyROI,
        timeReduction
      })
    }
  }, [generatedModule])

  if (currentStage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tutora</h1>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      AI Module Builder
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                  </svg>
                  Back
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              AI Training Module Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your training content into interactive learning modules with AI-powered insights, 
              automatically generated quizzes, and comprehensive learning objectives.
            </p>
            
            {/* Progress Steps */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${file ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${file ? 'bg-green-100' : 'bg-gray-100'}`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Upload Content</span>
                </div>
                <div className="w-8 border-t border-gray-300"></div>
                <div className={`flex items-center ${loading ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${loading ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">AI Processing</span>
                </div>
                <div className="w-8 border-t border-gray-300"></div>
                <div className="flex items-center text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">Interactive Module</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Modal */}
          {showContactForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  🎯 Try Our AI Demo
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Enter your details to access our AI Module Builder demo and see how it works with your content.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your business email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={userInfo.company}
                      onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleUserInfoSubmit}
                  disabled={!userInfo.name || !userInfo.email}
                  className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    userInfo.name && userInfo.email
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🚀 Access AI Demo
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  We'll send you a follow-up with tips and pricing info
                </p>
              </div>
            </div>
          )}

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Upload Your Training Content
            </h2>

            <div className="space-y-6">
              {/* File Upload Section */}
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                file ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              }`}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".txt,.md,.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif,.mp4,.mov,.webm,.avi"
                  disabled={loading}
                />
                
                <div className="mb-4">
                  {file ? (
                    <svg className="w-16 h-16 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>

                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl transition-all duration-200 ${
                    loading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : file
                      ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : file ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                      </svg>
                      Change File
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>
                      Upload Training Content
                    </>
                  )}
                </label>
                
                {file && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      ✅ File ready for AI processing!
                    </p>
                  </div>
                )}
                
                {!file && (
                  <div className="mt-4">
                    <p className="text-lg text-gray-600 mb-2">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      📄 Training documents (.txt, .pdf, .doc, .docx) • 🖼️ Images (.jpg, .png) • 🎥 Videos (.mp4, .mov)
                      <br />
                                           <span className="text-xs">Max size: 100MB for videos, 50MB for documents</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Video Preview */}
              {videoPreview && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Video Preview</h3>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full h-full"
                      controls
                      preload="metadata"
                    />
                  </div>
                  {videoDuration && (
                    <p className="mt-2 text-sm text-gray-600">
                      Duration: {formatDuration(videoDuration)}
                    </p>
                  )}
                  {thumbnail && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Generated Thumbnail</h4>
                      <Image
                        src={thumbnail}
                        alt="Video thumbnail"
                        width={128}
                        height={96}
                        className="w-32 h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Processing Status */}
              {processingStatus && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">{processingStatus}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                      <p className="mt-2 text-xs text-red-600">
                        If this error persists, please try:
                        <br />
                        1. Using a smaller file
                        <br />
                        2. A different file format
                        <br />
                        3. Refreshing the page
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {loading && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{progress}% Complete</span>
                    <span>{processingStatus}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Process Button */}
              <button
                onClick={processFile}
                disabled={!file || loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !file || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Processing...' : 'Generate Module'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Professional Dashboard
  if (currentStage === 'dashboard' && generatedModule) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tutora</h1>
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Welcome back, {userInfo.name.split(' ')[0]}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Module ready</span>
                </div>
                <button
                  onClick={() => setCurrentStage('welcome')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Exit Demo
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Learning
            </h1>
            <p className="text-gray-600">
              Continue your learning journey
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">1</div>
                  <div className="text-sm text-gray-500">Active Courses</div>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">0%</div>
                  <div className="text-sm text-gray-500">Progress</div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{generatedModule.duration}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">Certificates</div>
                </div>
                <Award className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Recent Course */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Course (1)</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>

            {/* Clean Module Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <Image 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
                  alt={generatedModule.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    New
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowEnhanceOptions(!showEnhanceOptions)}
                      className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    {showEnhanceOptions && (
                      <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-10">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                          <Edit className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Edit Module</span>
                        </button>
                        <button 
                          onClick={handleKeepModule}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Heart className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Save Module</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                          <Share className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Share</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{generatedModule.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{generatedModule.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{generatedModule.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>5 questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>Certificate</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Store module data and navigate to results
                      localStorage.setItem('moduleContent', JSON.stringify(generatedModule.content))
                      localStorage.setItem('quizContent', JSON.stringify(generatedModule.quiz.questions))
                      localStorage.setItem('fullModuleData', JSON.stringify(generatedModule))
                      router.push('/demo/ai-module-builder/results')
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Learning
                  </button>
                  
                  <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Section - Clean and Simple */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                🎉 You Just Saved Your Organization Money!
              </h3>
              <p className="text-gray-600">
                AI-powered training creation delivers immediate value
              </p>
            </div>

            {/* ROI Numbers - Moved here as requested */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ${roiCalculations.monthlySavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Monthly Savings</div>
                <div className="text-xs text-gray-500 mt-1">vs traditional development</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {roiCalculations.yearlyROI}%
                </div>
                <div className="text-sm text-gray-600">Annual ROI</div>
                <div className="text-xs text-gray-500 mt-1">return on investment</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {roiCalculations.timeReduction}%
                </div>
                <div className="text-sm text-gray-600">Time Reduction</div>
                <div className="text-xs text-gray-500 mt-1">faster content creation</div>
              </div>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="text-center">
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/demo/ai-module-builder')}
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Another Module
              </button>
              
              <button
                onClick={() => setShowConversionModal(true)}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Save & Share with Team
              </button>
            </div>
          </div>
        </div>

        {/* Conversion Modal - Keep the same */}
        {showConversionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative">
              <button
                onClick={() => setShowConversionModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Love Your Module? Save It Forever!
                </h2>
                <p className="text-xl text-gray-600">
                  Keep this module, share it with your team, and create unlimited training content with Tutora.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-blue-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-2">What You Get</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Save this module permanently</li>
                    <li>• Share with unlimited team members</li>
                    <li>• Real-time progress tracking</li>
                    <li>• Advanced analytics dashboard</li>
                    <li>• Mobile app access</li>
                    <li>• Completion certificates</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-green-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Special Demo Offer</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">50% OFF</div>
                  <div className="text-sm text-gray-600">
                    First month of Tutora Pro for trying our demo. Start at just $44.50 instead of $89.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/register')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-200"
                >
                  Save Module & Start Free Trial
                </button>
                <button
                  onClick={() => setShowConversionModal(false)}
                  className="px-6 py-4 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Maybe Later
                </button>
              </div>
              
              <div className="text-center mt-4">
                <div className="text-sm text-gray-500">
                  ⭐ Join 500+ companies already using Tutora • 14-day free trial • No credit card required
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
} 