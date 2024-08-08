import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useNavigate} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';


const StudySessionCard = ({ session }) => {
  const { usern } = useContext(AuthContext);
  const currentDate = new Date();
  const registrationEndDate = new Date(session.registrationEndDate);
  const isRegistrationOpen = currentDate <= registrationEndDate;
 const navigate = useNavigate();
  const handleReadMore = () => {
    if (!usern) {
      navigate('/login');
 
    } else {
      navigate(`/session/${session._id}`);
    }
  };
  return (
    <div className="p-6 bg-white rounded shadow-md plus w-72 border-2">
      <h2 className="text-xl font-bold mb-2 h-16 py-1 overflow-hidden">{session.sessionTitle}</h2>
      <p className='mb-3 text-blue-500'>${session.registrationFee}</p>
      <p className="text-gray-600 h-28 overflow-hidden">{session.sessionDescription.split(' ').slice(0, 13).join(' ')}...</p>
      <div className='w-full flex justify-between  mt-auto'>
        <button className={`mt-2 font-bold py-1 pr-2  rounded ${isRegistrationOpen ? 'text-green-700' : 'text-red-700'}`}>
          {isRegistrationOpen ? 'Ongoing' : 'Closed'}
        </button>
        <button onClick={handleReadMore} className="mt-2 py-1  rounded hover:text-blue-700 font-bold">Read More</button>
      </div>
    </div>
  );
};



// const fetchSessions = async () => {

//   try {
//     const res = await fetch('https://learny-brown.vercel.app/api/session');
//     if (!res.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await res.json();
//     if (!Array.isArray(data)) {
//       console.error('API response is not an array');
//       throw new Error('Invalid API response');
//     }
 
//     return data;
    
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };

const StudySessions = () => {
  const [displayCount, setDisplayCount] = useState(3);
  const [loading, setLoading] = useState(true)


  
const fetchSessions = async () => {

  try {
    const res = await fetch('https://learny-brown.vercel.app/api/session');
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('API response is not an array');
      throw new Error('Invalid API response');
    }
 setLoading(false);
    return data;
    
    
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

  const { data: sessionsData, status } = useQuery({
    queryKey: ['sessions'], 
    queryFn: fetchSessions,
    retry: 3, // retry up to 3 times
  });

  
  if (loading)
    return (
      <div className='container min-h-[75vh]'>
        <div className='font-bold grid place-content-center mt-4'>Loading...</div>
      </div>
    );



  if (status === 'loading')
    return (
      <div className='container min-h-[75vh]'>
        <div className='font-bold grid place-content-center mt-4'>Loading...</div>
      </div>
    );

  if (status === 'error')
    return (
      <div className='container min-h-[75vh]'>
        <div className='font-bold grid place-content-center mt-4'>An error has occurred</div>
      </div>
    );

  if (!sessionsData || sessionsData.length === 0)
    return (
      <div className='container min-h-[75vh]'>
        <div className='font-bold grid place-content-center mt-4'>No materials</div>
      
      </div>
    );





    let sessionsArray;
  if (Array.isArray(sessionsData)) {
    sessionsArray = sessionsData;
  } else if (typeof sessionsData === 'object') {
    sessionsArray = Object.values(sessionsData);
  } else {
    sessionsArray = [sessionsData];
  }
  if (!sessionsData ||!Array.isArray(sessionsArray)) {
    console.error('sessionsData is not an array or is null/undefined');
    return <div className='container grid place-item-center'>Loading</div>;
  }
  const approvedSessions = sessionsArray.filter(session => session.status === 'approved');

  return (
    <div className='container grid place-item-center gap-8'>
      <div className='flex flex-wrap justify-evenly gap-4'>
        {approvedSessions.slice(0, displayCount).map((session, index) => (
          <StudySessionCard key={index} session={session} />
        ))}
      </div>
      {approvedSessions.length > displayCount && 
        <button 
          className="mx-auto py-2 px-4 rounded bg-blue-500 text-white" 
          onClick={() => setDisplayCount(approvedSessions.length)}
        >
          See All Sessions
        </button>
      }
    </div>
  );

  
  
};


export default StudySessions;






