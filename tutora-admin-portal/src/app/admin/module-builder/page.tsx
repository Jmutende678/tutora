'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  BookOpen,
  Bot,
  FileText,
  Upload,
  Play,
  Eye,
  Edit,
  Trash2,
  Save,
  Send,
  Plus,
  Filter,
  Search,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileVideo,
  Image,
  Download
} from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  content: string
  type: 'ai_generated' | 'manual'
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  assignedGroups: string[]
  estimatedDuration: number
  completions: number
  rating: number
  category: string
}

export default function ModuleBuilderPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai')
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewModule, setPreviewModule] = useState<Module | null>(null)
  
  // AI Builder State
  const [aiPrompt, setAiPrompt] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [aiSettings, setAiSettings] = useState({
    difficulty: 'intermediate',
    duration: '30',
    includeQuiz: true,
    includeInteractivity: true
  })

  // Manual Builder State
  const [manualModule, setManualModule] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    duration: 30
  })

  // Filters for module management
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all'
  })

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'manager') {
      router.push('/admin/login')
      return
    }

    loadModules()
  }, [router])

  const loadModules = async () => {
    try {
      const response = await fetch('/api/manager/modules')
      if (response.ok) {
        const data = await response.json()
        setModules(data.modules)
      } else {
        setModules([]) // Empty state for new accounts
      }
    } catch (error) {
      console.error('Failed to load modules:', error)
      setModules([])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploadedFiles(Array.from(files))
    }
  }

  const generateAIModule = async () => {
    if (!aiPrompt.trim()) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('prompt', aiPrompt)
      formData.append('difficulty', aiSettings.difficulty)
      formData.append('duration', aiSettings.duration)
      formData.append('includeQuiz', aiSettings.includeQuiz.toString())
      formData.append('includeInteractivity', aiSettings.includeInteractivity.toString())
      
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file)
      })

      const response = await fetch('/api/ai/generate-module', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        const newModule: Module = {
          id: `module_${Date.now()}`,
          title: data.title,
          description: data.description,
          content: data.content,
          type: 'ai_generated',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedGroups: [],
          estimatedDuration: parseInt(aiSettings.duration),
          completions: 0,
          rating: 0,
          category: data.category || 'General'
        }
        
        setPreviewModule(newModule)
        setShowPreview(true)
      } else {
        alert('Failed to generate module. Please try again.')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const saveModule = async (module: Module) => {
    try {
      const response = await fetch('/api/manager/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(module)
      })

      if (response.ok) {
        setModules(prev => [...prev, module])
        setShowPreview(false)
        setPreviewModule(null)
        // Reset forms
        setAiPrompt('')
        setUploadedFiles([])
        setManualModule({
          title: '',
          description: '',
          content: '',
          category: '',
          duration: 30
        })
      }
    } catch (error) {
      console.error('Save module error:', error)
    }
  }

  const publishModule = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/manager/modules/${moduleId}/publish`, {
        method: 'PATCH'
      })

      if (response.ok) {
        setModules(prev => prev.map(m => 
          m.id === moduleId ? { ...m, status: 'published' as const } : m
        ))
      }
    } catch (error) {
      console.error('Publish module error:', error)
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      try {
        const response = await fetch(`/api/manager/modules/${moduleId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setModules(prev => prev.filter(m => m.id !== moduleId))
        }
      } catch (error) {
        console.error('Delete module error:', error)
      }
    }
  }

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         module.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || module.status === filters.status
    const matchesCategory = filters.category === 'all' || module.category === filters.category
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(modules.map(m => m.category))).filter(Boolean)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Module Builder</h1>
            <p className="text-gray-600 mt-1">Create and manage training modules</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Create Module
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Manage Modules
            </button>
          </div>
        </div>

        {/* Create Module Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Creation Mode Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Creation Method</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setCreationMode('ai')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    creationMode === 'ai'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Bot className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">AI Module Builder</h3>
                  <p className="text-sm text-gray-600">
                    Upload documents/videos and let AI generate interactive training content
                  </p>
                </button>
                
                <button
                  onClick={() => setCreationMode('manual')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    creationMode === 'manual'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Manual Creation</h3>
                  <p className="text-sm text-gray-600">
                    Build your training module from scratch with full creative control
                  </p>
                </button>
              </div>
            </div>

            {/* AI Builder */}
            {creationMode === 'ai' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🤖 AI Module Builder</h2>
                
                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Training Materials (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                    >
                      Choose Files
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports PDFs, Documents, Presentations, Videos
                    </p>
                  </div>
                  
                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Prompt */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Training Module *
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Example: Create a comprehensive customer service training module covering communication skills, complaint handling, and upselling techniques for retail staff."
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>

                {/* AI Settings */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={aiSettings.difficulty}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={aiSettings.duration}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, duration: e.target.value }))}
                      min="5"
                      max="240"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* AI Options */}
                <div className="mb-6 space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={aiSettings.includeQuiz}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, includeQuiz: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include knowledge quiz</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={aiSettings.includeInteractivity}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, includeInteractivity: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Add interactive elements</span>
                  </label>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateAIModule}
                  disabled={!aiPrompt.trim() || isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Module...
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5" />
                      Generate AI Module
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Manual Builder */}
            {creationMode === 'manual' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">✏️ Manual Module Creation</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module Title *
                      </label>
                      <input
                        type="text"
                        value={manualModule.title}
                        onChange={(e) => setManualModule(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter module title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={manualModule.category}
                        onChange={(e) => setManualModule(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Sales, Customer Service, Safety"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={manualModule.description}
                      onChange={(e) => setManualModule(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of what this module covers"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Content *
                    </label>
                    <textarea
                      value={manualModule.content}
                      onChange={(e) => setManualModule(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your training content here. You can include text, bullet points, instructions, etc."
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={12}
                      required
                    />
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={manualModule.duration}
                      onChange={(e) => setManualModule(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min="5"
                      max="240"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        const newModule: Module = {
                          id: `manual_${Date.now()}`,
                          title: manualModule.title,
                          description: manualModule.description,
                          content: manualModule.content,
                          type: 'manual',
                          status: 'draft',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          assignedGroups: [],
                          estimatedDuration: manualModule.duration,
                          completions: 0,
                          rating: 0,
                          category: manualModule.category || 'General'
                        }
                        setPreviewModule(newModule)
                        setShowPreview(true)
                      }}
                      disabled={!manualModule.title || !manualModule.description || !manualModule.content}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Module
                    </button>
                    
                    <button
                      onClick={() => {
                        const newModule: Module = {
                          id: `manual_${Date.now()}`,
                          title: manualModule.title,
                          description: manualModule.description,
                          content: manualModule.content,
                          type: 'manual',
                          status: 'draft',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          assignedGroups: [],
                          estimatedDuration: manualModule.duration,
                          completions: 0,
                          rating: 0,
                          category: manualModule.category || 'General'
                        }
                        saveModule(newModule)
                      }}
                      disabled={!manualModule.title || !manualModule.description || !manualModule.content}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manage Modules Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Search modules..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your Modules</h3>
                <p className="text-gray-600">Manage your training modules</p>
              </div>
              
              <div className="p-6">
                {filteredModules.length > 0 ? (
                  <div className="space-y-4">
                    {filteredModules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{module.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                module.status === 'published' ? 'bg-green-100 text-green-700' :
                                module.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {module.status}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                module.type === 'ai_generated' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {module.type === 'ai_generated' ? 'AI Generated' : 'Manual'}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{module.estimatedDuration} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{module.completions} completions</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Created {new Date(module.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setPreviewModule(module)
                                setShowPreview(true)
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            {module.status === 'draft' && (
                              <button
                                onClick={() => publishModule(module.id)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Publish"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteModule(module.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
                    <p className="text-gray-600 mb-4">
                      {filters.search || filters.status !== 'all' || filters.category !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Create your first training module to get started'
                      }
                    </p>
                    {!filters.search && filters.status === 'all' && filters.category === 'all' && (
                      <button
                        onClick={() => setActiveTab('create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Module
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && previewModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Module Preview</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{previewModule.title}</h3>
                  <p className="text-gray-600 mb-4">{previewModule.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span>Duration: {previewModule.estimatedDuration} minutes</span>
                    <span>Category: {previewModule.category}</span>
                    <span>Type: {previewModule.type === 'ai_generated' ? 'AI Generated' : 'Manual'}</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {previewModule.content}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => saveModule(previewModule)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Module
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 