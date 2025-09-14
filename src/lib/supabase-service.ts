import { supabaseAdmin, generateCompanyCode, Database } from './supabase'
import { nanoid } from 'nanoid'

// Type definitions
export interface Company {
  id: string
  companyCode: string
  name: string
  plan: 'basic' | 'premium' | 'enterprise'
  maxUsers: number
  currentUsers: number
  isActive: boolean
  adminUser: {
    email: string
    name: string
    password?: string
  }
  billingEmail: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  companyId: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface SupportTicket {
  id: string
  companyId: string
  userId: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: string
  companyId: string
  title: string
  description: string
  content: any
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  userId: string
  companyId: string
  isRead: boolean
  priority: string
  actionUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  engagementScore: number
  completionRate: number
  companyId: string
}

export interface CreateCompanyRequest {
  name: string
  plan: 'basic' | 'premium' | 'enterprise'
  adminUser: {
    email: string
    name: string
    password: string
  }
  billingEmail: string
}

export interface CreateUserRequest {
  companyId: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  password: string
}

export interface CreateSupportTicketRequest {
  companyId: string
  userId: string
  title: string
  description: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

export class SupabaseService {
  // Company Management
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    try {
      const companyCode = generateCompanyCode()
      const companyId = nanoid()
      
      const now = new Date().toISOString()
      
      // Determine max users based on plan
      const maxUsers = {
        basic: 50,
        premium: 200,
        enterprise: 1000
      }[companyData.plan]

      // Insert company
      const { data: company, error: companyError } = await supabaseAdmin
        .from('companies')
        .insert({
          id: companyId,
          company_code: companyCode,
          name: companyData.name,
          plan: companyData.plan,
          max_users: maxUsers,
          current_users: 0,
          is_active: true,
          admin_user_email: companyData.adminUser.email,
          admin_user_name: companyData.adminUser.name,
          billing_email: companyData.billingEmail,
          created_at: now,
          updated_at: now
        })
        .select()
        .single()

      if (companyError) {
        console.error('❌ Error creating company:', companyError)
        throw companyError
      }

      // Create admin user in auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: companyData.adminUser.email,
        password: companyData.adminUser.password,
        email_confirm: true
      })

      if (authError) {
        console.error('❌ Error creating auth user:', authError)
        throw authError
      }

      // Create user record
      const { error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authUser.user.id,
          company_id: companyId,
          email: companyData.adminUser.email,
          name: companyData.adminUser.name,
          role: 'admin',
          is_active: true,
          created_at: now,
          updated_at: now
        })

      if (userError) {
        console.error('❌ Error creating user record:', userError)
        throw userError
      }

      console.log('✅ Company created successfully:', companyCode)

