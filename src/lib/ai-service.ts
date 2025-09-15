import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export interface ModuleGenerationRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  industry?: string;
  learningObjectives?: string[];
  companyContext?: string;
}

export interface GeneratedModule {
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  sections: ModuleSection[];
  quiz: QuizQuestion[];
  resources: Resource[];
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'exercise';
  estimatedTime: number;
  activities?: ModuleActivity[];
}

export interface ModuleActivity {
  type: 'reflection' | 'scenario' | 'simulation' | 'drag-drop' | 'video-checkpoint' | 'diagram';
  title?: string;
  prompt?: string;
  description?: string;
  timeLimit?: number;
  instruction?: string;
  timestamp?: string;
  question?: string;
  correctAnswer?: string;
  explanation?: string;
  choices?: Array<{
    id: string;
    text: string;
    outcome: string;
  }>;
  correctChoice?: string;
  feedback?: string;
  steps?: Array<{
    step: number;
    action: string;
    feedback: string;
  }>;
  items?: Array<{
    id: string;
    text: string;
    category: string;
  }>;
  categories?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'document' | 'tool';
  url?: string;
  description: string;
}

export async function generateTrainingModule(request: ModuleGenerationRequest): Promise<GeneratedModule> {
  try {
    if (!openai || !process.env.OPENAI_API_KEY) {
      // Return demo module if OpenAI is not configured
      return generateDemoModule(request);
    }

    const prompt = createModulePrompt(request);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert instructional designer and corporate trainer. Create comprehensive, engaging training modules that are practical and actionable. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    const generatedModule = JSON.parse(content) as GeneratedModule;
    
    // Add IDs to sections, quiz questions, and resources
    generatedModule.sections = generatedModule.sections.map((section, index) => ({
      ...section,
      id: `section_${index + 1}`
    }));
    
    generatedModule.quiz = generatedModule.quiz.map((question, index) => ({
      ...question,
      id: `question_${index + 1}`
    }));
    
    generatedModule.resources = generatedModule.resources.map((resource, index) => ({
      ...resource,
      id: `resource_${index + 1}`
    }));

    return generatedModule;

  } catch (error) {
    console.error('AI module generation error:', error);
    // Fallback to demo module
    return generateDemoModule(request);
  }
}

function createModulePrompt(request: ModuleGenerationRequest): string {
  return `
You are an expert instructional designer creating a comprehensive, interactive training module. Generate REAL, professional content - NO placeholder text, NO generic examples, NO mock data.

SPECIFICATIONS:
- Topic: ${request.topic}
- Difficulty: ${request.difficulty} 
- Duration: ${request.duration} minutes
- Industry: ${request.industry || 'Cross-industry applicable'}
- Company Context: ${request.companyContext || 'Modern workplace environment'}
- Learning Objectives: ${request.learningObjectives?.join(', ') || 'Practical skill development and knowledge application'}

REQUIREMENTS FOR POWERFUL MODULES:
1. **Industry-Specific Content**: Tailor examples, scenarios, and case studies to the specified industry
2. **Interactive Activities**: Include diverse activity types (scenarios, simulations, drag-drop, quizzes, reflections)
3. **Real-World Application**: Provide concrete, actionable strategies and tools
4. **Engagement Variety**: Mix text, interactive exercises, video checkpoints, and assessments
5. **Progressive Difficulty**: Build complexity throughout the module
6. **Measurable Outcomes**: Clear success criteria and practical takeaways

ACTIVITY TYPES TO INCLUDE:
- Scenario-based decision making
- Interactive simulations  
- Drag-and-drop exercises
- Knowledge checks and quizzes
- Reflection prompts
- Video checkpoint discussions
- Diagram interactions
- Case study analysis
- Role-playing exercises
- Problem-solving challenges

Generate a complete training module in JSON format with this structure:

{
  "title": "Engaging module title",
  "description": "Clear description of what learners will gain",
  "duration": ${request.duration},
  "difficulty": "${request.difficulty}",
  "sections": [
    {
      "title": "Section title",
      "content": "Detailed content for this section (use markdown formatting)",
      "type": "text|video|interactive|exercise",
      "estimatedTime": 10
    }
  ],
  "quiz": [
    {
      "question": "Question text",
      "type": "multiple_choice|true_false|short_answer",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "type": "article|video|document|tool",
      "url": "https://example.com",
      "description": "Brief description of the resource"
    }
  ]
}

ENHANCED REQUIREMENTS:
- Create 3-4 sections with diverse activity types (reflection, scenario, simulation, drag-drop, video-checkpoint)
- Each section must include specific "activities" array with interactive elements
- Include industry-specific examples, case studies, and real workplace scenarios  
- Generate 3-5 quiz questions testing practical application, not just memorization
- Provide 3 high-quality resources with REAL URLs (not example.com)
- Content must be immediately actionable and valuable
- Use professional language appropriate for ${request.difficulty} level
- Tailor ALL content to ${request.industry || 'cross-industry'} context
- NO placeholder text, NO generic examples, NO mock data
- Each activity must be fully specified with all required fields
- Focus on skills learners can apply immediately in their work

Return ONLY valid JSON matching the exact structure above. No additional text.
`;
}

