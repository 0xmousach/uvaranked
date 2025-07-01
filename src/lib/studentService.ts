import { supabase } from './supabase';

// Simple in-memory cache for AI analyses
const analysisCache = new Map<string, string>();

export class StudentService {

  static async getRandomProfiles() {
    // Get random profiles
    const { data, error } = await supabase
      .rpc('get_random_profiles');
    if (error) throw error;
    if (!data || data.length < 2) return [];

    const profileIds = data.map((profile: any) => profile.id);

    // Fetch all experiences and projects for both profiles in parallel
    const [experiencesResult, projectsResult] = await Promise.all([
      supabase
        .from('linkedin_experiences')
        .select('*')
        .in('profile_id', profileIds),
      supabase
        .from('linkedin_projects')
        .select('*')
        .in('profile_id', profileIds)
    ]);

    const experiences = experiencesResult.data || [];
    const projects = projectsResult.data || [];

    // Attach experiences and projects to each profile
    const profilesWithData = data.map((profile: any) => {
      const profileExperiences = experiences.filter(exp => exp.profile_id === profile.id);
      const profileProjects = projects.filter(proj => proj.profile_id === profile.id);
      
      return {
        ...profile,
        experiences: profileExperiences,
        projects: profileProjects,
      };
    });

    // Generate AI analysis for all profiles in a single batch request
    const enrichedProfiles = await this.addAIAnalysis(profilesWithData);

    return enrichedProfiles;
  }

  private static async addAIAnalysis(profiles: any[]) {
    // Check cache first
    const profilesToAnalyze = profiles.filter(profile => {
      const cacheKey = this.getCacheKey(profile);
      return !analysisCache.has(cacheKey);
    });

    if (profilesToAnalyze.length === 0) {
      // All analyses are cached
      return profiles.map(profile => ({
        ...profile,
        aiAnalysis: analysisCache.get(this.getCacheKey(profile))
      }));
    }

    // Get AI analysis for profiles that need it
    let analyses: (string | null)[] = [];
    try {
      const response = await fetch('/api/analyze-profiles-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profiles: profilesToAnalyze
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        analyses = result.analyses || [];
        
        // Cache the results
        profilesToAnalyze.forEach((profile, index) => {
          const cacheKey = this.getCacheKey(profile);
          const analysis = analyses[index];
          if (analysis !== null) {
            analysisCache.set(cacheKey, analysis);
          }
        });
      }
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      analyses = profilesToAnalyze.map(() => null);
    }

    // Combine cached and new analyses
    const allAnalyses: (string | null)[] = [];
    let analysisIndex = 0;
    
    for (const profile of profiles) {
      const cacheKey = this.getCacheKey(profile);
      if (analysisCache.has(cacheKey)) {
        allAnalyses.push(analysisCache.get(cacheKey) || null);
      } else {
        allAnalyses.push(analyses[analysisIndex] || null);
        analysisIndex++;
      }
    }

    return profiles.map((profile, index) => ({
      ...profile,
      aiAnalysis: allAnalyses[index]
    }));
  }

  private static getCacheKey(profile: any): string {
    // Create a cache key based on profile ID and experience hash
    const experienceHash = profile.experiences
      ?.map((exp: any) => `${exp.title}-${exp.company}`)
      .join('|') || '';
    return `${profile.id}-${experienceHash}`;
  }

  static async getLeaderboard(limit: number = 50) {
    const { data, error } = await supabase
      .from('linkedin_profiles')
      .select('*')
      .order('current_elo', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  // Clear cache (useful for testing or when cache gets too large)
  static clearCache() {
    analysisCache.clear();
  }
}
