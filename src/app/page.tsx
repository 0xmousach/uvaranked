'use client';
import { useEffect, useState } from 'react';
import { StudentService } from '../lib/studentService';
import StudentCard from '../components/StudentCardWithData';
import { LinkedinProfile } from '../types/student';

export default function Home() {
  const [profiles, setProfiles] = useState<LinkedinProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const data = await StudentService.getRandomProfiles();
        setProfiles(data);
      } catch (err: any) {
        if (err && err.message) {
          setError(err.message);
        } else if (typeof err === 'object') {
          setError(JSON.stringify(err));
        } else {
          setError('Failed to fetch profiles');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-4 pt-10">
        <StudentCard
          key={profiles[0].id}
          student={profiles[0]}
          colorScheme={'blue'}
        />

        <StudentCard
          key={profiles[1].id}
          student={profiles[1]}
          colorScheme={'orange'}
        />
      </div>
    </div>
  );
}