      return {
        id: company.id,
        companyCode: company.company_code,
        name: company.name,
        plan: company.plan,
        maxUsers: company.max_users,
        currentUsers: company.current_users,
        isActive: company.is_active,
        adminUser: {
          email: company.admin_user_email,
          name: company.admin_user_name
        },
        billingEmail: company.billing_email,
        createdAt: company.created_at,
        updatedAt: company.updated_at
      }
    } catch (error) {
      console.error('❌ Failed to create company:', error)
      throw error
    }
  }

  async getCompanyByCode(companyCode: string): Promise<Company | null> {
    try {
      const { data: company, error } = await supabaseAdmin
        .from('companies')
        .select('*')
        .eq('company_code', companyCode)
        .eq('is_active', true)
        .single()

      if (error || !company) {
        return null
      }

      return {
        id: company.id,
        companyCode: company.company_code,
        name: company.name,
        plan: company.plan,
        maxUsers: company.max_users,
        currentUsers: company.current_users,
        isActive: company.is_active,
        adminUser: {
          email: company.admin_user_email,
          name: company.admin_user_name
        },
        billingEmail: company.billing_email,
        createdAt: company.created_at,
        updatedAt: company.updated_at
      }
    } catch (error) {
      console.error('❌ Error getting company by code:', error)
      return null
    }
  }

  async getAllCompanies(): Promise<Company[]> {
    try {
      const { data: companies, error } = await supabaseAdmin
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error getting companies:', error)
        return []
      }

      return companies.map(company => ({
        id: company.id,
        companyCode: company.company_code,
        name: company.name,
        plan: company.plan,
        maxUsers: company.max_users,
        currentUsers: company.current_users,
        isActive: company.is_active,
        adminUser: {
          email: company.admin_user_email,
          name: company.admin_user_name
        },
        billingEmail: company.billing_email,
        createdAt: company.created_at,
        updatedAt: company.updated_at
      }))
    } catch (error) {
      console.error('❌ Error getting all companies:', error)
      return []
    }
  }

  // User Management
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Create auth user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      })

      if (authError) {
        console.error('❌ Error creating auth user:', authError)
        throw authError
      }

      const now = new Date().toISOString()

      // Create user record
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authUser.user.id,
          company_id: userData.companyId,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          is_active: true,
          created_at: now,
          updated_at: now
        })
        .select()
        .single()

      if (userError) {
        console.error('❌ Error creating user record:', userError)
        throw userError
      }

      // Update company user count
      await this.updateCompanyUserCount(userData.companyId)

      return {
        id: user.id,
        companyId: user.company_id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.is_active,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    } catch (error) {
      console.error('❌ Failed to create user:', error)
      throw error
    }
  }

  async getUsersByCompany(companyId: string): Promise<User[]> {
    try {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error getting users:', error)
        return []
      }

      return users.map(user => ({
        id: user.id,
        companyId: user.company_id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.is_active,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }))
    } catch (error) {
      console.error('❌ Error getting users by company:', error)
      return []
    }
  }

  // Support Tickets
  async createSupportTicket(ticketData: CreateSupportTicketRequest): Promise<SupportTicket> {
    try {
      const now = new Date().toISOString()

      const { data: ticket, error } = await supabaseAdmin
        .from('support_tickets')
        .insert({
          id: nanoid(),
          company_id: ticketData.companyId,
          user_id: ticketData.userId,
          title: ticketData.title,
          description: ticketData.description,
          status: 'open',
          priority: ticketData.priority || 'medium',
          created_at: now,
          updated_at: now
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating support ticket:', error)
        throw error
      }

      return {
        id: ticket.id,
        companyId: ticket.company_id,
        userId: ticket.user_id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at
      }
    } catch (error) {
      console.error('❌ Failed to create support ticket:', error)
      throw error
    }
  }

  async getSupportTickets(filters: {
    status?: string
    priority?: string
    companyId?: string
    limit?: number
  }): Promise<SupportTicket[]> {
    try {
      let query = supabaseAdmin
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority)
      }
      if (filters.companyId) {
        query = query.eq('company_id', filters.companyId)
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data: tickets, error } = await query

      if (error) {
        console.error('❌ Error getting support tickets:', error)
        return []
      }

      return tickets.map(ticket => ({
        id: ticket.id,
        companyId: ticket.company_id,
        userId: ticket.user_id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at
      }))
    } catch (error) {
      console.error('❌ Error getting support tickets:', error)
      return []
    }
  }

  async updateSupportTicket(ticketId: string, updateData: Partial<{
    status: string
    priority: string
    assigned_to: string
    updated_at: string
  }>): Promise<SupportTicket> {
    try {
      const { data: ticket, error } = await supabaseAdmin
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating support ticket:', error)
        throw error
      }

      return {
        id: ticket.id,
        companyId: ticket.company_id,
        userId: ticket.user_id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at
      }
    } catch (error) {
      console.error('❌ Failed to update support ticket:', error)
      throw error
    }
  }

  // Modules
  async getModulesForCompany(companyId: string): Promise<Module[]> {
    try {
      const { data: modules, error } = await supabaseAdmin
        .from('modules')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error getting modules:', error)
        return []
      }

      return modules.map(module => ({
        id: module.id,
        companyId: module.company_id,
        title: module.title,
        description: module.description,
        content: module.content,
        isActive: module.is_active,
        createdBy: module.created_by,
        createdAt: module.created_at,
        updatedAt: module.updated_at
      }))
    } catch (error) {
      console.error('❌ Error getting modules for company:', error)
      return []
    }
  }

  async getModuleById(moduleId: string): Promise<Module | null> {
    try {
      const { data: module, error } = await supabaseAdmin
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single()

      if (error) {
        console.error('❌ Error getting module by ID:', error)
        return null
      }

      return {
        id: module.id,
        companyId: module.company_id,
        title: module.title,
        description: module.description,
        content: module.content,
        isActive: module.is_active,
        createdBy: module.created_by,
        createdAt: module.created_at,
        updatedAt: module.updated_at
      }
    } catch (error) {
      console.error('❌ Error getting module by ID:', error)
      return null
    }
  }

  // Notifications
  async createNotification(notificationData: {
    type: string
    title: string
    message: string
    userId: string
    companyId: string
    priority: string
    actionUrl?: string
  }): Promise<Notification | null> {
    try {
      const now = new Date().toISOString()

      const { data: notification, error } = await supabaseAdmin
        .from('notifications')
        .insert({
          id: nanoid(),
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          user_id: notificationData.userId,
          company_id: notificationData.companyId,
          priority: notificationData.priority,
          action_url: notificationData.actionUrl,
          is_read: false,
          created_at: now,
          updated_at: now
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating notification:', error)
        return null
      }

      return {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        userId: notification.user_id,
        companyId: notification.company_id,
        isRead: notification.is_read,
        priority: notification.priority,
        actionUrl: notification.action_url,
        createdAt: notification.created_at,
        updatedAt: notification.updated_at
      }
    } catch (error) {
      console.error('❌ Failed to create notification:', error)
      return null
    }
  }

  async getUserNotifications(userId: string, options: {
    limit?: number
    unreadOnly?: boolean
  } = {}): Promise<Notification[]> {
    try {
      let query = supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (options.unreadOnly) {
        query = query.eq('is_read', false)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data: notifications, error } = await query

      if (error) {
        console.error('❌ Error getting user notifications:', error)
        return []
      }

      return notifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        userId: notification.user_id,
        companyId: notification.company_id,
        isRead: notification.is_read,
        priority: notification.priority,
        actionUrl: notification.action_url,
        createdAt: notification.created_at,
        updatedAt: notification.updated_at
      }))
    } catch (error) {
      console.error('❌ Error getting user notifications:', error)
      return []
    }
  }

  async markNotificationsAsRead(notificationIds: string[]): Promise<number> {
    try {
      const { data, error } = await supabaseAdmin
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .in('id', notificationIds)
        .select()

      if (error) {
        console.error('❌ Error marking notifications as read:', error)
        return 0
      }

      return data.length
    } catch (error) {
      console.error('❌ Error marking notifications as read:', error)
      return 0
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<number> {
    try {
      const { data, error } = await supabaseAdmin
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('is_read', false)
        .select()

      if (error) {
        console.error('❌ Error marking all notifications as read:', error)
        return 0
      }

      return data.length
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error)
      return 0
    }
  }

  // Analytics
  async getAnalytics(companyId: string): Promise<AnalyticsData> {
    try {
      // Get user count
      const { count: totalUsers } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      // Get active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const { count: activeUsers } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('last_login', thirtyDaysAgo)

      // Get analytics metrics
      const { data: analytics, error } = await supabaseAdmin
        .from('analytics')
        .select('metric_type, metric_value')
        .eq('company_id', companyId)

      if (error) {
        console.error('❌ Error getting analytics:', error)
      }

      // Calculate engagement and completion rates
      const engagementMetrics = analytics?.filter(a => a.metric_type === 'engagement') || []
      const completionMetrics = analytics?.filter(a => a.metric_type === 'completion') || []

      const avgEngagement = engagementMetrics.length > 0
        ? engagementMetrics.reduce((acc, m) => acc + m.metric_value, 0) / engagementMetrics.length
        : 75 // Default value

      const avgCompletion = completionMetrics.length > 0
        ? completionMetrics.reduce((acc, m) => acc + m.metric_value, 0) / completionMetrics.length
        : 68 // Default value

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        engagementScore: Math.round(avgEngagement),
        completionRate: Math.round(avgCompletion),
        companyId
      }
    } catch (error) {
      console.error('❌ Error getting analytics:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        engagementScore: 0,
        completionRate: 0,
        companyId
      }
    }
  }

  // Helper Methods
  private async updateCompanyUserCount(companyId: string): Promise<void> {
    try {
      const { count } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('is_active', true)

      await supabaseAdmin
        .from('companies')
        .update({
          current_users: count || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)
    } catch (error) {
      console.error('❌ Error updating company user count:', error)
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService() 