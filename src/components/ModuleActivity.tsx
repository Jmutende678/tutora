'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  RotateCcw,
  Target,
  Users,
  MousePointer,
  MessageSquare,
  DragHandleDots2,
  Play
} from 'lucide-react'

interface ActivityProps {
  activity: {
    type: string
    title: string
    description?: string
    prompt?: string
    instruction?: string
    choices?: Array<{
      id: string
      text: string
      outcome: string
    }>
    correctChoice?: string
    feedback?: string
    steps?: Array<{
      step: number
      action: string
      feedback: string
    }>
    items?: Array<{
      id: string
      text: string
      category: string
    }>
    categories?: string[]
    timeLimit?: number
  }
  onComplete: (score: number) => void
}

export default function ModuleActivity({ activity, onComplete }: ActivityProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [draggedItems, setDraggedItems] = useState<{[key: string]: string}>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [reflectionText, setReflectionText] = useState('')

  const getActivityIcon = () => {
    switch (activity.type) {
      case 'scenario': return <Users className="h-6 w-6" />
      case 'simulation': return <Play className="h-6 w-6" />
      case 'drag-drop': return <DragHandleDots2 className="h-6 w-6" />
      case 'reflection': return <MessageSquare className="h-6 w-6" />
      case 'video-checkpoint': return <Play className="h-6 w-6" />
      default: return <Target className="h-6 w-6" />
    }
  }

  const getActivityColor = () => {
    switch (activity.type) {
      case 'scenario': return 'from-blue-500 to-purple-600'
      case 'simulation': return 'from-green-500 to-teal-600'
      case 'drag-drop': return 'from-orange-500 to-red-600'
      case 'reflection': return 'from-purple-500 to-pink-600'
      case 'video-checkpoint': return 'from-indigo-500 to-blue-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const handleScenarioChoice = (choiceId: string) => {
    setSelectedChoice(choiceId)
    setShowFeedback(true)
    
    // Calculate score based on correct choice
    const score = choiceId === activity.correctChoice ? 100 : 60
    setTimeout(() => {
      setCompleted(true)
      onComplete(score)
    }, 2000)
  }

  const handleSimulationStep = () => {
    if (activity.steps && currentStep < activity.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
      onComplete(100)
    }
  }

  const handleDragDrop = (itemId: string, category: string) => {
    const newDraggedItems = { ...draggedItems, [itemId]: category }
    setDraggedItems(newDraggedItems)
    
    // Check if all items are placed
    if (activity.items && Object.keys(newDraggedItems).length === activity.items.length) {
      // Calculate score based on correct placements
      let correct = 0
      activity.items.forEach(item => {
        if (newDraggedItems[item.id] === item.category) {
          correct++
        }
      })
      
      const score = Math.round((correct / activity.items.length) * 100)
      setTimeout(() => {
        setCompleted(true)
        onComplete(score)
      }, 1000)
    }
  }

  const handleReflection = () => {
    if (reflectionText.trim().length > 20) {
      setCompleted(true)
      onComplete(100)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Activity Header */}
      <div className={`bg-gradient-to-r ${getActivityColor()} p-6 text-white`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            {getActivityIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{activity.title}</h3>
            <p className="text-white/90 text-sm">
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Activity
            </p>
          </div>
          {completed && (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Activity Content */}
      <div className="p-6">
        {/* Scenario Activity */}
        {activity.type === 'scenario' && (
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                {activity.description}
              </p>
            </div>
            
            {!completed && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">What would you do?</h4>
                {activity.choices?.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleScenarioChoice(choice.id)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedChoice === choice.id
                        ? choice.id === activity.correctChoice
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedChoice === choice.id
                          ? choice.id === activity.correctChoice
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedChoice === choice.id && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{choice.text}</span>
                    </div>
                    {showFeedback && selectedChoice === choice.id && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Outcome:</strong> {choice.outcome}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {showFeedback && activity.feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Expert Feedback</h5>
                <p className="text-blue-800">{activity.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Reflection Activity */}
        {activity.type === 'reflection' && (
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                {activity.prompt}
              </p>
            </div>

            {!completed && (
              <div>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Share your thoughts and insights..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">
                    {reflectionText.length} characters (minimum 20)
                  </span>
                  <button
                    onClick={handleReflection}
                    disabled={reflectionText.trim().length < 20}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Reflection
                  </button>
                </div>
              </div>
            )}

            {completed && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h5 className="font-semibold text-green-900 mb-2">Reflection Submitted</h5>
                <p className="text-green-800">Thank you for sharing your insights!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

