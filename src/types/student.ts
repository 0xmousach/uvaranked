export interface LinkedinProfile {
  id: string;
  full_name: string;
  connections: number;
  headline?: string;
  profile_image?: string;
  linkedin_url: string;
  about?: string;
  location?: string;
  current_elo: number;
  total_votes: number;
  created_at: string;
  updated_at: string;
  experiences?: LinkedinExperience[];
  projects?: LinkedinProject[];
  aiAnalysis?: string | null;
}

export interface LinkedinExperience {
  id: string;
  profile_id: string;
  title: string;
  company: string;
  duration?: string;
  created_at: string;
}

export interface LinkedinProject {
  id: string;
  profile_id: string;
  project_name: string;
  description?: string;
  url?: string;
  created_at: string;
}