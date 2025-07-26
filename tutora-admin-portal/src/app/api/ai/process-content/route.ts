import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI (only if API key is available)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Model configuration with fallback priority
const MODEL_CONFIGS = [
  {
    name: "gpt-4o-mini",
    model: "gpt-4o-mini",
    inputCost: 0.15,
    outputCost: 0.60,
    maxTokens: 2048,
    priority: 1,
    description: "Most cost-effective option"
  },
  {
    name: "gpt-4o",
    model: "gpt-4o",
    inputCost: 2.50,
    outputCost: 10.00,
    maxTokens: 2048,
    priority: 2,
    description: "High performance fallback"
  }
]

const SYSTEM_PROMPT = `You are an expert instructional designer and training specialist. Create comprehensive, engaging training modules from the provided content.

Your response must be a valid JSON object with this exact structure:
{
  "title": "Module Title",
  "description": "Brief description of what learners will achieve",
  "content": "Main learning content with clear sections and explanations",
  "duration": 15,
  "difficulty": "intermediate",
  "learningObjectives": ["Objective 1", "Objective 2", "Objective 3"],
  "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"],
  "quiz": {
    "questions": [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Why this is correct"
      }
    ]
  }
}

Guidelines:
- Create 3-5 quiz questions that test understanding, not memorization
- Include practical examples and real-world applications
- Structure content with clear headings and bullet points
- Ensure content is engaging and actionable
- Duration should be realistic (10-30 minutes)
- Difficulty should match the content complexity
- ONLY return valid JSON, no additional text or markdown`

export async function POST(request: NextRequest) {
  console.log('🚀 AI Processing API called')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('fileType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('📁 File received:', file.name, 'Type:', fileType, 'Size:', file.size)

    // Test OpenAI connection first
    console.log('🔍 Testing OpenAI connection...')
    const testResult = await testOpenAIConnection()
    if (!testResult.success) {
      console.error('❌ OpenAI connection failed:', testResult.error)
      return NextResponse.json({ 
        error: `OpenAI connection failed: ${testResult.error}` 
      }, { status: 500 })
    }
    console.log('✅ OpenAI connection successful')

    // Process file content
    console.log('📄 Processing file content...')
    let processedContent = ''
    
    if (fileType === 'video') {
      console.log('🎥 Processing video file...')
      processedContent = await processVideoFile(file)
    } else if (fileType === 'document') {
      console.log('📋 Processing document file...')
      processedContent = await processDocumentFile(file)
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    console.log('📊 Content processed, length:', processedContent.length)
    console.log('📋 First 200 characters of content:', processedContent.substring(0, 200))

    if (!processedContent || processedContent.length < 50) {
      return NextResponse.json({ 
        error: 'Insufficient content extracted from file. Please ensure your file contains readable text.' 
      }, { status: 400 })
    }

    // Generate training module with fallback system
    console.log('🤖 Generating training module with AI...')
    const moduleResult = await generateTrainingModule(processedContent)
    
    if (!moduleResult.success) {
      console.error('❌ Module generation failed:', moduleResult.error)
      return NextResponse.json({ 
        error: `Failed to generate training module: ${moduleResult.error}` 
      }, { status: 500 })
    }

    console.log('✅ Training module generated successfully')
    return NextResponse.json({
      success: true,
      module: moduleResult.module,
      modelUsed: moduleResult.modelUsed,
      processingTime: moduleResult.processingTime
    })

  } catch (error: any) {
    console.error('💥 Unexpected error in AI processing:', error)
    return NextResponse.json({ 
      error: 'Internal server error during processing' 
    }, { status: 500 })
  }
}

async function testOpenAIConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔑 Testing OpenAI API key...')
    
    if (!process.env.OPENAI_API_KEY || !openai) {
      return { success: false, error: 'OpenAI API key not found in environment variables' }
    }

    // Test with a simple completion
    const testCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5
    })

    if (testCompletion.choices && testCompletion.choices.length > 0) {
      console.log('✅ OpenAI API key is valid and working')
      return { success: true }
    } else {
      return { success: false, error: 'Invalid response from OpenAI API' }
    }
  } catch (error: any) {
    console.error('❌ OpenAI connection test failed:', error)
    return { 
      success: false, 
      error: error.message || 'Unknown connection error' 
    }
  }
}

