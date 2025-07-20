'use client'

import { useState, useEffect } from 'react'
import { Plus, Send, Clock, AlertCircle, CheckCircle, X, Filter, Search } from 'lucide-react'

interface SupportTicket {
  id: string
  type: 'technical' | 'billing' | 'feature_request' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  subject: string
  description: string
  userEmail: string
  userName: string
  companyCode?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

interface SupportTicketWidgetProps {
  companyCode?: string
  userEmail?: string
  userName?: string
  isAdmin?: boolean
}

export default function SupportTicketWidget({ 
  companyCode, 
  userEmail, 
  userName, 
  isAdmin = false 
}: SupportTicketWidgetProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    type: 'general' as const,
    priority: 'medium' as const,
    subject: '',
    description: '',
    tags: [] as string[]
  })

  // Load tickets on component mount
  useEffect(() => {
    loadTickets()
  }, [filter])

  const loadTickets = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      if (companyCode && !isAdmin) params.append('company', companyCode)

      const response = await fetch(`/api/support/ticket?${params}`)
      const data = await response.json()
      
      if (data.tickets) {
        setTickets(data.tickets)
      }
    } catch (error) {
      console.error('Failed to load tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTicket,
          userEmail: userEmail || 'anonymous@example.com',
          userName: userName || 'Anonymous User',
          companyCode
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setNewTicket({
          type: 'general',
          priority: 'medium', 
          subject: '',
          description: '',
          tags: []
        })
        setIsCreating(false)
        loadTickets() // Refresh ticket list
        
        // Show success message
        alert(`✅ Support ticket #${data.ticket.id} created successfully! Our team will respond within 4 hours.`)
      } else {
        alert('Failed to create ticket: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to create ticket:', error)
      alert('Failed to create ticket. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4 text-blue-600" />
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'closed': return <X className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || ticket.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isAdmin ? 'Support Tickets' : 'My Support Tickets'}
            </h3>
            <p className="text-sm text-gray-600">
              {isAdmin ? 'Manage customer support requests' : 'Get help from our support team'}
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Ticket</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">📞</div>
            <p className="text-gray-600">No support tickets found</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-blue-600 hover:text-blue-700 text-sm mt-2"
            >
              Create your first ticket
            </button>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(ticket.status)}
                    <h4 className="font-medium text-gray-900">#{ticket.id.slice(-6)} - {ticket.subject}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Type: {ticket.type.replace('_', ' ')}</span>
                    <span>Status: {ticket.status.replace('_', ' ')}</span>
                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    {isAdmin && (
                      <span>User: {ticket.userName} ({ticket.userEmail})</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {ticket.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create Support Ticket</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newTicket.type}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General Question</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Support</option>
                  <option value="feature_request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of your issue or question"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createTicket}
                disabled={isLoading || !newTicket.subject.trim() || !newTicket.description.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Create Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 