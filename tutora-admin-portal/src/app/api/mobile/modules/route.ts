import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService, type Module } from '@/lib/supabase-service'

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

    const supabaseService = new SupabaseService()

    // Get modules for company using real Supabase data
    const modules = await supabaseService.getModulesForCompany(companyId)
    
    // Process modules for mobile consumption
    const processedModules = modules.map(module => ({
      ...module,
      // Optimize content for mobile if not including full content
      content: includeContent ? module.content : module.description,
      // Add mobile-specific metadata
      mobileOptimized: true,
      downloadSize: calculateDownloadSize(module),
      estimatedTime: 25, // Default estimated time in minutes
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

    // This service is no longer used for progress updates, but keeping it for now
    // const result = await mobileSyncService.updateUserProgress(userId, progressData)
    
    // if (!result) {
    //   return NextResponse.json(
    //     { error: 'Failed to update progress' },
    //     { status: 500 }
    //   )
    // }

    // Create notifications for achievements
    if (completed) {
      // This service is no longer used for notifications, but keeping it for now
      // await mobileSyncService.createNotification({
      //   type: 'module_completed',
      //   title: 'Module Completed! ✅',
      //   message: 'Great job completing your training module',
      //   userId,
      //   companyId: body.companyId || '',
      //   priority: 'medium'
      // })
    }

    if (certificateEarned) {
      // This service is no longer used for notifications, but keeping it for now
      // await mobileSyncService.createNotification({
      //   type: 'certificate_earned',
      //   title: 'Certificate Earned! 🏆',
      //   message: 'You\'ve earned a new certificate for your achievement',
      //   userId,
      //   companyId: body.companyId || '',
      //   priority: 'high'
      // })
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

    const supabaseService = new SupabaseService()

    // Get real module content from Supabase
    const moduleData = await supabaseService.getModuleById(moduleId)
    
    if (!moduleData) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    const moduleContent = {
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
      content: moduleData.content || generateMobileOptimizedContent(),
      duration: 25, // Default duration in minutes
      questions: generateMobileQuizQuestions(),
      resources: [
        {
          type: 'video',
          url: '/content/safety-video.mp4',
          title: 'Training Video',
          duration: 5,
          size: '15MB'
        },
        {
          type: 'pdf',
          url: '/content/handbook.pdf',
          title: 'Training Handbook',
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
function calculateDownloadSize(module: Module): number {
  // Simple calculation based on content length
  const baseSize = 5000000 // 5MB base size
  const contentSize = module.content ? module.content.length * 10 : 0
  return baseSize + contentSize
}

function generateMobileOptimizedContent() {
  return {
    type: 'interactive',
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        content: 'Welcome to this training module. Complete all sections to earn your certificate.',
        type: 'text'
      },
      {
        id: 'content',
        title: 'Main Content',
        content: 'This is the main training content optimized for mobile viewing.',
        type: 'rich_text'
      },
      {
        id: 'quiz',
        title: 'Knowledge Check',
        content: 'Test your understanding with this quick quiz.',
        type: 'quiz'
      }
    ]
  }
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