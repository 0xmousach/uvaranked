'use client';
import { useEffect, useState } from 'react';
import { StudentService } from '../lib/studentService';
import StudentCard from '../components/StudentCardWithData';
import { LinkedinProfile } from '../types/student';

export default function Home() {
  const [profiles, setProfiles] = useState<LinkedinProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get profiles without AI analysis for immediate display
        const data = await StudentService.getRandomProfiles();
        setProfiles(data);
        setLoading(false);
        
        // Then, if any profiles need AI analysis, show loading state
        const needsAnalysis = data.some(profile => !profile.aiAnalysis && profile.experiences?.length > 0);
        if (needsAnalysis) {
          setAiLoading(true);
          
          // Trigger AI analysis (this will update the profiles with analysis)
          const enrichedData = await StudentService.getRandomProfiles();
          setProfiles(enrichedData);
          setAiLoading(false);
        }
      } catch (err: any) {
        if (err && err.message) {
          setError(err.message);
        } else if (typeof err === 'object') {
          setError(JSON.stringify(err));
        } else {
          setError('Failed to fetch profiles');
        }
        setLoading(false);
        setAiLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#232D4B] mb-4"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {aiLoading && (
        <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded shadow-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            <span className="text-sm">Analyzing profiles...</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full p-10 md:items-stretch">
        <StudentCard
          key={profiles[0].id}
          student={profiles[0]}
          colorScheme="blue"
          onVote={() => {}}
          isVoting={false}
        />

        <div className="flex items-center justify-center">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-2 border-gray-200">
            <span className="text-2xl font-bold text-gray-700">VS</span>
          </div>
        </div>

        <StudentCard
          key={profiles[1].id}
          student={profiles[1]}
          colorScheme="orange"
          onVote={() => {}}
          isVoting={false}
        />
      </div>
    </div>
  );
}
