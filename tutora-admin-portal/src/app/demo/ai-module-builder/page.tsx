'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AIModuleBuilder() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

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
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    setProgress(0)
    setProcessingStatus('Reading file content...')

    try {
      console.log('Preparing file for AI processing...')
      setProgress(20)
      setProcessingStatus('Preparing file for AI processing...')

      console.log('Sending request to API...')
      setProgress(40)
      setProcessingStatus('Sending file to AI for processing...')

      // Create FormData for file upload (matching the working API format)
      const formData = new FormData()
      formData.append('file', file)
      
      // Determine file type for API
      let fileType = 'document'
      if (file.type.startsWith('video/')) {
        fileType = 'video'
      }
      formData.append('fileType', fileType)

      // Send to API with proper multipart form data
      const response = await fetch('/api/ai/process-content', {
        method: 'POST',
        body: formData // No Content-Type header needed for FormData
      })

      console.log('Received API response:', response.status)
      setProgress(60)
      setProcessingStatus('Received response from AI. Processing results...')

      if (!response.ok) {
        let errorMessage = 'Failed to process content'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Response data received')
      setProgress(80)
      setProcessingStatus('AI processing complete. Saving results...')

      if (!data.success || !data.module) {
        throw new Error('Invalid response format')
      }

      // Convert complex content object to formatted string for display
      let moduleContentString = `${data.module.title || 'Untitled Module'}\n\n${data.module.description || 'No description available'}\n\n`
      
      if (data.module.content && typeof data.module.content === 'object') {
        Object.entries(data.module.content).forEach(([sectionTitle, sectionData]: [string, any]) => {
          moduleContentString += `${sectionTitle}\n`
          if (sectionData.definition) {
            moduleContentString += `${sectionData.definition}\n\n`
          }
          if (sectionData.guidelines && Array.isArray(sectionData.guidelines)) {
            sectionData.guidelines.forEach((guideline: string) => {
              moduleContentString += `• ${guideline}\n`
            })
            moduleContentString += '\n'
          }
        })
      }
      
      // Add learning objectives
      if (data.module.learningObjectives && Array.isArray(data.module.learningObjectives)) {
        moduleContentString += 'Learning Objectives:\n'
        data.module.learningObjectives.forEach((objective: string) => {
          moduleContentString += `• ${objective}\n`
        })
        moduleContentString += '\n'
      }
      
      // Add key takeaways
      if (data.module.keyTakeaways && Array.isArray(data.module.keyTakeaways)) {
        moduleContentString += 'Key Takeaways:\n'
        data.module.keyTakeaways.forEach((takeaway: string) => {
          moduleContentString += `• ${takeaway}\n`
        })
      }
      
      localStorage.setItem('moduleContent', JSON.stringify(moduleContentString))
      
      // Store quiz questions correctly
      if (data.module.quiz && data.module.quiz.questions && Array.isArray(data.module.quiz.questions)) {
        localStorage.setItem('quizContent', JSON.stringify(data.module.quiz.questions))
      }
      
      // Store the full module data for reference
      localStorage.setItem('fullModuleData', JSON.stringify(data.module))
      
      // For videos, store any transcript if available
      if (data.transcript) {
        localStorage.setItem('transcriptContent', JSON.stringify(data.transcript))
      }
      if (thumbnail) {
        localStorage.setItem('videoThumbnail', thumbnail)
      }
      if (videoDuration) {
        localStorage.setItem('videoDuration', videoDuration.toString())
      }
      if (videoPreview) {
        localStorage.setItem('videoPreview', videoPreview)
      }
      
      console.log('Content stored successfully')
      setProgress(100)
      setProcessingStatus('Processing complete! Redirecting to results...')

      // Clean up video preview URL
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }

      // Navigate to results page
      router.push('/demo/ai-module-builder/results')

    } catch (err: any) {
      console.error('Processing error:', err)
      setError(err.message || 'Failed to process file. Please try again.')
      setProgress(0)
      setProcessingStatus('')
    } finally {
      setLoading(false)
    }
  }



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
                    <img
                      src={thumbnail}
                      alt="Video thumbnail"
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