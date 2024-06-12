import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchSessions = async () => {
  const res = await fetch('http://localhost:5000/api/session');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function DisplayTutor() {
  const { data: sessionsData, status } = useQuery({
    queryKey: 'sessions',
    queryFn: fetchSessions,
    retry: 3, // retry up to 3 times
  });
  
  if (status === 'loading') {
    return <div className='container grid place-item-center'> Loading...</div>;
  }

  if (status === 'error') {
    return <div className='container grid place-item-center'>Error fetching data</div>;
  }

  return (
    <div className='container '>
      <div className='my-12 grid gap-5 place-content-center'>
        <h1 className='text-xl font-bold text-center'>Our Tutors</h1>
        <div className='flex flex-wrap gap-6' >
          {Array.isArray(sessionsData) && sessionsData.map((session, index) => (
            <p className='text-lg' key={index}>{session.tutorName}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

