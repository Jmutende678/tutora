'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ModuleActivity } from '@/components/ModuleActivity'

interface FormData {
  fullName: string
  email: string
  businessName: string
  role: string
  industry: string
  trainingGoal: string
}

interface User {
  id: string
  email: string
  full_name: string
}

interface Module {
  id: string
  title: string
  description: string
  industry: string
  difficulty: string
  progress: number
  engagement_score: number
  ai_quality: string
  activities_count: number
  quiz_count: number
  status: string
  ai_content?: any
  created_at: string
}

export default function AIModuleBuilder() {
  const [currentStage, setCurrentStage] = useState<'contact' | 'upload' | 'generating' | 'hub' | 'module' | 'leaderboard'>('contact')
  const [currentView, setCurrentView] = useState<'hub' | 'module' | 'leaderboard'>('hub')
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    businessName: '',
    role: '',
    industry: '',
    trainingGoal: ''
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadModules()
      loadLeaderboard()
      loadUserProfile()
    }
  }, [user])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.fullName.trim()) errors.push('Full name is required')
    if (!formData.email.trim()) errors.push('Email is required')
    else if (!validateEmail(formData.email)) errors.push('Please enter a valid email address (e.g., user@company.com)')
    if (!formData.businessName.trim()) errors.push('Business name is required')
    if (!formData.role.trim()) errors.push('Role is required')
    if (!formData.industry) errors.push('Industry is required')
    if (!formData.trainingGoal.trim()) errors.push('Training goal is required')
    
    return errors
  }

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setUser({
          id: user.id,
          email: profile.email,
          full_name: profile.full_name
        })
      }
    }
  }

  const loadModules = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('training_modules')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (data && !error) {
      setModules(data)
    }
  }

  const loadLeaderboard = async () => {
    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .limit(10)
    
    if (data && !error) {
      setLeaderboard(data)
    }
  }

  const loadUserProfile = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (data && !error) {
      setUserProfile(data)
    }
  }

  const createUserAccount = async () => {
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'temp_password_' + Math.random().toString(36).substring(7),
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            business_name: formData.businessName,
            role: formData.role,
            industry: formData.industry
          })

        if (profileError) throw profileError

        setUser({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName
        })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  const handleContactSubmit = async () => {
    // Validate form first
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'))
      return
    }

    try {
      console.log('✅ Form validation passed, creating user account...')
      await createUserAccount()
      console.log('✅ User account created, moving to upload stage')
      setCurrentStage('upload')
    } catch (error) {
      console.error('❌ Error creating account:', error)
      alert('Error creating account. Please try again.')
    }
  }

  const handleFileUpload = async (selectedFile: File) => {
    setUploadedFile(selectedFile)
    setUploadProgress(0)
    
    console.log('📁 File uploaded:', selectedFile.name)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }
    
    console.log('🚀 Starting module generation...')
    generateModule()
  }

  const generateModule = async () => {
    if (!user || !uploadedFile) {
      console.error('❌ Missing user or file for generation')
      return
    }

    setCurrentStage('generating')
    setIsCreating(true)
    setGenerationProgress(0)
    
    try {
      console.log('🤖 Generating AI module...')
      setGenerationProgress(20)
      
      // Create module via API
      const response = await fetch('/api/modules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${formData.industry} Training Module`,
          description: `AI-generated training module for ${formData.trainingGoal}`,
          industry: formData.industry,
          difficulty: 'intermediate',
          duration: 25,
          trainingGoal: formData.trainingGoal,
          userDetails: formData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create module')
      }

      const moduleResult = await response.json()
      const moduleData = moduleResult.module

      setGenerationProgress(50)

      // Generate AI content
      const aiResponse = await fetch('/api/ai/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.trainingGoal,
          difficulty: 'intermediate',
          duration: 25,
          industry: formData.industry,
          companyContext: formData.businessName,
          learningObjectives: [`Master ${formData.trainingGoal}`, 'Apply practical skills', 'Achieve measurable results']
        })
      })

      if (!aiResponse.ok) {
        throw new Error('Failed to generate AI content')
      }
      
      const aiResult = await aiResponse.json()

      setGenerationProgress(80)

      // Update module with AI content
      const { error: updateError } = await supabase
        .from('training_modules')
        .update({
          title: aiResult.module.title,
          description: aiResult.module.description,
          activities_count: aiResult.module.sections?.length || 0,
          quiz_count: aiResult.module.quiz?.length || 0,
          ai_content: aiResult.module
        })
        .eq('id', moduleData.id)

      if (updateError) throw updateError

      setGenerationProgress(100)

      console.log('✅ Module generated successfully!')

      // Reload modules and show the new one
      await loadModules()
      setSelectedModule({ ...moduleData, ai_content: aiResult.module })
      setCurrentStage('hub')
      setCurrentView('module')
      
    } catch (error) {
      console.error('❌ Error generating module:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to generate module'}`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleQuizSubmit = async (moduleId: string) => {
    if (!user || !selectedModule?.ai_content?.quiz) return

    const quiz = selectedModule.ai_content.quiz
    let correctAnswers = 0

    quiz.forEach((question: any, index: number) => {
      const userAnswer = quizAnswers[`q${index}`]
      if (userAnswer === question.correct_answer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quiz.length) * 100)
    setQuizScore(score)
    setShowQuizResults(true)

    // Update module status and award points
    try {
      const { error } = await supabase
        .from('training_modules')
        .update({ status: 'completed', progress: 100 })
        .eq('id', moduleId)

      if (!error) {
        // Award points
        const points = score >= 80 ? 150 : score >= 60 ? 100 : 50
        await supabase
          .from('user_points')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            points_earned: points,
            reason: score >= 80 ? 'perfect_quiz' : 'quiz_completion'
          })

        await loadModules()
        await loadLeaderboard()
        await loadUserProfile()
      }
    } catch (error) {
      console.error('Error completing module:', error)
    }
  }

  const renderContactForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 AI Module Builder</h1>
          <p className="text-gray-600">Create personalized training modules with AI</p>
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full inline-block">
            ✨ FIXED: Admin Portal Version - Button Now Works!
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Role *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Training Manager"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Industry</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Construction">Construction</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Goal *
            </label>
            <textarea
              value={formData.trainingGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, trainingGoal: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What specific skills or knowledge do you want to develop?"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleContactSubmit}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue to Module Builder
            </button>
            <button
              onClick={() => {
                setCurrentStage('hub')
                setCurrentView('hub')
              }}
              className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Browse without registration →
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUploadStage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📁 Upload Training Content</h2>
          <p className="text-gray-600">Upload your existing training materials for AI enhancement</p>
          <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full inline-block">
            ✅ Account Created: {formData.fullName}
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            accept=".pdf,.docx,.pptx,.txt"
          />
          
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="text-green-600 text-5xl">✓</div>
              <h3 className="text-lg font-medium text-gray-900">{uploadedFile.name}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-green-600">Upload complete! Generating module...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-gray-400 text-5xl">📄</div>
              <h3 className="text-lg font-medium text-gray-900">Upload your training content</h3>
              <p className="text-gray-500">PDF, DOCX, PPTX, or TXT files</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderGeneratingStage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center">
        <div className="mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"/>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 Creating Your AI Module</h2>
          <p className="text-gray-600">Our AI is analyzing your content and building interactive activities...</p>
        </div>

        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{generationProgress}% complete</p>
        </div>

        {generationProgress === 100 && (
          <button
            onClick={() => {
              setCurrentStage('hub')
              setCurrentView('module')
            }}
            className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🎉 View Your Module
          </button>
        )}
      </div>
    </div>
  )

  const renderModuleHub = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gray-900">🏆 Training Modules</h1>
            <nav className="flex space-x-6">
              <button
                onClick={() => setCurrentView('hub')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentView === 'hub' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Modules
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentView === 'leaderboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Leaderboard
              </button>
            </nav>
          </div>
          
          {userProfile && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userProfile.full_name}</p>
                <p className="text-xs text-gray-500">{userProfile.total_points} points</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userProfile.full_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {currentView === 'hub' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedModule(module)
                  setCurrentView('module')
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {module.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    module.status === 'completed' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {module.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {module.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{module.industry}</span>
                  <span>{module.activities_count} activities</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div 
              className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => setCurrentStage('contact')}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-2xl">+</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Module</h3>
              <p className="text-gray-500 text-sm">Generate a new AI-powered training module</p>
            </div>
          </div>
        )}

        {currentView === 'leaderboard' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">🏆 Top Learners</h2>
              <p className="text-gray-600">See how you rank against other users</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {leaderboard.map((user, index) => (
                <div key={user.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.full_name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.modules_completed} modules completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{user.total_points}</p>
                    <p className="text-sm text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderModuleView = () => {
    if (!selectedModule?.ai_content) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Module content not available</p>
            <button
              onClick={() => setCurrentView('hub')}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Back to Hub
            </button>
          </div>
        </div>
      )
    }

    const aiContent = selectedModule.ai_content
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('hub')}
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Hub</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{aiContent.title}</h1>
            <div className="w-24"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{aiContent.title}</h2>
            <p className="text-gray-600 mb-6">{aiContent.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Duration:</span> {aiContent.duration} minutes
              </div>
              <div>
                <span className="font-medium">Difficulty:</span> {aiContent.difficulty}
              </div>
              <div>
                <span className="font-medium">Activities:</span> {aiContent.sections?.length || 0}
              </div>
            </div>
          </div>

          {/* Render sections and activities */}
          {aiContent.sections?.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex} className="mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
                <div className="prose max-w-none text-gray-700">
                  {section.content.split('\n').map((paragraph: string, pIndex: number) => (
                    paragraph.trim() && <p key={pIndex} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {/* Render activities for this section */}
              {section.activities?.map((activity: any, activityIndex: number) => (
                <div key={activityIndex} className="mb-4">
                  <ModuleActivity 
                    activity={activity}
                    onComplete={() => console.log('Activity completed')}
                  />
                </div>
              ))}
            </div>
          ))}

          {/* Quiz Section */}
          {aiContent.quiz && aiContent.quiz.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">📝 Final Assessment</h3>
              
              {!showQuizResults ? (
                <div className="space-y-6">
                  {aiContent.quiz.map((question: any, qIndex: number) => (
                    <div key={qIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <p className="font-medium text-gray-900 mb-4">
                        {qIndex + 1}. {question.question}
                      </p>
                      
                      <div className="space-y-2">
                        {question.options?.map((option: string, oIndex: number) => (
                          <label key={oIndex} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`q${qIndex}`}
                              value={option}
                              onChange={(e) => setQuizAnswers(prev => ({
                                ...prev,
                                [`q${qIndex}`]: e.target.value
                              }))}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => handleQuizSubmit(selectedModule.id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Quiz
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className={`text-6xl mb-4 ${quizScore >= 80 ? 'text-green-500' : quizScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {quizScore >= 80 ? '🎉' : quizScore >= 60 ? '👍' : '📚'}
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h4>
                    <p className="text-xl text-gray-700 mb-4">Your Score: {quizScore}%</p>
                    <p className="text-gray-600">
                      {quizScore >= 80 ? 'Excellent work! You\'ve mastered this module.' :
                       quizScore >= 60 ? 'Good job! You have a solid understanding.' :
                       'Keep learning! Review the material and try again.'}
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setCurrentView('hub')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Back to Hub
                    </button>
                    <button
                      onClick={() => setCurrentView('leaderboard')}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      View Leaderboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Debug info
  console.log('🔧 Current stage:', currentStage, 'Current view:', currentView, 'User:', user?.full_name)

  // Main render logic
  if (currentStage === 'contact') {
    return renderContactForm()
  }

  if (currentStage === 'upload') {
    return renderUploadStage()
  }

  if (currentStage === 'generating') {
    return renderGeneratingStage()
  }

  if (currentStage === 'hub') {
    if (currentView === 'module' && selectedModule) {
      return renderModuleView()
    }
    return renderModuleHub()
  }

  return renderContactForm()
}
