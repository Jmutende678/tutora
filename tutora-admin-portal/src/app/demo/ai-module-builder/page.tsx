'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  Video, 
  Brain, 
  Sparkles, 
  Play, 
  Edit, 
  Share2, 
  Download, 
  Settings,
  Clock,
  Users,
  Target,
  Award,
  BookOpen,
  Plus,
  Eye,
  Heart,
  Zap,
  ChevronRight,
  CheckCircle,
  ImageIcon,
  Wand2,
  BarChart3,
  Globe
} from 'lucide-react'

interface ModuleComponent {
  id: string
  type: 'scenario' | 'quiz' | 'drag-drop' | 'simulation' | 'reflection' | 'video-checkpoint' | 'diagram'
  title: string
  description: string
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content?: any
}

interface GeneratedModule {
  id: string
  title: string
  description: string
  industry: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number
  totalComponents: number
  imageUrl: string
  components: ModuleComponent[]
  generatedAt: Date
  status: 'draft' | 'ready' | 'published'
}

export default function AIModuleBuilder() {
  const [currentStage, setCurrentStage] = useState<'welcome' | 'upload' | 'generating' | 'dashboard'>('welcome')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedModule, setGeneratedModule] = useState<GeneratedModule | null>(null)
  const [userName, setUserName] = useState('Demo User')
  const [businessName, setBusinessName] = useState('Your Business')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Simulate AI analysis and module generation
  const analyzeAndGenerate = async (uploadedFile: File) => {
    setIsGenerating(true)
    setCurrentStage('generating')
    setGenerationProgress(0)

    const steps = [
      { progress: 20, message: "Analyzing content structure..." },
      { progress: 35, message: "Identifying key concepts..." },
      { progress: 50, message: "Determining optimal learning components..." },
      { progress: 65, message: "Generating interactive elements..." },
      { progress: 80, message: "Creating assessments..." },
      { progress: 95, message: "Finalizing module..." },
      { progress: 100, message: "Complete!" }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setGenerationProgress(step.progress)
    }

    // Generate realistic module based on file type
    const isVideo = uploadedFile.type.includes('video')
    const isPDF = uploadedFile.type.includes('pdf')
    
    const industryTypes = ['Healthcare', 'Retail', 'Technology', 'Manufacturing', 'Finance', 'Hospitality']
    const randomIndustry = industryTypes[Math.floor(Math.random() * industryTypes.length)]
    
    // Generate components based on content type and industry
    const components: ModuleComponent[] = [
      {
        id: '1',
        type: 'scenario',
        title: `Real-World ${randomIndustry} Scenario`,
        description: 'Interactive role-playing scenario based on your content',
        estimatedTime: 8,
        difficulty: 'intermediate'
      },
      {
        id: '2',
        type: isVideo ? 'video-checkpoint' : 'reflection',
        title: isVideo ? 'Video Checkpoints' : 'Knowledge Reflection',
        description: isVideo ? 'Interactive questions throughout the video' : 'Deep thinking prompts for retention',
        estimatedTime: 5,
        difficulty: 'beginner'
      },
      {
        id: '3',
        type: 'drag-drop',
        title: 'Process Sequencing',
        description: 'Drag and drop key steps in the correct order',
        estimatedTime: 6,
        difficulty: 'intermediate'
      },
      {
        id: '4',
        type: 'simulation',
        title: `${randomIndustry} Tool Simulation`,
        description: 'Hands-on practice with industry-specific tools',
        estimatedTime: 12,
        difficulty: 'advanced'
      },
      {
        id: '5',
        type: 'quiz',
        title: 'Knowledge Validation',
        description: 'Comprehensive assessment of learned concepts',
        estimatedTime: 4,
        difficulty: 'intermediate'
      }
    ]

    const newModule: GeneratedModule = {
      id: `module_${Date.now()}`,
      title: `${randomIndustry} Training Module`,
      description: `AI-generated interactive training based on your ${isVideo ? 'video' : 'document'} content`,
      industry: randomIndustry,
      difficulty: 'intermediate',
      estimatedDuration: components.reduce((total, comp) => total + comp.estimatedTime, 0),
      totalComponents: components.length,
      imageUrl: `/api/placeholder/400/240?text=${encodeURIComponent(randomIndustry + ' Training')}`,
      components,
      generatedAt: new Date(),
      status: 'ready'
    }

    setGeneratedModule(newModule)
    setIsGenerating(false)
    setCurrentStage('dashboard')
  }

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile)
    setUploadProgress(0)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }
    
    // Start AI analysis
    await analyzeAndGenerate(selectedFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileUpload(droppedFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'scenario': return <Users className="h-5 w-5" />
      case 'quiz': return <Target className="h-5 w-5" />
      case 'drag-drop': return <Zap className="h-5 w-5" />
      case 'simulation': return <Settings className="h-5 w-5" />
      case 'reflection': return <Heart className="h-5 w-5" />
      case 'video-checkpoint': return <Video className="h-5 w-5" />
      case 'diagram': return <BarChart3 className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Welcome Stage
  if (currentStage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tutora AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform any content into engaging, interactive training modules with the power of AI
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Our AI understands your content and creates the perfect learning experience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Components</h3>
              <p className="text-gray-600">Scenarios, simulations, and assessments that actually engage learners</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">Get professional training modules in minutes, not weeks</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setCurrentStage('upload')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Creating <ChevronRight className="h-5 w-5 ml-2 inline" />
            </button>
            <p className="text-sm text-gray-500 mt-4">No signup required for demo</p>
          </div>
        </div>
      </div>
    )
  }

  // Upload Stage
  if (currentStage === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Content</h1>
              <p className="text-gray-600">Upload a video, document, or presentation to get started</p>
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your file here</h3>
              <p className="text-gray-600 mb-4">or click to browse</p>
              <p className="text-sm text-gray-500">
                Supports: PDF, DOCX, PPT, MP4, MOV, AVI (max 100MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.ppt,.pptx,.mp4,.mov,.avi"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentStage('welcome')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to start
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Generation Stage
  if (currentStage === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Creating Your Module</h2>
          <p className="text-gray-600 mb-8">Our AI is analyzing your content and building interactive components...</p>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{generationProgress}% Complete</p>
        </div>
      </div>
    )
  }

  // Dashboard Stage
  if (currentStage === 'dashboard' && generatedModule) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-gray-600">Here's your AI-generated training module</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={() => setShowSignupPrompt(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Keep Module
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Module Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Module Header with Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                  <div className="absolute bottom-4 left-6 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(generatedModule.difficulty)}`}>
                        {generatedModule.difficulty.charAt(0).toUpperCase() + generatedModule.difficulty.slice(1)}
                      </span>
                      <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                        {generatedModule.industry}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold">{generatedModule.title}</h2>
                    <p className="text-blue-100">{generatedModule.description}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center text-white text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {generatedModule.estimatedDuration} min
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{generatedModule.totalComponents}</div>
                      <div className="text-sm text-gray-600">Components</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">95%</div>
                      <div className="text-sm text-gray-600">Engagement Score</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">A+</div>
                      <div className="text-sm text-gray-600">AI Quality</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Play className="h-4 w-4 mr-2" />
                      Preview Module
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      <Edit className="h-4 w-4 mr-2" />
                      Customize
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Components */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Components</h3>
                <div className="space-y-4">
                  {generatedModule.components.map((component, index) => (
                    <div key={component.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getComponentIcon(component.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{component.title}</h4>
                            <p className="text-sm text-gray-600">{component.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(component.difficulty)}`}>
                            {component.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">{component.estimatedTime}min</span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <span className="text-blue-900">Create Another Module</span>
                    <Plus className="h-4 w-4 text-blue-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-900">View Analytics</span>
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <span className="text-green-900">Assign to Team</span>
                    <Users className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">AI Insights</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Sparkles className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">Engagement Boost</p>
                        <p className="text-xs text-yellow-700">This module has 3x more interactive elements than typical training</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Perfect Difficulty</p>
                        <p className="text-xs text-green-700">AI detected intermediate-level content ideal for your team</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade Prompt */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="font-semibold mb-2">Love this module?</h3>
                <p className="text-purple-100 text-sm mb-4">Save it forever and create unlimited modules with Tutora Pro</p>
                <button 
                  onClick={() => setShowSignupPrompt(true)}
                  className="w-full bg-white text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Module</h3>
              <p className="text-gray-600 mb-4">Share this module with your team or download for offline use</p>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Share Link
                </button>
                <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full mt-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Signup Prompt */}
        {showSignupPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Keep This Module?</h3>
                <p className="text-gray-600 mb-6">Sign up to save your module and create unlimited training content</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/register')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Start Free Trial
                  </button>
                  <button 
                    onClick={() => setCurrentStage('welcome')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Create Another Demo
                  </button>
                </div>
                <button 
                  onClick={() => setShowSignupPrompt(false)}
                  className="mt-3 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
} 