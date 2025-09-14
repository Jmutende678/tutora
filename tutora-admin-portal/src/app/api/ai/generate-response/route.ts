import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { lead } = await request.json()
    
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead data required' },
        { status: 400 }
      )
    }
    
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openaiApiKey) {
      console.warn('OpenAI API key not configured, using fallback response')
      return NextResponse.json({
        success: true,
        response: generateFallbackResponse(lead),
        source: 'fallback'
      })
    }
    
    try {
      const prompt = `
Generate a personalized, professional email response for this sales lead:

Lead Details:
- Name: ${lead.user_name}
- Company: ${lead.company}
- Email: ${lead.user_email}
- Phone: ${lead.phone || 'Not provided'}
- Inquiry Type: ${lead.inquiry_type}
- Subject: ${lead.subject}
- Message: "${lead.message}"
- Lead Score: ${lead.lead_score?.score}/100 (${lead.lead_score?.category})

Context:
- Tutora is an AI-powered employee training platform
- We help companies create training modules from videos/documents in minutes
- Key features: AI module creation, SCORM compliance, SSO integration, analytics
- Target: Enterprise companies looking to scale training efficiently
- Value prop: Reduce training costs by 60%, increase engagement by 92%

Write a professional, personalized email that:
1. Acknowledges their specific inquiry
2. Addresses their pain points mentioned in the message
3. Highlights relevant Tutora benefits
4. Includes a clear call-to-action
5. Maintains a consultative, helpful tone
6. Is concise but comprehensive (3-4 paragraphs)

Email signature should be:
Best regards,
[Your Name]
Sales Team, Tutora
hello@tutoralearn.com
+1 (555) 123-4567

Only return the email content, no additional formatting or explanations.
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
              content: 'You are a professional sales representative for Tutora, an AI-powered employee training platform. Write personalized, consultative email responses that build relationships and drive conversions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800
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
      
      return NextResponse.json({
        success: true,
        response: aiResponse.trim(),
        source: 'openai',
        generatedAt: new Date().toISOString()
      })
      
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      
      return NextResponse.json({
        success: true,
        response: generateFallbackResponse(lead),
        source: 'fallback',
        error: 'OpenAI unavailable, using template response'
      })
    }
    
  } catch (error) {
    console.error('Generate response API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate response'
    }, { status: 500 })
  }
}

function generateFallbackResponse(lead: any) {
  const name = lead.user_name || 'there'
  const company = lead.company || 'your company'
  
  let responseContent = `Hi ${name},\n\nThank you for reaching out to Tutora! `
  
  // Customize based on inquiry type
  switch (lead.inquiry_type) {
    case 'demo':
      responseContent += `I'm excited to show you how our AI-powered training platform can transform ${company}'s employee development programs.\n\nBased on your message, it sounds like you're looking for a comprehensive solution that can scale with your team. Our platform has helped companies like yours reduce training creation time by 90% while improving engagement rates significantly.\n\nI'd love to schedule a personalized 30-minute demo where we can:\n• Show you how to create training modules from your existing content in minutes\n• Demonstrate our AI-powered quiz and assessment generation\n• Walk through our analytics dashboard and progress tracking features\n• Discuss integration options including SCORM and SSO capabilities\n\nWould you be available for a demo this week? I'm happy to work around your schedule.`
      break
      
    case 'sales':
      responseContent += `I'd be delighted to discuss how Tutora can help ${company} scale your training programs efficiently and cost-effectively.\n\nOur AI-powered platform has helped companies reduce training costs by up to 60% while dramatically improving engagement rates. We automatically transform your existing videos, documents, and presentations into interactive training modules complete with quizzes, progress tracking, and detailed analytics.\n\nI'd love to learn more about your specific training needs and team size to provide you with a customized proposal. Our pricing is designed to scale with your organization, and we offer flexible options for growing teams.\n\nWould you be available for a brief 15-minute call this week to discuss your requirements? I can then send you a detailed proposal with pricing options tailored to ${company}.`
      break
      
    case 'support':
      responseContent += `I'm here to help answer any questions you have about our platform and how it can benefit ${company}.\n\nOur support team is dedicated to ensuring you get the most value from Tutora. Whether you need help with setup, integration, or optimizing your training programs, we're here to assist every step of the way.\n\nCould you share more details about what specific support you're looking for? This will help me connect you with the right specialist or provide you with the most relevant resources.\n\nIn the meantime, you might find our help center and video tutorials useful: [link to resources]`
      break
      
    default:
      responseContent += `I'd be happy to answer any questions about our AI-powered training platform and how it might benefit ${company}.\n\nTutora helps organizations transform their existing content into engaging training modules in minutes, not weeks. Our AI handles everything from quiz generation to progress tracking, making it incredibly easy to scale your employee development programs.\n\nSome key benefits our clients love:\n• 90% faster content creation with AI assistance\n• Automated quiz and assessment generation\n• Comprehensive analytics and progress tracking\n• SCORM compliance and SSO integration\n• Mobile-friendly learning experience\n\nWould you like to see a quick demo of how this works? I can show you how to create a training module from your content in just a few minutes.`
  }
  
  // Add call to action and contact info
  if (lead.phone) {
    responseContent += `\n\nI'll also give you a call at ${lead.phone} to discuss this further, or feel free to reply with a time that works best for you.`
  } else {
    responseContent += `\n\nFeel free to reply with any questions or let me know if you'd like to schedule a brief call to discuss your needs.`
  }
  
  responseContent += `\n\nLooking forward to helping ${company} revolutionize your employee training!\n\nBest regards,\nSales Team\nTutora\nhello@tutoralearn.com\n+1 (555) 123-4567`
  
  return responseContent
}
