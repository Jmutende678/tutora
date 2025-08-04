'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Play,
  Clock,
  Award,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Video,
  Image,
  Brain
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client - moved inside component to avoid build-time execution
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
  return createClient(supabaseUrl, supabaseKey)
}

interface Module {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_minutes: number
  points_value: number
  content_type: 'video' | 'document' | 'interactive' | 'ai_generated'
  content_url?: string
  thumbnail_url?: string
  is_ai_generated: boolean
  ai_prompt?: string
  status: 'draft' | 'published' | 'archived'
  created_by: string
  created_at: string
  updated_at: string
  company_id: string
  metadata: any
}

interface Company {
  id: string
  name: string
  company_code: string
}

interface User {
  id: string
  name: string
  email: string
}

export default function ModuleManagementPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  // Form state for create/edit module
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimated_minutes: 30,
    points_value: 100,
    content_type: 'video' as 'video' | 'document' | 'interactive' | 'ai_generated',
    content_url: '',
    thumbnail_url: '',
    is_ai_generated: false,
    ai_prompt: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    company_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabase = getSupabaseClient()

      // Load companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      if (companiesError) throw companiesError
      setCompanies(companiesData || [])

      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email')
        .order('name')

      if (usersError) throw usersError
      setUsers(usersData || [])

      // Load modules with company and creator info
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          companies (
            id,
            name,
            company_code
          ),
          users!modules_created_by_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (modulesError) throw modulesError
      setModules(modulesData || [])

    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty
    const matchesStatus = selectedStatus === 'all' || module.status === selectedStatus
    const matchesCompany = selectedCompany === 'all' || module.company_id === selectedCompany

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus && matchesCompany
  })

  const handleCreateModule = async () => {
    try {
      setError(null)

      const supabase = getSupabaseClient()

      // Validate form
      if (!formData.title || !formData.description || !formData.company_id) {
        setError('Please fill in all required fields')
        return
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to create modules')
        return
      }

      // Create module
      const { data, error } = await supabase
        .from('modules')
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty,
          estimated_minutes: formData.estimated_minutes,
          points_value: formData.points_value,
          content_type: formData.content_type,
          content_url: formData.content_url,
          thumbnail_url: formData.thumbnail_url,
          is_ai_generated: formData.is_ai_generated,
          ai_prompt: formData.ai_prompt,
          status: formData.status,
          company_id: formData.company_id,
          created_by: user.id
        }])
        .select()
        .single()

      if (error) throw error

      // Refresh data
      await loadData()
      setShowCreateModal(false)
      resetForm()

    } catch (err) {
      console.error('Error creating module:', err)
      setError('Failed to create module. Please try again.')
    }
  }

  const handleEditModule = async () => {
    if (!selectedModule) return

    try {
      setError(null)

      // Validate form
      if (!formData.title || !formData.description) {
        setError('Please fill in all required fields')
        return
      }

      const supabase = getSupabaseClient()

      // Update module
      const { error } = await supabase
        .from('modules')
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty,
          estimated_minutes: formData.estimated_minutes,
          points_value: formData.points_value,
          content_type: formData.content_type,
          content_url: formData.content_url,
          thumbnail_url: formData.thumbnail_url,
          is_ai_generated: formData.is_ai_generated,
          ai_prompt: formData.ai_prompt,
          status: formData.status
        })
        .eq('id', selectedModule.id)

      if (error) throw error

      // Refresh data
      await loadData()
      setShowEditModal(false)
      setSelectedModule(null)
      resetForm()

    } catch (err) {
      console.error('Error updating module:', err)
      setError('Failed to update module. Please try again.')
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      return
    }

    try {
      setError(null)

      const supabase = getSupabaseClient()

      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId)

      if (error) throw error

      // Refresh data
      await loadData()

    } catch (err) {
      console.error('Error deleting module:', err)
      setError('Failed to delete module. Please try again.')
    }
  }

  const handleFileUpload = async (file: File, type: 'content' | 'thumbnail') => {
    try {
      setUploadingFile(true)
      setError(null)

      const supabase = getSupabaseClient()

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${type}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('modules')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('modules')
        .getPublicUrl(filePath)

      if (type === 'content') {
        setFormData({...formData, content_url: publicUrl})
      } else {
        setFormData({...formData, thumbnail_url: publicUrl})
      }

    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload file. Please try again.')
    } finally {
      setUploadingFile(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      estimated_minutes: 30,
      points_value: 100,
      content_type: 'video',
      content_url: '',
      thumbnail_url: '',
      is_ai_generated: false,
      ai_prompt: '',
      status: 'draft',
      company_id: ''
    })
  }

  const openEditModal = (module: Module) => {
    setSelectedModule(module)
    setFormData({
      title: module.title,
      description: module.description,
      category: module.category,
      difficulty: module.difficulty,
      estimated_minutes: module.estimated_minutes,
      points_value: module.points_value,
      content_type: module.content_type,
      content_url: module.content_url || '',
      thumbnail_url: module.thumbnail_url || '',
      is_ai_generated: module.is_ai_generated,
      ai_prompt: module.ai_prompt || '',
      status: module.status,
      company_id: module.company_id
    })
    setShowEditModal(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      case 'interactive': return <Play className="w-4 h-4" />
      case 'ai_generated': return <Brain className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const categories = ['Safety', 'Compliance', 'Productivity', 'Communication', 'Leadership', 'Technical', 'Customer Service', 'Sales', 'Marketing', 'Finance', 'HR', 'Other']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Module Management</h1>
          <p className="text-gray-600 mt-2">Create and manage training modules</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Module
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedDifficulty('all')
              setSelectedStatus('all')
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Modules</p>
              <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {modules.filter(m => m.status === 'published').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Generated</p>
              <p className="text-2xl font-bold text-gray-900">
                {modules.filter(m => m.is_ai_generated).length}
              </p>
            </div>
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {modules.reduce((sum, m) => sum + m.points_value, 0)}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {/* Module Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getContentTypeIcon(module.content_type)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                    {module.status}
                  </span>
                </div>
                <div className="dropdown">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="dropdown-content hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={() => openEditModal(module)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Module Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {module.title}
              </h3>

              {/* Module Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {module.description}
              </p>

              {/* Module Meta */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{module.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Difficulty</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{module.estimated_minutes} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Points</span>
                  <span className="font-medium">{module.points_value}</span>
                </div>
              </div>
            </div>

            {/* Module Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(module.created_at).toLocaleDateString()}
                </div>
                {module.is_ai_generated && (
                  <div className="flex items-center gap-1">
                    <Brain className="w-4 h-4" />
                    AI Generated
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No modules found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating a new module'}
          </p>
        </div>
      )}

      {/* Create Module Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Module</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content Type</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({...formData, content_type: e.target.value as any})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="interactive">Interactive</option>
                    <option value="ai_generated">AI Generated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimated_minutes}
                    onChange={(e) => setFormData({...formData, estimated_minutes: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Points Value</label>
                  <input
                    type="number"
                    value={formData.points_value}
                    onChange={(e) => setFormData({...formData, points_value: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <select
                    value={formData.company_id}
                    onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Content URL</label>
                <input
                  type="url"
                  value={formData.content_url}
                  onChange={(e) => setFormData({...formData, content_url: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_ai_generated}
                    onChange={(e) => setFormData({...formData, is_ai_generated: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">AI Generated Module</label>
                </div>
              </div>

              {formData.is_ai_generated && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">AI Prompt</label>
                  <textarea
                    value={formData.ai_prompt}
                    onChange={(e) => setFormData({...formData, ai_prompt: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what you want the AI to generate..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateModule}
                  disabled={uploadingFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploadingFile ? 'Uploading...' : 'Create Module'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Module Modal */}
      {showEditModal && selectedModule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Module</h3>
              
              {/* Same form as create modal but with edit data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content Type</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({...formData, content_type: e.target.value as any})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="interactive">Interactive</option>
                    <option value="ai_generated">AI Generated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimated_minutes}
                    onChange={(e) => setFormData({...formData, estimated_minutes: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Points Value</label>
                  <input
                    type="number"
                    value={formData.points_value}
                    onChange={(e) => setFormData({...formData, points_value: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Content URL</label>
                <input
                  type="url"
                  value={formData.content_url}
                  onChange={(e) => setFormData({...formData, content_url: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_ai_generated}
                    onChange={(e) => setFormData({...formData, is_ai_generated: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">AI Generated Module</label>
                </div>
              </div>

              {formData.is_ai_generated && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">AI Prompt</label>
                  <textarea
                    value={formData.ai_prompt}
                    onChange={(e) => setFormData({...formData, ai_prompt: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what you want the AI to generate..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedModule(null)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditModule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Module
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 