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
      // Read file content
      const content = await readFileContent(file)
      console.log('File content read successfully')
      setProgress(20)
      setProcessingStatus('File content read successfully. Preparing for AI processing...')

      // If it's a video, include the thumbnail
      const requestBody = {
        content,
        contentType: file.type,
        fileName: file.name,
        thumbnail: file.type.startsWith('video/') ? thumbnail : null,
        duration: videoDuration
      }

      console.log('Sending request to API...')
      setProgress(40)
      setProcessingStatus('Sending content to AI for processing...')

      // Send to API
      const response = await fetch('/api/ai/process-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Received API response:', response.status)
      setProgress(60)
      setProcessingStatus('Received response from AI. Processing results...')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process content')
      }

      const data = await response.json()
      console.log('Response data received')
      setProgress(80)
      setProcessingStatus('AI processing complete. Saving results...')

      if (!data.success || !data.data) {
        throw new Error('Invalid response format')
      }

      // Store the processed content in localStorage
      localStorage.setItem('moduleContent', JSON.stringify(data.data.module))
      localStorage.setItem('quizContent', JSON.stringify(data.data.quiz))
      if (data.data.transcript) {
        localStorage.setItem('transcriptContent', JSON.stringify(data.data.transcript))
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

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === 'string') {
          resolve(content)
        } else {
          reject(new Error('Failed to read file content'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            AI Module Builder Demo
          </h1>

          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".txt,.md,.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif,.mp4,.mov,.webm,.avi"
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Processing...' : 'Select File'}
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Supports: Text files, PDFs, Documents, Images, and Videos (MP4, MOV, WEBM, AVI)
                <br />
                Max size: {file?.type.includes('video') ? '100MB' : '50MB'}
              </p>
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