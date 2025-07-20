import { NextRequest, NextResponse } from 'next/server'
import { firebaseAdminService, type Module } from '@/lib/firebase-admin'
import { mobileSyncService } from '@/lib/mobile-sync'

// GET /api/mobile/modules - Get modules for mobile app consumption
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const companyId = url.searchParams.get('companyId')
    const includeContent = url.searchParams.get('includeContent') === 'true'
    const assignedOnly = url.searchParams.get('assignedOnly') === 'true'
    const downloadable = url.searchParams.get('downloadable') === 'true'

    if (!userId || !companyId) {
      return NextResponse.json(
        { error: 'userId and companyId are required' },
        { status: 400 }
      )
    }

    // Get modules for company
    const modules = await firebaseAdminService.getModulesForCompany(companyId)
    
    // If no modules found, return demo modules
    if (modules.length === 0) {
      const demoModules = generateDemoModules(companyId, includeContent)
      return NextResponse.json({
        success: true,
        modules: demoModules,
        total: demoModules.length,
        timestamp: new Date().toISOString()
      })
    }

    // Process modules for mobile consumption
    const processedModules = modules.map(module => ({
      ...module,
      // Optimize content for mobile if not including full content
      content: includeContent ? module.content : module.description,
      // Add mobile-specific metadata
      mobileOptimized: true,
      downloadSize: calculateDownloadSize(module),
      estimatedTime: module.duration,
      offlineAvailable: true,
      lastSynced: new Date().toISOString()
    }))

    return NextResponse.json({
      success: true,
      modules: processedModules,
      total: processedModules.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting mobile modules:', error)
    return NextResponse.json(
      { error: 'Failed to get modules' },
      { status: 500 }
    )
  }
}

