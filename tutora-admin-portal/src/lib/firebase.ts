import { initializeApp, getApps, App, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { nanoid } from 'nanoid'
// import { EmailService } from './email'

// Firebase Admin configuration with better error handling
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Initialize Firebase Admin with better error handling
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
      console.log('✅ Firebase initialized successfully')
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
    console.log('📝 To enable Firebase:')
    console.log('   1. Set FIREBASE_PROJECT_ID in .env.local')
    console.log('   2. Set FIREBASE_CLIENT_EMAIL in .env.local')
    console.log('   3. Set FIREBASE_PRIVATE_KEY in .env.local')
    app = null
    isFirebaseAvailable = false
  }
}

// Initialize Firebase
initializeFirebase()

export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null
export { isFirebaseAvailable }

export interface Company {
  id: string
  name: string
  email: string
  companyCode: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled'
  createdAt: Date
  updatedAt: Date
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
  }
  billing: {
    address?: string
    city?: string
    country?: string
    postalCode?: string
    taxId?: string
  }
}

export interface User {
  id: string
  companyId: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  lastLogin?: Date
  progress: {
    completedModules: number
    totalModules: number
    completedQuizzes: number
    totalQuizzes: number
    averageScore: number
    certificatesEarned: number
  }
  profile: {
    department?: string
    position?: string
    phone?: string
    avatar?: string
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
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  order: number
  prerequisites: string[]
  resources: {
    type: 'file' | 'link' | 'video'
    url: string
    title: string
  }[]
  analytics: {
    totalViews: number
    completionRate: number
    averageScore: number
    averageTime: number
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
  }[]
  timeLimit: number // in minutes
  passingScore: number
  attempts: number
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
}

export class FirebaseService {
  // private emailService: EmailService

  constructor() {
    // this.emailService = new EmailService()
  }

  // Simplified company creation for webhook
  async createCompany(companyData: Partial<Company>, planId: string): Promise<Company> {
    const companyCode = await this.generateCompanyCode()
    
    const company: Company = {
      id: nanoid(),
      name: companyData.name!,
      email: companyData.email!,
      companyCode,
      plan: planId as 'starter' | 'professional' | 'enterprise',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
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
      }
    }

    // Save to Firebase if available
    if (db) {
      try {
        await db.collection('companies').doc(company.id).set(company)
        console.log('Company saved to Firebase:', company.companyCode)
      } catch (error) {
        console.log('Failed to save to Firebase, running in development mode:', error)
      }
    } else {
      console.log('Firebase not available, running in development mode')
    }

    console.log('Company created:', company)
    return company
  }

  async generateCompanyCode(): Promise<string> {
    const prefix = 'TUT'
    const year = new Date().getFullYear()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}-${year}-${random}`
  }

  // Simplified methods for basic functionality
  private getMaxUsers(planId: string): number {
    switch (planId) {
      case 'basic': return 50
      case 'premium': return 200
      case 'enterprise': return 1000
      default: return 50
    }
  }

  private getMaxModules(planId: string): number {
    switch (planId) {
      case 'basic': return 10
      case 'premium': return 50
      case 'enterprise': return 200
      default: return 10
    }
  }

  // Mock methods for development
  async getCompanyByCode(companyCode: string): Promise<Company | null> {
    console.log('Getting company by code:', companyCode)
    return null
  }

  async getCompany(companyId: string): Promise<Company | null> {
    console.log('Getting company by ID:', companyId)
    return null
  }

  async getAllCompanies(): Promise<Company[]> {
    console.log('Getting all companies')
    return []
  }

  async getCompanyAnalytics(companyId: string) {
    console.log('Getting company analytics:', companyId)
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

export const firebaseService = new FirebaseService() 