import { NextResponse } from 'next/server';

export async function GET() {
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const keyPreview = process.env.OPENAI_API_KEY 
    ? `${process.env.OPENAI_API_KEY.substring(0, 10)}...` 
    : 'Not set';

  return NextResponse.json({
    hasOpenAIKey,
    keyPreview,
    timestamp: new Date().toISOString(),
    message: hasOpenAIKey ? 'OpenAI API key is configured' : 'OpenAI API key is missing'
  });
}