function generateDemoModule(request: ModuleGenerationRequest): GeneratedModule {
  // Generate more realistic content based on topic and context
  const topicData = getTopicSpecificContent(request.topic, request.industry, request.difficulty);
  
  return {
    title: topicData.title,
    description: topicData.description,
    duration: request.duration,
    difficulty: request.difficulty,
    sections: [
      {
        id: 'section_1',
        title: 'Introduction and Overview',
        content: `# Welcome to ${request.topic} Training\n\nIn this module, you'll learn the fundamentals of ${request.topic} and how to apply these concepts in your daily work.\n\n## Learning Objectives\n- Understand core concepts\n- Apply best practices\n- Identify common challenges\n- Develop practical skills`,
        type: 'text',
        estimatedTime: Math.floor(request.duration * 0.2)
      },
      {
        id: 'section_2',
        title: 'Core Concepts',
        content: `# Core Concepts of ${request.topic}\n\nLet's dive into the fundamental principles that form the foundation of ${request.topic}.\n\n## Key Principles\n1. **Principle 1**: Understanding the basics\n2. **Principle 2**: Building on fundamentals\n3. **Principle 3**: Advanced applications\n\n### Real-World Examples\nHere are some practical examples of how these concepts apply in real business situations...`,
        type: 'text',
        estimatedTime: Math.floor(request.duration * 0.4)
      },
      {
        id: 'section_3',
        title: 'Practical Application',
        content: `# Putting It Into Practice\n\nNow that you understand the core concepts, let's explore how to apply them effectively.\n\n## Step-by-Step Process\n1. Assess your current situation\n2. Identify opportunities for improvement\n3. Implement best practices\n4. Monitor and adjust\n\n### Interactive Exercise\nTake a moment to think about your own work environment and identify where you can apply these concepts.`,
        type: 'interactive',
        estimatedTime: Math.floor(request.duration * 0.3)
      },
      {
        id: 'section_4',
        title: 'Summary and Next Steps',
        content: `# Module Summary\n\nCongratulations! You've completed the ${request.topic} training module.\n\n## Key Takeaways\n- You now understand the core concepts\n- You have practical tools to apply\n- You know how to identify opportunities\n\n## Next Steps\n1. Apply what you've learned in your daily work\n2. Share knowledge with your team\n3. Continue learning with additional resources`,
        type: 'text',
        estimatedTime: Math.floor(request.duration * 0.1)
      }
    ],
    quiz: [
      {
        id: 'question_1',
        question: `What is the most important aspect of ${request.topic}?`,
        type: 'multiple_choice',
        options: [
          'Understanding the fundamentals',
          'Memorizing all details',
          'Following rules strictly',
          'Avoiding any changes'
        ],
        correctAnswer: 0,
        explanation: 'Understanding the fundamentals provides the foundation for all other learning and application.'
      },
      {
        id: 'question_2',
        question: `True or False: ${request.topic} principles can be applied in various business contexts.`,
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'These principles are designed to be flexible and applicable across different business contexts.'
      },
      {
        id: 'question_3',
        question: `What is the first step in applying ${request.topic} concepts?`,
        type: 'multiple_choice',
        options: [
          'Assess your current situation',
          'Implement immediately',
          'Ask for permission',
          'Wait for instructions'
        ],
        correctAnswer: 0,
        explanation: 'Assessment helps you understand where you are and what needs to be improved.'
      }
    ],
    resources: [
      {
        id: 'resource_1',
        title: `Advanced ${request.topic} Guide`,
        type: 'article',
        url: 'https://example.com/advanced-guide',
        description: 'A comprehensive guide covering advanced concepts and techniques.'
      },
      {
        id: 'resource_2',
        title: `${request.topic} Best Practices Video`,
        type: 'video',
        url: 'https://example.com/best-practices-video',
        description: 'Video tutorial demonstrating real-world best practices and case studies.'
      },
      {
        id: 'resource_3',
        title: `${request.topic} Assessment Tool`,
        type: 'tool',
        url: 'https://example.com/assessment-tool',
        description: 'Interactive tool to assess your current knowledge and identify areas for improvement.'
      }
    ]
  };
}

export async function saveGeneratedModule(
  module: GeneratedModule,
  companyId: string,
  createdBy: string
): Promise<string> {
  try {
    const { supabase } = await import('./supabase');
    
    const { data, error } = await supabase
      .from('training_modules')
      .insert({
        title: module.title,
        description: module.description,
        content: module,
        company_id: companyId,
        created_by: createdBy,
        status: 'draft',
        difficulty: module.difficulty,
        estimated_duration: module.duration
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error saving module:', error);
    throw error;
  }
}
