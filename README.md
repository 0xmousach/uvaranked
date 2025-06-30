# UVA Ranked - Student Voting Platform

A Next.js application that allows users to vote on UVA students using an ELO ranking system, with data stored in Supabase.

## Features

- **Student Comparison**: Vote between two randomly selected UVA students
- **ELO Rating System**: Ratings are updated based on votes using the ELO algorithm
- **Real LinkedIn Data**: Displays student profiles, experiences, and projects from LinkedIn
- **Leaderboard**: View top-ranked students by ELO rating
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd uvaranked
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Create the following tables in your Supabase SQL editor:

```sql
-- LinkedIn Profiles table
CREATE TABLE linkedin_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  headline TEXT,
  location TEXT,
  about TEXT,
  linkedin_url TEXT NOT NULL UNIQUE,
  profile_image_url TEXT,
  current_elo INTEGER DEFAULT 1200,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LinkedIn Experiences table
CREATE TABLE linkedin_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES linkedin_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LinkedIn Projects table
CREATE TABLE linkedin_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES linkedin_profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add the SQL function from supabase_functions.sql
```

3. Run the SQL function from `supabase_functions.sql` in your Supabase SQL editor

### 3. Environment Setup

1. Copy `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Add Sample Data

Insert some sample LinkedIn profile data into your `linkedin_profiles` table to test the application.

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How It Works

### ELO Rating System

The application uses the ELO rating system commonly used in chess and competitive games:

1. Each student starts with a rating of 1200
2. When a vote is cast, both students' ratings are updated based on the outcome
3. Higher-rated students lose more points when losing to lower-rated students
4. Lower-rated students gain more points when beating higher-rated students

### Database Schema

- **linkedin_profiles**: Core student information and ELO ratings
- **linkedin_experiences**: Work experience data linked to profiles
- **linkedin_projects**: Project data linked to profiles

### Voting Process

1. Two random students are selected from the database
2. Users vote for their preferred student
3. ELO ratings are calculated and updated atomically
4. New pair of students is loaded for the next comparison

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License