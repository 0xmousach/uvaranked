import { LinkedinProfile } from '../types/student';

interface StudentCardProps {
  student: LinkedinProfile;
  colorScheme: 'blue' | 'orange';
}

export default function StudentCard({ student, colorScheme }: StudentCardProps) {
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
    <div className="flex flex-col place-items-center bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow gap-1 min-w-md">
      
      <div className={`rounded-full w-24 h-24 ${selectedColor.avatar} flex items-center justify-center`}>
        <span className="text-white text-2xl font-bold">
          {student.full_name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>

      <div className="mt-2 mb-4">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          ELO: {student.current_elo}
        </span>
      </div>

      <div>
        <span className="text-lg text-gray-500">
          {student.full_name}
        </span>
      </div>

      <div>
        <span className="text-sm text-gray-500">
          {student.connections} connections
        </span>
      </div>
    </div>
  );
}
