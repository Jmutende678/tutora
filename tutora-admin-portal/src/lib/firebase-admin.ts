import { initializeApp, getApps, App, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { nanoid } from 'nanoid'

// Production Firebase Admin configuration
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'tutora-production',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Initialize Firebase Admin with enhanced error handling
let app: App | null = null
let isFirebaseAvailable = false

function initializeFirebase() {
  // Check if all required environment variables are present
  const hasRequiredCredentials = 
    process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_PRIVATE_KEY && 
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')

  if (getApps().length === 0 && hasRequiredCredentials) {
    try {
      app = initializeApp({
        credential: cert(firebaseConfig),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
      isFirebaseAvailable = true
      console.log('✅ Firebase initialized successfully for production')
    } catch (error) {
      console.log('❌ Firebase initialization failed, running in development mode:', error)
      app = null
      isFirebaseAvailable = false
    }
  } else if (getApps().length > 0) {
    app = getApps()[0]
    isFirebaseAvailable = true
    console.log('✅ Firebase already initialized')
  } else {
    console.log('⚠️ Firebase credentials not configured, running in development mode')
    app = null
    isFirebaseAvailable = false
  }
}

// Initialize Firebase
initializeFirebase()

export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null
export { isFirebaseAvailable }

// Enhanced data models for production
export interface Company {
  id: string
  name: string
  email: string
  companyCode: string
  plan: 'basic' | 'growth' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled'
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
  maxUsers: number
  maxModules: number
  currentUsers: number
  currentModules: number
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  settings: {
    customBranding: boolean
    whiteLabel: boolean
    customDomain?: string
    logoUrl?: string
    primaryColor?: string
    secondaryColor?: string
  }
  adminUser: {
    name: string
    email: string
    phone?: string
    firebaseUid?: string
  }
  billing: {
    address?: string
    city?: string
    country?: string
    postalCode?: string
    taxId?: string
  }
  usage: {
    currentAIModules: number
    currentStorage: number
    lastResetDate: string
    monthlyActiveUsers: number
  }
}

export interface User {
  id: string
  companyId: string
  companyCode: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Timestamp | string
  lastLogin?: Timestamp | string
  firebaseUid?: string
  progress: {
    completedModules: number
    totalModules: number
    completedQuizzes: number
    totalQuizzes: number
    averageScore: number
    certificatesEarned: number
    totalTimeSpent: number // in minutes
  }
  profile: {
    department?: string
    position?: string
    phone?: string
    avatar?: string
    onboardingCompleted: boolean
  }
}

export interface Module {
  id: string
  companyId: string
  title: string
  description: string
  content: string
  type: 'text' | 'video' | 'interactive' | 'ai_generated'
  duration: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
  createdBy: string // user ID
  isPublished: boolean
  order: number
  prerequisites: string[]
  resources: {
    type: 'file' | 'link' | 'video'
    url: string
    title: string
    size?: number
  }[]
  analytics: {
    totalViews: number
    completionRate: number
    averageScore: number
    averageTime: number
    lastAccessed: Timestamp | string
  }
  aiMetadata?: {
    sourceFile: string
    processingTime: number
    confidence: number
    generatedQuestions: number
  }
}

export interface Quiz {
  id: string
  moduleId: string
  companyId: string
  title: string
  description: string
  questions: {
    id: string
    type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'
    question: string
    options?: string[]
    correctAnswer: string | number
    points: number
    explanation?: string
    difficulty: 'easy' | 'medium' | 'hard'
  }[]
  timeLimit: number // in minutes
  passingScore: number
  attempts: number
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
  isPublished: boolean
}

export interface SupportTicket {
  id: string
  type: 'technical' | 'billing' | 'feature_request' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  subject: string
  description: string
  userEmail: string
  userName: string
  companyCode?: string
  companyId?: string
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
  tags: string[]
  attachments: string[]
  assignedTo?: string
  internalNotes: {
    id: string
    note: string
    createdBy: string
    createdAt: Timestamp | string
  }[]
  responses: {
    id: string
    message: string
    isInternal: boolean
    createdBy: string
    createdAt: Timestamp | string
  }[]
}

// Production Firebase Service Class
export class FirebaseAdminService {
  constructor() {}

  // Company Management
  async createCompany(companyData: Partial<Company>, planId: string): Promise<Company> {
    const companyCode = await this.generateCompanyCode()
    
    const company: Company = {
      id: nanoid(),
      name: companyData.name!,
      email: companyData.email!,
      companyCode,
      plan: planId as 'basic' | 'growth' | 'enterprise',
      status: 'active',
      createdAt: isFirebaseAvailable ? Timestamp.now() : new Date().toISOString(),
      updatedAt: isFirebaseAvailable ? Timestamp.now() : new Date().toISOString(),
      maxUsers: this.getMaxUsers(planId),
      maxModules: this.getMaxModules(planId),
      currentUsers: 0,
      currentModules: 0,
      stripeCustomerId: companyData.stripeCustomerId,
      stripeSubscriptionId: companyData.stripeSubscriptionId,
      settings: {
        customBranding: planId !== 'basic',
        whiteLabel: planId === 'enterprise',
        primaryColor: '#2E9CFF',
        secondaryColor: '#64B5FF'
      },
      adminUser: {
        name: companyData.adminUser?.name || 'Admin',
        email: companyData.email!,
        phone: companyData.adminUser?.phone
      },
      billing: {
        address: companyData.billing?.address,
        city: companyData.billing?.city,
        country: companyData.billing?.country,
        postalCode: companyData.billing?.postalCode,
        taxId: companyData.billing?.taxId
      },
      usage: {
        currentAIModules: 0,
        currentStorage: 0,
        lastResetDate: new Date().toISOString(),
        monthlyActiveUsers: 0
      }
    }

    // Save to Firebase if available
    if (db) {
      try {
        await db.collection('companies').doc(company.id).set(company)
        console.log('✅ Company saved to Firebase:', company.companyCode)

        // Create admin user in Firebase Auth
        if (auth) {
          try {
            const userRecord = await auth.createUser({
              email: company.adminUser.email,
              displayName: company.adminUser.name,
              emailVerified: false
            })
            
            // Update company with Firebase UID
            company.adminUser.firebaseUid = userRecord.uid
            await db.collection('companies').doc(company.id).update({
              'adminUser.firebaseUid': userRecord.uid
            })

            // Create user document
            const adminUser: User = {
              id: nanoid(),
              companyId: company.id,
              companyCode: company.companyCode,
              email: company.adminUser.email,
              name: company.adminUser.name,
              role: 'admin',
              status: 'active',
              createdAt: Timestamp.now(),
              firebaseUid: userRecord.uid,
              progress: {
                completedModules: 0,
                totalModules: 0,
                completedQuizzes: 0,
                totalQuizzes: 0,
                averageScore: 0,
                certificatesEarned: 0,
                totalTimeSpent: 0
              },
              profile: {
                department: 'Administration',
                position: 'Administrator',
                phone: company.adminUser.phone,
                onboardingCompleted: false
              }
            }

            await db.collection('users').doc(adminUser.id).set(adminUser)
            console.log('✅ Admin user created in Firebase Auth and Firestore')
          } catch (authError) {
            console.log('⚠️ Failed to create Firebase Auth user:', authError)
          }
        }

      } catch (error) {
        console.log('❌ Failed to save to Firebase:', error)
        throw error
      }
    } else {
      console.log('⚠️ Firebase not available, company created in memory only')
    }

    return company
  }

  async getCompanyByCode(companyCode: string): Promise<Company | null> {
    if (!db) {
      console.log('⚠️ Firebase not available for company lookup')
      return null
    }

    try {
      const snapshot = await db.collection('companies')
        .where('companyCode', '==', companyCode)
        .limit(1)
        .get()

      if (snapshot.empty) {
        return null
      }

      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Company
    } catch (error) {
      console.error('❌ Error fetching company by code:', error)
      return null
    }
  }

  async getCompany(companyId: string): Promise<Company | null> {
    if (!db) return null

    try {
      const doc = await db.collection('companies').doc(companyId).get()
      if (!doc.exists) return null
      
      return { id: doc.id, ...doc.data() } as Company
    } catch (error) {
      console.error('❌ Error fetching company:', error)
      return null
    }
  }

  async getAllCompanies(): Promise<Company[]> {
    if (!db) return []

    try {
      const snapshot = await db.collection('companies').orderBy('createdAt', 'desc').get()
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company))
    } catch (error) {
      console.error('❌ Error fetching companies:', error)
      return []
    }
  }

  async updateCompanyUsage(companyId: string, usage: Partial<Company['usage']>): Promise<void> {
    if (!db) return

    try {
      await db.collection('companies').doc(companyId).update({
        usage,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('❌ Error updating company usage:', error)
    }
  }

  // User Management
  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      id: nanoid(),
      companyId: userData.companyId!,
      companyCode: userData.companyCode!,
      email: userData.email!,
      name: userData.name!,
      role: userData.role || 'user',
      status: 'active',
      createdAt: isFirebaseAvailable ? Timestamp.now() : new Date().toISOString(),
      progress: {
        completedModules: 0,
        totalModules: 0,
        completedQuizzes: 0,
        totalQuizzes: 0,
        averageScore: 0,
        certificatesEarned: 0,
        totalTimeSpent: 0
      },
      profile: {
        department: userData.profile?.department,
        position: userData.profile?.position,
        phone: userData.profile?.phone,
        onboardingCompleted: false
      }
    }

    if (db) {
      try {
        // Create Firebase Auth user
        if (auth) {
          const userRecord = await auth.createUser({
            email: user.email,
            displayName: user.name,
            emailVerified: false
          })
          user.firebaseUid = userRecord.uid
        }

        await db.collection('users').doc(user.id).set(user)
        
        // Update company user count
        await db.collection('companies').doc(user.companyId).update({
          currentUsers: FieldValue.increment(1),
          updatedAt: Timestamp.now()
        })

        console.log('✅ User created:', user.email)
      } catch (error) {
        console.error('❌ Error creating user:', error)
        throw error
      }
    }

    return user
  }

  async getUsersByCompany(companyId: string): Promise<User[]> {
    if (!db) return []

    try {
      const snapshot = await db.collection('users')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .get()

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User))
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      return []
    }
  }

  // Support Ticket Management
  async createSupportTicket(ticketData: Partial<SupportTicket>): Promise<SupportTicket> {
    const ticket: SupportTicket = {
      id: nanoid(),
      type: ticketData.type!,
      priority: ticketData.priority || 'medium',
      status: 'open',
      subject: ticketData.subject!,
      description: ticketData.description!,
      userEmail: ticketData.userEmail!,
      userName: ticketData.userName!,
      companyCode: ticketData.companyCode,
      companyId: ticketData.companyId,
      createdAt: isFirebaseAvailable ? Timestamp.now() : new Date().toISOString(),
      updatedAt: isFirebaseAvailable ? Timestamp.now() : new Date().toISOString(),
      tags: ticketData.tags || [],
      attachments: ticketData.attachments || [],
      internalNotes: [],
      responses: []
    }

    if (db) {
      try {
        await db.collection('support_tickets').doc(ticket.id).set(ticket)
        console.log('✅ Support ticket created:', ticket.id)
      } catch (error) {
        console.error('❌ Error creating support ticket:', error)
        throw error
      }
    }

    return ticket
  }

  async getSupportTickets(filters?: {
    status?: string
    priority?: string
    companyId?: string
    limit?: number
  }): Promise<SupportTicket[]> {
    if (!db) return []

    try {
      let query: any = db.collection('support_tickets')

      if (filters?.status) {
        query = query.where('status', '==', filters.status)
      }
      if (filters?.priority) {
        query = query.where('priority', '==', filters.priority)
      }
      if (filters?.companyId) {
        query = query.where('companyId', '==', filters.companyId)
      }

      query = query.orderBy('createdAt', 'desc')

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const snapshot = await query.get()
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as SupportTicket))
    } catch (error) {
      console.error('❌ Error fetching support tickets:', error)
      return []
    }
  }

  // Analytics
  async getCompanyAnalytics(companyId: string) {
    if (!db) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalModules: 0,
        completedModules: 0,
        userGrowth: 0,
        moduleCompletions: 0,
        averageScore: 0,
        certificatesIssued: 0
      }
    }

    try {
      const [usersSnapshot, modulesSnapshot] = await Promise.all([
        db.collection('users').where('companyId', '==', companyId).get(),
        db.collection('modules').where('companyId', '==', companyId).get()
      ])

      const users = usersSnapshot.docs.map(doc => doc.data() as User)
      const modules = modulesSnapshot.docs.map(doc => doc.data() as Module)

      const totalUsers = users.length
      const activeUsers = users.filter(user => {
        const lastLogin = user.lastLogin
        if (!lastLogin) return false
        const lastLoginDate = lastLogin instanceof Timestamp ? lastLogin.toDate() : new Date(lastLogin)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return lastLoginDate > thirtyDaysAgo
      }).length

      const totalModules = modules.filter(module => module.isPublished).length
      const completedModules = users.reduce((sum, user) => sum + user.progress.completedModules, 0)
      const averageScore = users.reduce((sum, user) => sum + user.progress.averageScore, 0) / totalUsers || 0
      const certificatesIssued = users.reduce((sum, user) => sum + user.progress.certificatesEarned, 0)

      return {
        totalUsers,
        activeUsers,
        totalModules,
        completedModules,
        userGrowth: 12.5, // Mock data - calculate from historical data
        moduleCompletions: completedModules,
        averageScore,
        certificatesIssued
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalModules: 0,
        completedModules: 0,
        userGrowth: 0,
        moduleCompletions: 0,
        averageScore: 0,
        certificatesIssued: 0
      }
    }
  }

  // Utility methods
  private async generateCompanyCode(): Promise<string> {
    const prefix = process.env.COMPANY_CODE_PREFIX || 'TUT'
    const year = new Date().getFullYear()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}-${year}-${random}`
  }

  private getMaxUsers(planId: string): number {
    switch (planId) {
      case 'basic': return 50
      case 'growth': return 200
      case 'enterprise': return -1 // unlimited
      default: return 50
    }
  }

  private getMaxModules(planId: string): number {
    switch (planId) {
      case 'basic': return 10
      case 'growth': return 50
      case 'enterprise': return -1 // unlimited
      default: return 10
    }
  }
}

export const firebaseAdminService = new FirebaseAdminService() 