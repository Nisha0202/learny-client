import React, { useEffect, useState } from 'react';

export default function DisplayTutor() {
  const [sessionsData, setSessionsData] = useState([]);

  useEffect(() => {
    fetch('data.json')
      .then(response => response.json())
      .then(data => setSessionsData(data));
  }, []);

  return (
    <div className='container '>
        <div className='my-12 grid gap-5 place-content-center'>
                 <h1 className='text-xl font-bold text-center'>Our Tutors</h1>
           <div className='flex flex-wrap gap-6' >
      {sessionsData.map((session, index) => (
        <p className='text-lg' key={index}>{session.tutorName}</p>
      ))}
    </div>
        </div>
   
    </div>
 
  );
}

