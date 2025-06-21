'use client';
import { useState } from 'react';
import { Student } from '../types/student';
import StudentCard from '../components/StudentCard';

export default function Home() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const student1: Student = {
    id: '1',
    name: 'Sarah Chen',
    major: 'Computer Science',
    graduationYear: '2025',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    currentElo: 1250,
    achievement: ['Google SWE Intern', 'ACM Programming Contest Winner', 'Dean\'s List'],
    skills: ['Python', 'React', 'Machine Learning', 'Data Structures']
  };
  
  const student2: Student = {
    id: '2',
    name: 'Michael Rodriguez',
    major: 'Computer Engineering',
    graduationYear: '2024',
    linkedinUrl: 'https://linkedin.com/in/michaelrodriguez',
    currentElo: 1180,
    achievement: ['Microsoft Research Intern', 'IEEE Student Branch President', 'HackUVA Winner'],
    skills: ['C++', 'Embedded Systems', 'Computer Architecture', 'IoT']
  };

  const handleVote = async (winnerId: string) => {
    setIsVoting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Implement actual ELO calculation and API call
    console.log(`Voted for student ${winnerId}`);
    
    setIsVoting(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
        {/* Student 1 Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <StudentCard student={student1} onVote={handleVote} isVoting={isVoting} colorScheme="blue" />
        </div>

        {/* VS Divider */}
        <div className="flex item-center justify-center">
            <div className="bg-white rounded-full p-6 shadow-lg">
              <span className="text-3xl font-bold text-gray-400">VS</span>
            </div>
        </div>

        {/* Student 2 Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <StudentCard student={student2} onVote={handleVote} isVoting={isVoting} colorScheme="green" />
        </div>
      </div>
    </div>
  );
}
