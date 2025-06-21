import { Student } from '../types/student';

interface StudentCardProps {
  student: Student;
  onVote: (studentId: string) => void;
  isVoting: boolean;
  colorScheme: 'blue' | 'green';
}

export default function StudentCard({ student, onVote, isVoting, colorScheme }: StudentCardProps) {
  const colorClasses = {
    blue: {
      avatar: 'bg-gradient-to-br from-[#232D4B] to-[#C8CBD2]',
      bullet: 'bg-[#232D4B]',
      skills: 'bg-[#C8CBD2] text-[#232D4B]',
      button: 'bg-[#232D4B] hover:bg-[#E57200]'
    },
    green: {
      avatar: 'bg-gradient-to-br from-[#E57200] to-[#C8CBD2]',
      bullet: 'bg-[#E57200]',
      skills: 'bg-[#C8CBD2] text-[#232D4B]',
      button: 'bg-[#E57200] hover:bg-[#232D4B]'
    }
  };

  const selectedColor = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-center mb-4">
        <div className={`w-24 h-24 ${selectedColor.avatar} rounded-full mx-auto mb-3 flex items-center justify-center`}>
          <span className="text-white text-2xl font-bold">
            {student.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center mt-2 mb-4">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          ELO: {student.currentElo}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
      <p className="text-gray-600">{student.major} • Class of {student.graduationYear}</p>

      {/* LinkedIn Link */}
      <div className="mb-4">
        <a 
          href={student.linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
          </svg>
          View LinkedIn Profile
        </a>
      </div>

      {/* Achievements */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Key Achievements</h3>
        <div className="space-y-1">
          {student.achievement.map((achievement, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <span className={`w-2 h-2 ${selectedColor.bullet} rounded-full mr-2`}></span>
              {achievement}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skills, index) => (
            <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${selectedColor.skills}`}>{skills}</span>
          ))}
        </div>
      </div>

      {/* Vote Button */}
      <button
        onClick={() => onVote(student.id)}
        disabled={isVoting}
        className={`w-full ${selectedColor.button} disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors`}
      >
        {isVoting ? 'Voting...' : `Vote for ${student.name}`}
      </button>
    </div>
  );
} 