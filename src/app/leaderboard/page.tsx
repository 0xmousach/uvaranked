'use client';
import { useState, useEffect } from 'react';
import { LinkedinProfile } from '../../types/student';
import { StudentService } from '../../lib/studentService';
import Link from 'next/link';

export default function Leaderboard() {
  const [students, setStudents] = useState<LinkedinProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        const leaderboard = await StudentService.getLeaderboard(50);
        setStudents(leaderboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        console.error('Error loading leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#232D4B] mb-4"></div>
          <p className="text-xl text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-[#232D4B] hover:text-[#E57200] font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Voting
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#232D4B] mb-2">UVA Student Leaderboard</h1>
          <p className="text-gray-600">Ranked by ELO rating - Higher ratings indicate more impressive profiles</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#232D4B] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold">Student</th>
                  <th className="px-6 py-4 text-left font-semibold">ELO Rating</th>
                  <th className="px-6 py-4 text-left font-semibold">Total Votes</th>
                  <th className="px-6 py-4 text-left font-semibold">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {index < 3 && (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            'bg-amber-600'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </div>
                        )}
                        <span className={`font-medium ${index < 3 ? 'text-lg' : ''}`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {student.profile_image_url ? (
                          <img 
                            src={student.profile_image_url} 
                            alt={student.name}
                            className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-[#232D4B] to-[#E57200] rounded-full mr-4 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{student.name}</div>
                          {student.headline && (
                            <div className="text-xs text-gray-500">{student.headline}</div>
                          )}
                          {student.location && (
                            <div className="text-xs text-gray-500">{student.location}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          student.current_elo >= 1500 ? 'bg-green-100 text-green-800' :
                          student.current_elo >= 1300 ? 'bg-blue-100 text-blue-800' :
                          student.current_elo >= 1200 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.current_elo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{student.total_votes}</span>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={student.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            ELO ratings are calculated using the standard chess rating system. Higher ratings indicate students with more impressive profiles.
          </p>
        </div>
      </div>
    </div>
  );
}
