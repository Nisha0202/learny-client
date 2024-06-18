import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchSessions = async () => {
  const res = await fetch('https://learny-brown.vercel.app/api/session');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function DisplayTutor() {

  const { data: sessionsData, status } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
    retry: 3, // retry up to 3 times
  });
  
  // const { data: sessionsData, status } = useQuery({
  //   queryKey: 'sessions',
  //   queryFn: fetchSessions,
  //   retry: 3, // retry up to 3 times
  // });
  
  if (status === 'loading') {
    return <div className='container grid place-content-center'> Loading...</div>;
  }

  if (status === 'error') {
    return <div className='container grid place-content-center'>Error fetching data</div>;
  }



  const uniqueTutorNames = Array.isArray(sessionsData) ? [...new Set(sessionsData.map(session => session.tutorName))] : [];

  return (
    <div className='container'>
      <h1 className='my-12 text-xl font-bold text-center'>Our Tutors</h1>
      <div className='flex flex-wrap gap-6 place-content-center'>
        {uniqueTutorNames.map((tutorName, index) => (
          <p className='text-lg hover:text-blue-500' key={index}>{tutorName}</p>
        ))}
      </div>
    </div>
  );
}

