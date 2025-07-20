'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizResult {
  questionIndex: number
  selectedAnswer: number
  isCorrect: boolean
}

export default function AIModuleBuilderResults() {
  const [moduleContent, setModuleContent] = useState<string>('')
  const [quizContent, setQuizContent] = useState<Question[]>([])
  const [fullModuleData, setFullModuleData] = useState<any>(null)
  const [transcriptContent, setTranscriptContent] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'card' | 'overview' | 'content' | 'quiz'>('card')
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load content from localStorage
    const storedModule = localStorage.getItem('moduleContent')
    const storedQuiz = localStorage.getItem('quizContent')
    const storedFullModule = localStorage.getItem('fullModuleData')
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
      if (storedFullModule) {
        setFullModuleData(JSON.parse(storedFullModule))
      }
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

  const handleQuizAnswer = (selectedAnswer: number) => {
    const currentQuestion = quizContent[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    const result: QuizResult = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      isCorrect
    }
    
    setQuizResults([...quizResults, result])
    setShowFeedback(true)
    
    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestionIndex < quizContent.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setQuizCompleted(true)
      }
    }, 2500)
  }

  const restartQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestionIndex(0)
    setQuizResults([])
    setQuizCompleted(false)
    setShowFeedback(false)
  }

  const getQuizScore = () => {
    const correctAnswers = quizResults.filter(result => result.isCorrect).length
    return Math.round((correctAnswers / quizContent.length) * 100)
  }

  const formatDuration = (seconds: string): string => {
    const totalSeconds = parseInt(seconds)
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = Math.floor(totalSeconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Module Card View */}
        {currentView === 'card' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Module Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-3">
                    {fullModuleData?.title || 'AI Generated Training Module'}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {fullModuleData?.duration || 20} min • {fullModuleData?.difficulty || 'Intermediate'} Level
                  </p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Module Description */}
            <div className="px-8 py-8">
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {fullModuleData?.description || 'This AI-generated training module provides comprehensive learning content with interactive quiz questions.'}
              </p>

              {/* Learning Objectives */}
              {fullModuleData?.learningObjectives && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fullModuleData.learningObjectives.map((objective: string, index: number) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500 mr-3 mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-gray-700">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setCurrentView('overview')}
                  className="group bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 text-blue-700 px-8 py-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold text-lg">Overview</span>
                    <p className="text-blue-600 text-sm mt-1">Module details</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentView('content')}
                  className="group bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 text-green-700 px-8 py-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold text-lg">Study</span>
                    <p className="text-green-600 text-sm mt-1">Learn content</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentView('quiz')}
                  className="group bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300 text-purple-700 px-8 py-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold text-lg">Quiz</span>
                    <p className="text-purple-600 text-sm mt-1">{quizContent.length} questions</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overview Section */}
        {currentView === 'overview' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Module Overview</h2>
              <button
                onClick={() => setCurrentView('card')}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                Back to Module
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3 text-lg">Duration</h3>
                  <p className="text-blue-700 text-xl">{fullModuleData?.duration || 20} minutes</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-3 text-lg">Difficulty</h3>
                  <p className="text-purple-700 text-xl capitalize">{fullModuleData?.difficulty || 'Intermediate'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {fullModuleData?.keyTakeaways && (
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-4 text-lg">Key Takeaways</h3>
                    <ul className="space-y-3">
                      {fullModuleData.keyTakeaways.map((takeaway: string, index: number) => (
                        <li key={index} className="flex items-start text-green-800">
                          <span className="text-green-500 mr-3 mt-0.5 text-lg">•</span>
                          <span className="leading-relaxed">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        {currentView === 'content' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Training Content</h2>
              <button
                onClick={() => setCurrentView('card')}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                Back to Module
              </button>
            </div>
            
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg bg-gray-50 p-8 rounded-xl">
                {moduleContent}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Quiz Section */}
        {currentView === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Knowledge Check</h2>
              <button
                onClick={() => setCurrentView('card')}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                Back to Module
              </button>
            </div>

            {!quizStarted && !quizCompleted && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
                  <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-4">Ready to test your knowledge?</h3>
                  <p className="text-purple-700 mb-8 text-lg leading-relaxed">
                    This interactive quiz contains {quizContent.length} questions about the training material.<br/>
                    You'll receive instant feedback and see your final score.
                  </p>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold text-lg transform hover:scale-105"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            )}

            {quizStarted && !quizCompleted && (
              <div>
                <div className="mb-8">
                  <div className="flex justify-between items-center text-gray-600 mb-4">
                    <span className="text-lg font-medium">Question {currentQuestionIndex + 1} of {quizContent.length}</span>
                    <span className="text-lg">{Math.round(((currentQuestionIndex + 1) / quizContent.length) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((currentQuestionIndex + 1) / quizContent.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {quizContent[currentQuestionIndex] && (
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
                      {quizContent[currentQuestionIndex].question}
                    </h3>
                    
                    {showFeedback ? (
                      <div className="space-y-4">
                        {quizContent[currentQuestionIndex].options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                              index === quizContent[currentQuestionIndex].correctAnswer
                                ? 'bg-green-100 border-green-500 text-green-800 shadow-lg'
                                : index === quizResults[quizResults.length - 1]?.selectedAnswer
                                ? 'bg-red-100 border-red-500 text-red-800 shadow-lg'
                                : 'bg-white border-gray-200 text-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-lg">{option}</span>
                              {index === quizContent[currentQuestionIndex].correctAnswer && (
                                <span className="text-green-600 font-bold text-2xl">✓</span>
                              )}
                              {index === quizResults[quizResults.length - 1]?.selectedAnswer && 
                               index !== quizContent[currentQuestionIndex].correctAnswer && (
                                <span className="text-red-600 font-bold text-2xl">✗</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {quizContent[currentQuestionIndex].explanation && (
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
                            <div className="flex items-start">
                              <svg className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                              </svg>
                              <div>
                                <p className="text-blue-900 font-semibold mb-2">Explanation:</p>
                                <p className="text-blue-800 leading-relaxed">{quizContent[currentQuestionIndex].explanation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quizContent[currentQuestionIndex].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            className="w-full text-left p-6 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 transform hover:scale-102 text-lg"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {quizCompleted && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    getQuizScore() >= 80 ? 'bg-green-500' : getQuizScore() >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white text-3xl font-bold">{getQuizScore()}%</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h3>
                  <p className="text-gray-700 mb-8 text-xl">
                    You scored {quizResults.filter(r => r.isCorrect).length} out of {quizContent.length} questions correctly.
                  </p>
                  
                  <div className="flex justify-center space-x-6 mb-8">
                    <button
                      onClick={restartQuiz}
                      className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold"
                    >
                      Retake Quiz
                    </button>
                    <button
                      onClick={() => setCurrentView('card')}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                    >
                      Back to Module
                    </button>
                  </div>

                  {/* Detailed Results */}
                  <div className="bg-white rounded-xl p-6 text-left">
                    <h4 className="font-bold text-gray-900 mb-4 text-xl">Question Review</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quizResults.map((result, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                          result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <span className="text-gray-700 font-medium">Question {index + 1}</span>
                          <span className={`font-bold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/demo/ai-module-builder')}
            className="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold text-lg"
          >
            Create Another Module
          </button>
        </div>
      </div>
    </div>
  )
} 