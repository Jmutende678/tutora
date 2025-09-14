import { NextRequest, NextResponse } from 'next/server'

interface ActivityEvent {
  id: string
  type: string
  user_email?: string
  user_name?: string
  company?: string
  phone?: string
  inquiry_type?: string
  subject?: string
  message?: string
  lead_score?: {
    score: number
    category: 'hot' | 'warm' | 'cold'
    reasons: string[]
  }
  timestamp: string
  source: string
  metadata: any
}

export async function POST(request: NextRequest) {
  try {
    const { leads } = await request.json()
    
    if (!leads || !Array.isArray(leads)) {
      return NextResponse.json(
        { success: false, error: 'Invalid leads data' },
        { status: 400 }
      )
    }
    
    const insights = await Promise.all(
      leads.map(async (lead: ActivityEvent) => {
        try {
          // Generate AI analysis for each lead
          const aiAnalysis = await generateAIInsight(lead)
          
          return {
            lead,
            aiAnalysis
          }
        } catch (error) {
          console.error(`Failed to generate insight for lead ${lead.id}:`, error)
          
          // Fallback to rule-based analysis
          return {
            lead,
            aiAnalysis: generateFallbackInsight(lead)
          }
        }
      })
    )
    
    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Lead insights API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate lead insights'
    }, { status: 500 })
  }
}

async function generateAIInsight(lead: ActivityEvent) {
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  if (!openaiApiKey) {
    console.warn('OpenAI API key not configured, using fallback analysis')
    return generateFallbackInsight(lead)
  }
  
  try {
    const prompt = `
Analyze this lead and provide insights:

Lead Information:
- Name: ${lead.user_name}
- Company: ${lead.company}
- Email: ${lead.user_email}
- Phone: ${lead.phone || 'Not provided'}
- Inquiry Type: ${lead.inquiry_type}
- Subject: ${lead.subject}
- Message: ${lead.message}
- Lead Score: ${lead.lead_score?.score}/100 (${lead.lead_score?.category})
- Scoring Reasons: ${lead.lead_score?.reasons?.join(', ')}

Please provide:
1. A brief summary of this lead's potential
2. Urgency level (high/medium/low) and why
3. Estimated deal value in USD
4. A professional, personalized email response
5. 3 specific next steps

Respond in JSON format:
{
  "urgency": "high|medium|low",
  "summary": "Brief analysis of lead potential",
  "recommendedResponse": "Professional email response",
  "nextSteps": ["step1", "step2", "step3"],
  "estimatedValue": number
}
`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales analyst for Tutora, an AI-powered employee training platform. Analyze leads and provide actionable insights for the sales team.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }
    
    // Parse JSON response
    const analysisMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!analysisMatch) {
      throw new Error('Invalid JSON response from OpenAI')
    }
    
    const analysis = JSON.parse(analysisMatch[0])
    
    return {
      urgency: analysis.urgency || 'medium',
      summary: analysis.summary || 'Lead analysis generated',
      recommendedResponse: analysis.recommendedResponse || generateFallbackResponse(lead),
      nextSteps: analysis.nextSteps || generateFallbackNextSteps(lead),
      estimatedValue: analysis.estimatedValue || estimateValue(lead)
    }
    
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateFallbackInsight(lead)
  }
}

function generateFallbackInsight(lead: ActivityEvent) {
  const urgency = lead.lead_score?.category === 'hot' ? 'high' : 
                  lead.lead_score?.category === 'warm' ? 'medium' : 'low'
  
  const summary = `${lead.lead_score?.category?.toUpperCase()} lead from ${lead.company}. ${
    lead.inquiry_type === 'demo' ? 'Requested product demo - high intent.' :
    lead.inquiry_type === 'sales' ? 'Sales inquiry - ready to discuss pricing.' :
    lead.inquiry_type === 'support' ? 'Support inquiry - existing interest.' :
    'General inquiry - needs nurturing.'
  }`
  
  return {
    urgency,
    summary,
    recommendedResponse: generateFallbackResponse(lead),
    nextSteps: generateFallbackNextSteps(lead),
    estimatedValue: estimateValue(lead)
  }
}

function generateFallbackResponse(lead: ActivityEvent) {
  const name = lead.user_name || 'there'
  
  return `Hi ${name},

Thank you for reaching out to Tutora! I'm excited to learn more about ${lead.company}'s training needs.

${lead.inquiry_type === 'demo' 
  ? `I'd be happy to schedule a personalized demo to show you how our AI-powered platform can transform your employee training. Based on your message, it sounds like you're looking for ${lead.message?.includes('SCORM') ? 'SCORM compliance and ' : ''}${lead.message?.includes('SSO') ? 'SSO integration, ' : ''}enterprise-grade features.`
  : lead.inquiry_type === 'sales'
  ? `I'd love to discuss how Tutora can help ${lead.company} scale your training programs efficiently. Our AI-powered platform has helped companies reduce training costs by up to 60% while improving engagement rates.`
  : `I'd be happy to answer any questions about our AI-powered training platform and how it might benefit ${lead.company}.`
}

${lead.phone 
  ? `I'll give you a call at ${lead.phone} to discuss your specific needs, or feel free to reply with a time that works best for you.`
  : `Would you be available for a brief 15-minute call this week to discuss your specific needs? Please let me know a time that works for you.`
}

Looking forward to helping ${lead.company} revolutionize your employee training!

Best regards,
The Tutora Sales Team
hello@tutoralearn.com
${lead.phone ? `Direct: ${lead.phone}` : '+1 (555) 123-4567'}`
}

function generateFallbackNextSteps(lead: ActivityEvent) {
  const baseSteps = [
    `Send personalized follow-up email to ${lead.user_email}`,
    `Research ${lead.company} to understand their industry and training needs`
  ]
  
  if (lead.phone) {
    baseSteps.push(`Schedule phone call with ${lead.user_name} within 24 hours`)
  } else {
    baseSteps.push(`Request phone number for direct follow-up`)
  }
  
  if (lead.inquiry_type === 'demo') {
    baseSteps.push('Prepare customized demo focusing on enterprise features')
  } else if (lead.inquiry_type === 'sales') {
    baseSteps.push('Prepare pricing proposal based on estimated team size')
  } else {
    baseSteps.push('Send educational content about AI-powered training benefits')
  }
  
  return baseSteps.slice(0, 3)
}

function estimateValue(lead: ActivityEvent) {
  let baseValue = 5000 // Base annual value
  
  // Company size indicators
  if (lead.company?.toLowerCase().includes('enterprise') || 
      lead.company?.toLowerCase().includes('corp')) {
    baseValue *= 3
  }
  
  // Message analysis for team size
  if (lead.message) {
    const teamSizeMatch = lead.message.match(/(\d+)\s*(?:employees?|users?|team|people)/i)
    if (teamSizeMatch) {
      const teamSize = parseInt(teamSizeMatch[1])
      baseValue = Math.max(baseValue, teamSize * 100) // $100 per user annually
    }
  }
  
  // Inquiry type multiplier
  switch (lead.inquiry_type) {
    case 'demo':
      baseValue *= 1.5
      break
    case 'sales':
      baseValue *= 1.3
      break
    case 'support':
      baseValue *= 0.8
      break
    default:
      baseValue *= 1.0
  }
  
  // Lead score multiplier
  if (lead.lead_score) {
    baseValue *= (lead.lead_score.score / 100)
  }
  
  return Math.round(baseValue)
}