// POST /api/mobile/modules/progress - Update module progress from mobile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      moduleId, 
      progress, 
      timeSpent, 
      completed, 
      quizAnswers,
      score,
      certificateEarned 
    } = body

    if (!userId || !moduleId) {
      return NextResponse.json(
        { error: 'userId and moduleId are required' },
        { status: 400 }
      )
    }

    // Update user progress
    const progressData = {
      moduleId,
      timeSpent,
      completed,
      quizScore: score
    }

    const result = await mobileSyncService.updateUserProgress(userId, progressData)
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    // Create notifications for achievements
    if (completed) {
      await mobileSyncService.createNotification({
        type: 'module_completed',
        title: 'Module Completed! ✅',
        message: 'Great job completing your training module',
        userId,
        companyId: body.companyId || '',
        priority: 'medium'
      })
    }

    if (certificateEarned) {
      await mobileSyncService.createNotification({
        type: 'certificate_earned',
        title: 'Certificate Earned! 🏆',
        message: 'You\'ve earned a new certificate for your achievement',
        userId,
        companyId: body.companyId || '',
        priority: 'high'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      achievements: {
        moduleCompleted: completed,
        certificateEarned: certificateEarned || false,
        pointsEarned: score || 0
      }
    })

  } catch (error) {
    console.error('❌ Error updating mobile module progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

// GET /api/mobile/modules/[id]/content - Get specific module content for offline download
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const moduleId = url.pathname.split('/').pop()
    const userId = url.searchParams.get('userId')

    if (!moduleId || !userId) {
      return NextResponse.json(
        { error: 'moduleId and userId are required' },
        { status: 400 }
      )
    }

    // TODO: Get module content from Firebase
    // For now, return demo content
    const moduleContent = {
      id: moduleId,
      title: 'Workplace Safety Fundamentals',
      description: 'Essential safety protocols for the modern workplace',
      content: generateMobileOptimizedContent(),
      duration: 25,
      questions: generateMobileQuizQuestions(),
      resources: [
        {
          type: 'video',
          url: '/content/safety-video.mp4',
          title: 'Safety Overview Video',
          duration: 5,
          size: '15MB'
        },
        {
          type: 'pdf',
          url: '/content/safety-handbook.pdf',
          title: 'Safety Handbook',
          size: '2MB'
        }
      ],
      offlinePackage: {
        url: '/offline/module-' + moduleId + '.zip',
        size: '25MB',
        lastUpdated: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      module: moduleContent,
      downloadable: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting mobile module content:', error)
    return NextResponse.json(
      { error: 'Failed to get module content' },
      { status: 500 }
    )
  }
}

// Helper functions
function generateDemoModules(companyId: string, includeContent: boolean = false) {
  return [
    {
      id: 'module_001',
      companyId,
      title: 'Workplace Safety Fundamentals',
      description: 'Essential safety protocols and emergency procedures for the modern workplace.',
      content: includeContent ? generateMobileOptimizedContent() : '',
      type: 'interactive' as const,
      duration: 25,
      difficulty: 'beginner' as const,
      tags: ['safety', 'workplace', 'emergency'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      isPublished: true,
      order: 1,
      prerequisites: [],
      resources: [
        {
          type: 'video',
          url: '/content/safety-overview.mp4',
          title: 'Safety Overview',
          size: 15000000
        }
      ],
      analytics: {
        totalViews: 245,
        completionRate: 87,
        averageScore: 92,
        averageTime: 23,
        lastAccessed: new Date().toISOString()
      },
      mobileOptimized: true,
      downloadSize: 25000000,
      offlineAvailable: true
    },
    {
      id: 'module_002', 
      companyId,
      title: 'Customer Service Excellence',
      description: 'Master the art of exceptional customer service and build lasting relationships.',
      content: includeContent ? generateMobileOptimizedContent() : '',
      type: 'interactive' as const,
      duration: 35,
      difficulty: 'intermediate' as const,
      tags: ['customer-service', 'communication', 'excellence'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin_001',
      isPublished: true,
      order: 2,
      prerequisites: [],
      resources: [
        {
          type: 'video',
          url: '/content/customer-service.mp4',
          title: 'Customer Service Best Practices',
          size: 22000000
        }
      ],
      analytics: {
        totalViews: 189,
        completionRate: 94,
        averageScore: 88,
        averageTime: 32,
        lastAccessed: new Date().toISOString()
      },
      mobileOptimized: true,
      downloadSize: 32000000,
      offlineAvailable: true
    },
    {
      id: 'module_003',
      companyId,
      title: 'Digital Privacy & Security',
      description: 'Protect company data and maintain digital security best practices.',
      content: includeContent ? generateMobileOptimizedContent() : '',
      type: 'ai_generated' as const,
      duration: 20,
      difficulty: 'beginner' as const,
      tags: ['security', 'privacy', 'digital', 'data-protection'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'ai_system',
      isPublished: true,
      order: 3,
      prerequisites: [],
      resources: [],
      analytics: {
        totalViews: 134,
        completionRate: 76,
        averageScore: 85,
        averageTime: 18,
        lastAccessed: new Date().toISOString()
      },
      aiMetadata: {
        sourceFile: 'security-policy.pdf',
        processingTime: 45,
        confidence: 95,
        generatedQuestions: 8
      },
      mobileOptimized: true,
      downloadSize: 18000000,
      offlineAvailable: true
    }
  ]
}

function generateMobileOptimizedContent(): string {
  return `
# Module Content (Mobile Optimized)

## Section 1: Introduction
Welcome to this training module. This content has been optimized for mobile consumption.

### Key Learning Objectives:
- ✅ Understand core concepts
- ✅ Apply practical skills  
- ✅ Pass the assessment

## Section 2: Core Content
[Interactive content would be displayed here with mobile-friendly formatting]

### Quick Quiz
Test your knowledge as you progress through the module.

## Section 3: Summary
Review the key points covered in this module.

**Note**: This is mobile-optimized content designed for easy reading on smaller screens.
  `
}

function generateMobileQuizQuestions() {
  return [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: 'What is the most important safety protocol?',
      options: ['Follow procedures', 'Work fast', 'Ignore warnings', 'Take shortcuts'],
      correctAnswer: 0,
      points: 10,
      explanation: 'Following established procedures ensures everyone stays safe.'
    },
    {
      id: 'q2',
      type: 'true_false',
      question: 'Emergency exits should always be kept clear.',
      correctAnswer: true,
      points: 5,
      explanation: 'Clear emergency exits are crucial for safe evacuation.'
    }
  ]
}

function calculateDownloadSize(module: Module): number {
  // Estimate download size based on content
  const baseSize = 5000000 // 5MB base
  const contentSize = (module.content?.length || 0) * 100
  const resourceSize = module.resources?.reduce((total: number, resource: any) => 
    total + (resource.size || 1000000), 0) || 0
  
  return baseSize + contentSize + resourceSize
} 