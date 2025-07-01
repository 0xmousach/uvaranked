import { NextRequest, NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";

// Check if API key is available
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY environment variable is not set');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `You are a professional career analyst. Analyze multiple candidates' LinkedIn experiences and provide concise summaries.

For each candidate, format like this:

🔹 Experience
- [Impactful or unique experience]  
- [Key achievement or role insight]  

🔹 Key Skills  
[Skill 1], [Skill 2]

---

Keep each analysis under 100 words. Strictly follow the format.`;

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 1,
  baseDelay: number = 300
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Check if it's a retryable error (529, 429, 503, etc.)
      const isRetryable = error.status === 529 || error.status === 429 || error.status === 503;
      if (!isRetryable) {
        throw error;
      }
      
      // Wait with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 });
    }

    const { profiles } = await request.json();
    
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid profiles array' }, { status: 400 });
    }
    
    // Filter out profiles with no experiences
    const profilesWithExperiences = profiles.filter((profile: any) => 
      profile.experiences && profile.experiences.length > 0
    );
    
    if (profilesWithExperiences.length === 0) {
      return NextResponse.json({ analyses: profiles.map(() => null) });
    }

    // Create combined text for all profiles
    const combinedText = profilesWithExperiences.map((profile: any) => {
      const experienceText = profile.experiences.map((exp: any) => 
        `${exp.title} at ${exp.company}${exp.duration ? ` (${exp.duration})` : ''}`
      ).join('\n');
      
      return `${profile.full_name}\n${experienceText}`;
    }).join('\n\n---\n\n');
    
    try {
      const msg = await retryWithBackoff(async () => {
        return await anthropic.messages.create({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 1500,
          temperature: 1,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: combinedText
                }
              ]
            }
          ]
        });
      });
      
      const analysis = msg.content[0].type === 'text' ? msg.content[0].text : null;
      
      // Parse the analysis back into individual profiles
      const analyses = parseBatchAnalysis(analysis, profilesWithExperiences);
      
      return NextResponse.json({ analyses });
      
    } catch (apiError: any) {
      // If Anthropic is overloaded or unavailable, return fallback analyses
      if (apiError.status === 529 || apiError.status === 429 || apiError.status === 503) {
        console.warn('Anthropic API overloaded, using fallback analyses');
        
        const fallbackAnalyses = profilesWithExperiences.map((profile: any) => {
          return `🔹 Summary of Experience  
- ${profile.experiences.length} professional roles across various companies
- Experience in ${profile.experiences.map((exp: any) => exp.company).join(', ')}

🔹 Key Skills  
Based on ${profile.experiences.length} professional experiences`;
        });
        
        return NextResponse.json({ analyses: fallbackAnalyses });
      }
      
      throw apiError;
    }
    
  } catch (error) {
    console.error('Error in analyze-profiles-batch API:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to parse batch analysis back into individual analyses
function parseBatchAnalysis(analysis: string | null, profiles: any[]): (string | null)[] {
  if (!analysis) return profiles.map(() => null);
  
  const analyses: (string | null)[] = [];
  const sections = analysis.split('---').map(s => s.trim()).filter(s => s);
  
  for (let i = 0; i < profiles.length; i++) {
    if (i < sections.length) {
      analyses.push(sections[i]);
    } else {
      // Fallback for profiles without analysis
      const profile = profiles[i];
      analyses.push(`🔹 Summary of Experience  
- ${profile.experiences.length} professional roles
- Experience in ${profile.experiences.map((exp: any) => exp.company).join(', ')}

🔹 Key Skills  
Based on ${profile.experiences.length} professional experiences`);
    }
  }
  
  return analyses;
} 