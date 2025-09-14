import { NextRequest, NextResponse } from 'next/server';
import { generateTrainingModule, saveGeneratedModule, ModuleGenerationRequest } from '@/lib/ai-service';
import { extractUserFromRequest, trackActivity } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, difficulty, duration, industry, learningObjectives, companyContext, saveModule } = body;

    // Validate required fields
    if (!topic || !difficulty || !duration) {
      return NextResponse.json(
        { error: 'Topic, difficulty, and duration are required' },
        { status: 400 }
      );
    }

    // Validate difficulty level
    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Difficulty must be beginner, intermediate, or advanced' },
        { status: 400 }
      );
    }

    // Validate duration
    if (duration < 5 || duration > 180) {
      return NextResponse.json(
        { error: 'Duration must be between 5 and 180 minutes' },
        { status: 400 }
      );
    }

    const moduleRequest: ModuleGenerationRequest = {
      topic: topic.trim(),
      difficulty,
      duration: parseInt(duration),
      industry: industry?.trim(),
      learningObjectives: learningObjectives?.filter((obj: string) => obj.trim()) || [],
      companyContext: companyContext?.trim()
    };

    // Generate the module
    const generatedModule = await generateTrainingModule(moduleRequest);

    let moduleId: string | null = null;

    // Save module if requested and user is authenticated
    if (saveModule) {
      const user = extractUserFromRequest(request);
      if (user) {
        try {
          moduleId = await saveGeneratedModule(generatedModule, user.company_id, user.id);
          
          // Track activity
          await trackActivity(
            user.id,
            user.company_id,
            'module_created',
            `Created AI-generated module: ${generatedModule.title}`,
            { topic, difficulty, duration }
          );
        } catch (saveError) {
          console.error('Failed to save module:', saveError);
          // Don't fail the request if saving fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      module: generatedModule,
      moduleId,
      message: 'Training module generated successfully'
    });

  } catch (error) {
    console.error('AI module generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate training module' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Module Generator API is working',
    timestamp: new Date().toISOString(),
    supportedDifficulties: ['beginner', 'intermediate', 'advanced'],
    durationRange: { min: 5, max: 180 }
  });
}
