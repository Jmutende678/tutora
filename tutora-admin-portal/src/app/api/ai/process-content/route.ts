import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    if (!processedContent || processedContent.length < 50) {
      return NextResponse.json({ 
        error: 'Insufficient content extracted from file' 
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

  } catch (error) {
    console.error('💥 Unexpected error in AI processing:', error)
    return NextResponse.json({ 
      error: 'Internal server error during processing' 
    }, { status: 500 })
  }
}

async function testOpenAIConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔑 Testing OpenAI API key...')
    
    if (!process.env.OPENAI_API_KEY) {
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
            content: `Analyze this content and create a professional training module with quiz questions:\n\n${content.substring(0, 4000)}`
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
  
  const buffer = await file.arrayBuffer()
  const tempFilePath = path.join('/tmp', `video_${Date.now()}_${file.name}`)
  
  try {
    await writeFile(tempFilePath, Buffer.from(buffer))
    console.log('📁 Video file saved temporarily')

    // For large files, we might need to chunk them
    const fileSize = buffer.byteLength
    const maxChunkSize = 25 * 1024 * 1024 // 25MB chunks
    
    if (fileSize > maxChunkSize) {
      console.log('📦 Large file detected, processing in chunks...')
      return await processVideoInChunks(tempFilePath, fileSize, maxChunkSize)
    } else {
      console.log('🎯 Processing single video file...')
      return await transcribeVideo(tempFilePath)
    }
  } finally {
    // Clean up temp file
    try {
      await unlink(tempFilePath)
      console.log('🧹 Temporary video file cleaned up')
    } catch (cleanupError) {
      console.log('⚠️ Failed to cleanup temp file:', cleanupError)
    }
  }
}

async function processVideoInChunks(filePath: string, fileSize: number, chunkSize: number): Promise<string> {
  console.log(`📦 Processing video in chunks: ${Math.ceil(fileSize / chunkSize)} chunks`)
  
  // For now, just process the first chunk to avoid quota issues
  // In production, you'd implement proper chunking
  return await transcribeVideo(filePath)
}

async function transcribeVideo(filePath: string): Promise<string> {
  try {
    console.log('🎤 Transcribing video with Whisper...')
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
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
  
  const text = await file.text()
  console.log('✅ Document text extracted')
  
  return text
} 