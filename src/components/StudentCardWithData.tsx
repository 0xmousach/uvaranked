import { LinkedinProfile } from '../types/student';

interface StudentCardProps {
  student: LinkedinProfile;
  colorScheme: 'blue' | 'orange';
  onVote: (id: string) => void;
  isVoting: boolean;
}

export default function StudentCard({ student, colorScheme, onVote, isVoting }: StudentCardProps) {
  const colorClasses = {
    blue: {
      avatar: 'bg-gradient-to-br from-[#232D4B] to-[#C8CBD2]',
      bullet: 'bg-[#232D4B]',
      skills: 'bg-[#C8CBD2] text-[#232D4B]',
      button: 'bg-[#232D4B] hover:bg-[#E57200]'
    },
    orange: {
      avatar: 'bg-gradient-to-br from-[#E57200] to-[#C8CBD2]',
      bullet: 'bg-[#E57200]',
      skills: 'bg-[#C8CBD2] text-[#232D4B]',
      button: 'bg-[#E57200] hover:bg-[#232D4B]'
    }
  };

  const selectedColor = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="
      flex flex-col items-center bg-white rounded-2xl shadow-lg p-6
      hover:shadow-2xl transition-shadow gap-3
      w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
      flex-1
      border border-gray-100
    ">
      {/* Avatar */}
      {student.profile_image ? (
        <img
          src={student.profile_image}
          alt={student.full_name}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow mb-2"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-200 flex items-center justify-center text-white text-3xl font-bold mb-2 shadow">
          {student.full_name.split(' ').map(n => n[0]).join('')}
        </div>
      )}

      {/* Name & Headline */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">{student.full_name}</h2>
        {student.location && (
          <p className="text-gray-400 text-xs mt-1">{student.location}</p>
        )}
      </div>

      {/* ELO & Connections */}
      <div className="flex justify-center gap-4 mt-2">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          ELO: {student.current_elo}
        </span>
        <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
          Connections: {student.connections ?? 0}
        </span>
      </div>

      {/* LinkedIn Branded Button (put this above the voting button) */}
      <div className="flex items-center justify-center mt-2">
        <a
          href={student.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-[#0077B5] hover:bg-[#005983] text-white text-xs font-medium rounded-full shadow transition-colors"
          title="View LinkedIn Profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
          </svg>
          LinkedIn
        </a>
      </div>

      {/* About */}
      {student.about && (
        <div className="w-full mt-2">
          <h3 className="font-semibold text-gray-700 text-sm mb-1">About</h3>
          <p className="text-gray-600 text-xs line-clamp-3">{student.about}</p>
        </div>
      )}

      {/* AI Analysis */}
      {student.aiAnalysis && (
        <div className="w-full mt-2">
          <h3 className="font-semibold text-gray-700 text-sm mb-1">AI Career Analysis</h3>
          <div className="text-gray-600 text-xs bg-gray-50 p-2 rounded border">
            <pre className="whitespace-pre-wrap font-sans">{student.aiAnalysis}</pre>
          </div>
        </div>
      )}

      {/* Voting Button (at the bottom, full width) */}
      <button
        onClick={() => onVote(student.id)}
        disabled={isVoting}
        className={`mt-auto w-full ${selectedColor.button} text-white font-semibold py-2 rounded-lg text-center transition-colors shadow`}
      >
        {isVoting ? 'Voting...' : `Vote for ${student.full_name}`}
      </button>
    </div>
  );
}
