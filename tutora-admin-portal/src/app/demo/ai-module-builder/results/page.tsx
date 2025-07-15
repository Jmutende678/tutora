'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

export default function AIModuleBuilderResults() {
  const [moduleContent, setModuleContent] = useState<string>('')
  const [quizContent, setQuizContent] = useState<Question[]>([])
  const [transcriptContent, setTranscriptContent] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'module' | 'quiz' | 'transcript' | 'video'>('module')
  const router = useRouter()

  useEffect(() => {
    // Load content from localStorage
    const storedModule = localStorage.getItem('moduleContent')
    const storedQuiz = localStorage.getItem('quizContent')
    const storedTranscript = localStorage.getItem('transcriptContent')
    const storedThumbnail = localStorage.getItem('videoThumbnail')
    const storedPreview = localStorage.getItem('videoPreview')
    const storedDuration = localStorage.getItem('videoDuration')

    if (!storedModule || !storedQuiz) {
      router.push('/demo/ai-module-builder')
      return
    }

    try {
      setModuleContent(JSON.parse(storedModule))
      setQuizContent(JSON.parse(storedQuiz))
      if (storedTranscript) {
        setTranscriptContent(JSON.parse(storedTranscript))
      }
      if (storedThumbnail) {
        setVideoThumbnail(storedThumbnail)
      }
      if (storedPreview) {
        setVideoPreview(storedPreview)
      }
      if (storedDuration) {
        setVideoDuration(storedDuration)
      }
    } catch (error) {
      console.error('Error parsing stored content:', error)
      router.push('/demo/ai-module-builder')
    }

    // Cleanup function
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
    }
  }, [router])

  const formatDuration = (seconds: string): string => {
    const totalSeconds = parseInt(seconds)
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = Math.floor(totalSeconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Generated Training Module
            </h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('module')}
                  className={`${
                    activeTab === 'module'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Module Content
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`${
                    activeTab === 'quiz'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Quiz Questions
                </button>
                {videoPreview && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`${
                      activeTab === 'video'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Video
                  </button>
                )}
                {transcriptContent && (
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`${
                      activeTab === 'transcript'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Transcript
                  </button>
                )}
              </nav>
            </div>

            {/* Content Area */}
            <div className="prose max-w-none">
              {activeTab === 'module' && (
                <div className="whitespace-pre-wrap">{moduleContent}</div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  {quizContent.map((question, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-4">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-md ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 border border-green-200'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <span className="ml-2 text-green-600 text-sm">
                                ✓ Correct Answer
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'video' && videoPreview && (
                <div className="space-y-6">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={videoPreview}
                      className="w-full h-full"
                      controls
                      preload="metadata"
                    />
                  </div>
                  {videoDuration && (
                    <p className="text-sm text-gray-600">
                      Duration: {formatDuration(videoDuration)}
                    </p>
                  )}
                  {videoThumbnail && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Video Thumbnail</h4>
                      <img
                        src={videoThumbnail}
                        alt="Video thumbnail"
                        className="w-48 h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transcript' && transcriptContent && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          This is an AI-generated transcript. It may not be 100% accurate.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg">
                    {transcriptContent}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => router.push('/demo/ai-module-builder')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Another Module
              </button>
              <button
                onClick={() => {
                  // Clear stored content
                  localStorage.removeItem('moduleContent')
                  localStorage.removeItem('quizContent')
                  localStorage.removeItem('transcriptContent')
                  localStorage.removeItem('videoThumbnail')
                  localStorage.removeItem('videoPreview')
                  localStorage.removeItem('videoDuration')
                  router.push('/')
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 