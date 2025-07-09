'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, Video, Check, Loader2, AlertCircle, RefreshCw, Image as ImageIcon, ChevronRight } from 'lucide-react'
import Navigation from '@/components/Navigation'

interface ProcessingStep {
  title: string
  description: string
  status: 'waiting' | 'processing' | 'completed' | 'error'
}

interface GeneratedQuiz {
  question: string
  options: string[]
  correctAnswer: number
}

interface ModuleContent {
  module: string
  quiz: GeneratedQuiz[]
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FILE_TYPES = {
  // Documents
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  // Videos
  'video/mp4': 'MP4',
  'video/quicktime': 'MOV',
  // Images
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/gif': 'GIF'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const styles = {
  moduleSection: `
    bg-white rounded-lg shadow-lg overflow-hidden mb-8
    transform transition-all duration-300 hover:shadow-xl
  `,
  sectionHeader: `
    p-6 border-b border-gray-100
    bg-gradient-to-r from-blue-50 to-indigo-50
  `,
  quizHeader: `
    p-6 border-b border-gray-100
    bg-gradient-to-r from-green-50 to-emerald-50
  `,
  button: {
    primary: `
      px-6 py-3 bg-blue-600 text-white rounded-lg
      hover:bg-blue-700 transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:scale-105 transition-transform duration-200
    `,
    secondary: `
      px-4 py-2 text-gray-600
      hover:text-gray-800 transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    answer: `
      w-full p-4 text-left rounded-lg border transition-all
      hover:shadow-md duration-200
    `
  },
  progressBar: `
    w-full bg-gray-200 rounded-full h-2 overflow-hidden
    shadow-inner
  `,
  progressFill: `
    bg-gradient-to-r from-blue-500 to-blue-600
    h-2 rounded-full transition-all duration-500
  `
}

export default function AIModuleBuilderDemo() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  
  const processingSteps: ProcessingStep[] = [
    {
      title: 'Content Analysis',
      description: 'AI is analyzing your content and extracting key concepts',
      status: 'waiting'
    },
    {
      title: 'Learning Objectives',
      description: 'Identifying main learning objectives and outcomes',
      status: 'waiting'
    },
    {
      title: 'Quiz Generation',
      description: 'Creating engaging quiz questions based on content',
      status: 'waiting'
    },
    {
      title: 'Module Assembly',
      description: 'Putting everything together in an interactive format',
      status: 'waiting'
    }
  ]

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit. Your file is ${formatFileSize(file.size)}.`
    }
    
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      return `Invalid file type: ${file.type}. Please upload PDF, DOC, DOCX, MP4, MOV, JPEG, PNG, WEBP, or GIF files only.`
    }
    
    return null
  }

  const handleFileUpload = async (uploadedFile: File) => {
    setError(null)
    const validationError = validateFile(uploadedFile)
    if (validationError) {
      setError(validationError)
      return
    }

    setFile(uploadedFile)
    setIsProcessing(true)
    setCurrentStep(0)
    setModuleContent(null)
    
    try {
      // Step 1: Content Analysis
      setCurrentStep(0)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Read file content
      const content = await readFileContent(uploadedFile)
      
      // Step 2: Learning Objectives
      setCurrentStep(1)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Step 3: Quiz Generation
      setCurrentStep(2)
      
      // Process content with AI
      const response = await fetch('/api/ai/process-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          contentType: uploadedFile.type,
          fileName: uploadedFile.name
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process content')
      }

      const result = await response.json()
      
      // Step 4: Module Assembly
      setCurrentStep(3)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (result.success) {
        setModuleContent(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error processing file:', error)
      setError(error instanceof Error ? error.message : 'Failed to process content')
      processingSteps.forEach(step => step.status = 'error')
    } finally {
      setIsProcessing(false)
      setCurrentStep(4)
    }
  }

  const readFileContent = async (file: File): Promise<string> => {
    if (file.type.includes('video')) {
      return `Video file: ${file.name} (${file.type})`
    }

    if (file.type.includes('image')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          resolve(`Image file: ${file.name} (${file.type})\nBase64: ${base64}`)
        }
        reader.onerror = (e) => reject(new Error('Failed to read image file'))
        reader.readAsDataURL(file)
      })
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  const handleRetry = useCallback(() => {
    setError(null)
    setFile(null)
    setIsProcessing(false)
    setCurrentStep(0)
    setModuleContent(null)
  }, [])

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const calculateScore = () => {
    if (!moduleContent) return 0
    const correctAnswers = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === moduleContent.quiz[index].correctAnswer ? 1 : 0)
    }, 0)
    return Math.round((correctAnswers / moduleContent.quiz.length) * 100)
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const handleRetryQuiz = () => {
    setSelectedAnswers([])
    setShowResults(false)
    setCurrentQuizIndex(0)
  }

  return (
    <div className="min-h-screen bg-white overflow-auto">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Module Builder Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how our AI transforms your content into interactive learning modules.
            Upload a video or document to see it in action.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Processing Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 flex items-center text-sm font-medium text-red-700 hover:text-red-800"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-16">
          <div className="max-w-2xl mx-auto">
            <div 
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-all
                ${error ? 'border-red-400 bg-red-50' : 
                  isProcessing ? 'border-blue-400 bg-blue-50' : 
                  'border-gray-300 hover:border-gray-400'}
              `}
            >
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.mp4,.mov,.jpg,.jpeg,.png,.webp,.gif"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                id="file-upload"
                disabled={isProcessing}
              />
              <label
                htmlFor="file-upload"
                className={`${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isProcessing ? (
                  <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                ) : error ? (
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                )}
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isProcessing ? 'Processing your content...' : 
                   error ? 'Upload Failed' : 
                   'Upload your content'}
                </p>
                <p className="text-sm text-gray-500">
                  {isProcessing ? 'Please wait while we analyze your content' :
                   `Drag and drop or click to upload (max ${formatFileSize(MAX_FILE_SIZE)})`}
                </p>
                {!isProcessing && !error && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Supported formats:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="h-4 w-4 mr-1" />
                        PDF, DOC, DOCX
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Video className="h-4 w-4 mr-1" />
                        MP4, MOV
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        JPEG, PNG, WEBP, GIF
                      </div>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Processing Steps */}
        {isProcessing && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="space-y-4">
              {processingSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={step.title}
                    className={`
                      bg-white rounded-lg p-6 border transition-all duration-300
                      ${isActive ? 'border-blue-500 shadow-lg scale-105' : ''}
                      ${isCompleted ? 'border-green-500' : 'border-gray-200'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                      <div>
                        {isActive ? (
                          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                        ) : isCompleted ? (
                          <Check className="h-6 w-6 text-green-500" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Generated Module Content */}
        {moduleContent && (
          <div className="max-w-4xl mx-auto mt-16">
            <div className="prose prose-lg max-w-none">
              <div 
                className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-12"
                dangerouslySetInnerHTML={{ __html: moduleContent.module }}
              />
            </div>

            {/* Quiz Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Knowledge Check
              </h2>
              <div className="space-y-8">
                {moduleContent.quiz.map((quiz, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Question {index + 1}: {quiz.question}
                    </h3>
                    <div className="space-y-3">
                      {quiz.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`
                            p-4 rounded-lg border-2 transition-all
                            ${optionIndex === quiz.correctAnswer 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'}
                          `}
                        >
                          <p className="text-gray-700">{option}</p>
                          {optionIndex === quiz.correctAnswer && (
                            <div className="flex items-center mt-2 text-sm text-green-600">
                              <Check className="h-4 w-4 mr-1" />
                              Correct Answer
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 