async function generateTrainingModule(content: string): Promise<{
  success: boolean;
  module?: any;
  modelUsed?: string;
  processingTime?: number;
  error?: string;
}> {
  if (!openai) {
    return {
      success: false,
      error: 'OpenAI service not available. Please configure OPENAI_API_KEY.'
    }
  }

  const startTime = Date.now()
  
  // Try each model in priority order
  for (const config of MODEL_CONFIGS) {
    console.log(`🎯 Trying model: ${config.name} (Priority: ${config.priority})`)
    
    try {
      const completion = await openai.chat.completions.create({
        model: config.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { 
            role: "user", 
            content: `Create a comprehensive training module based SPECIFICALLY on this uploaded content. Use the actual topics, concepts, and details from this content:\n\n${content.substring(0, 4000)}\n\nIMPORTANT: The training module title, description, content, and quiz questions must all be directly related to the topics covered in the above text. Do not use generic examples - use the specific subject matter provided.`
          }
        ],
        temperature: 0.7,
        max_tokens: config.maxTokens,
      })

      const responseContent = completion.choices[0]?.message?.content
      if (!responseContent) {
        console.log(`❌ No response from ${config.name}, trying next model...`)
        continue
      }

      console.log(`✅ Response received from ${config.name}`)
      
      // Parse JSON response
      let moduleData
      try {
        moduleData = JSON.parse(responseContent)
      } catch (parseError) {
        console.log(`❌ JSON parse error from ${config.name}, trying next model...`)
        continue
      }

      // Validate required fields
      if (!moduleData.title || !moduleData.content || !moduleData.quiz) {
        console.log(`❌ Invalid module structure from ${config.name}, trying next model...`)
        continue
      }

      const processingTime = Date.now() - startTime
      console.log(`🎉 Training module generated successfully with ${config.name} in ${processingTime}ms`)
      
      return {
        success: true,
        module: moduleData,
        modelUsed: config.name,
        processingTime
      }

    } catch (error: any) {
      console.log(`❌ Error with ${config.name}:`, error.message)
      
      // Check for specific error types
      if (error.status === 429) {
        console.log(`⚠️ Rate limit/quota exceeded for ${config.name}, trying next model...`)
        continue
      } else if (error.status === 404) {
        console.log(`⚠️ Model ${config.name} not found, trying next model...`)
        continue
      } else if (error.status === 401) {
        console.log(`⚠️ Authentication error for ${config.name}, trying next model...`)
        continue
      } else {
        console.log(`⚠️ Unexpected error with ${config.name}, trying next model...`)
        continue
      }
    }
  }

  // If all models failed
  return {
    success: false,
    error: 'All AI models failed to generate content. Please check your OpenAI account and try again.'
  }
}

async function processVideoFile(file: File): Promise<string> {
  console.log('🎬 Processing video file for transcription...')
  
  if (!openai) {
    throw new Error('OpenAI service not available. Please configure OPENAI_API_KEY.')
  }

  try {
    // Check file size (Whisper has a 25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      throw new Error(`Video file too large (${Math.round(file.size / (1024 * 1024))}MB). Please use a file smaller than 25MB.`)
    }

    console.log('🎤 Transcribing video with Whisper...')
    
    // Create a File object that OpenAI can process directly
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "text",
      language: "en"
    })

    console.log('✅ Video transcription completed')
    return transcription || ''
  } catch (error: any) {
    console.error('❌ Video transcription failed:', error)
    throw new Error(`Video transcription failed: ${error.message}`)
  }
}

async function processDocumentFile(file: File): Promise<string> {
  console.log('📄 Processing document file...')
  
  try {
    const text = await file.text()
    console.log('✅ Document text extracted')
    
    if (!text || text.length < 10) {
      throw new Error('Document appears to be empty or unreadable')
    }
    
    return text
  } catch (error: any) {
    console.error('❌ Document processing failed:', error)
    throw new Error(`Document processing failed: ${error.message}`)
  }
} 