import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useNavigate} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';


const StudySessionCard = ({ session }) => {
  const { usern } = useContext(AuthContext);
 const navigate = useNavigate();
  const handleReadMore = () => {
    if (!usern) {
      navigate('/login');
 
    } else {
      navigate(`/session/${session._id}`);
    }
  };
  return (
    <div className="p-6 bg-white rounded shadow-md plus w-80 border-2">
      <h2 className="text-xl font-bold mb-2">{session.sessionTitle}</h2>
      <p className='mb-3 text-blue-500'>{session.registrationFee}</p>
      <p className="text-gray-600 h-24">{session.sessionDescription}</p>
      <div className='w-full flex justify-between mt-auto'>
        <button className={`mt-2 font-bold py-1  rounded ${session.isRegistrationOpen ? 'text-green-700' : 'text-red-700'}`}>
          {session.isRegistrationOpen ? 'Ongoing' : 'Closed'}
        </button>
        <button onClick={handleReadMore} className="mt-2 py-1  rounded hover:text-blue-700 font-bold">Read More</button>
      </div>
    </div>
  );
};


// const fetchSessions = async () => {
//   try {
//     const res = await fetch('http://localhost:5000/api/session');
//     if (!res.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await res.json();
//     console.log(data);

//     return data; // return data directly
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };



// const StudySessions = () => {
//   const [displayCount, setDisplayCount] = useState(3);
//   const { data: sessionsData, status } = useQuery({
//     queryKey: 'sessions',
//     queryFn: fetchSessions,
//     retry: 3, // retry up to 3 times
//   });
  


//   if (status === 'loading') {
//     return <div className='container grid place-content-center'> Loading...</div>;
//   }

//   if (status === 'error') {
//     return <div className='container grid place-content-center'>Error fetching data</div>;
//   }

//   if (!Array.isArray(sessionsData)) {
//     console.error('sessionsData is not an array');
//     return <div>Error: Data is not in expected format</div>;
//   }

//   return (
//     <div className='container flex flex-wrap justify-evenly gap-4'>
//       {sessionsData.slice(0, displayCount).map((session, index) => (
//         <StudySessionCard key={index} session={session} />
//       ))}
//       {sessionsData.length > displayCount && 
//         <button 
//           className="mt-4 py-2 px-4 rounded bg-blue-500 text-white" 
//           onClick={() => setDisplayCount(sessionsData.length)}
//         >
//           See All Sessions
//         </button>
//       }
//     </div>
//   );
// };
const fetchSessions = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/session');
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('API response is not an array');
      throw new Error('Invalid API response');
    }
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const StudySessions = () => {
  const [displayCount, setDisplayCount] = useState(3);
  const { data: sessionsData, status } = useQuery({
    queryKey: ['sessions'], 
    queryFn: fetchSessions,
    retry: 3, // retry up to 3 times
  });
  // const { data: sessionsData, status, error } = useQuery({
  //   queryKey: 'essions',
  //   queryFn: fetchSessions,
  //   retry: 3, // retry up to 3 times
  //   staleTime: 1000 * 60 * 1, // cache for 5 minutes
  // });

  if (status === 'loading') {
    return <div className='container grid place-content-center'> Loading...</div>;
  }

  if (status === 'error') {
    return <div className='container grid place-content-center'>Error fetching data: {error.message}</div>;
  }

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
    return <div>Error: Data is not in expected format</div>;
  }

  return (
    <div className='container flex flex-wrap justify-evenly gap-4'>
      {sessionsData.slice(0, displayCount).map((session, index) => (
        <StudySessionCard key={index} session={session} />
      ))}
      {sessionsData.length > displayCount && 
        <button 
          className="mt-4 py-2 px-4 rounded bg-blue-500 text-white" 
          onClick={() => setDisplayCount(sessionsData.length)}
        >
          See All Sessions
        </button>
      }
    </div>
  );
};


export default StudySessions;






