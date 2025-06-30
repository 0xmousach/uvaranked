export interface LinkedinProfile {
  id: string;
  full_name: string;
  connections: number;
  headline?: string;
  profile_image_url?: string;
  linkedin_url: string;
  about?: string;
  location?: string;
  current_elo: number;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export interface LinkedinExperience {
  id: string;
  profile_id: string;
  position_title: string;
  company_name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
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