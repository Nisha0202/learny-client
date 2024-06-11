import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const fetchSessions = async ({ queryKey }) => {
  const [userEmail] = queryKey;
  const { data } = await axios.get(`http://localhost:5000/api/bookedSession?userEmail=${userEmail}`);
  return data;
};

const BookedSession = () => {
  const navigate = useNavigate();
  const { usern } = useContext(AuthContext);
  
  console.log(usern.email);
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: [usern.email],
    queryFn: fetchSessions,
  });

  if (isLoading) return <div className='container grid place-content-center'>Loading...</div>;
  if (error) return <div className='container grid place-content-center'>'An error has occurred: ' + error.message</div>;

  const viewDetails = (sessionId) => {
    if (!usern) {
      navigate('/login');
    } else {
      navigate(`/session/${sessionId}`);
    }
  };

  return (
    <div className='container min-h-[75vh] flex flex-col lg:flex-wrap lg:flex-row items-center justify-around gap-6'>
      {sessions.map(session => (
        <div key={session._id} className=' '>
          <div className="p-6 bg-white rounded shadow-md plus w-80 border-2">
            <h2 className="text-xl font-bold mb-2">{session.sessionDetails.sessionTitle}</h2>
            <p className='mb-3 text-blue-500'>{session.sessionDetails.registrationFee}</p>
            <p className="text-gray-600 h-24">{session.sessionDetails.sessionDescription}</p>
            <div className='w-full flex justify-between mt-auto'>
              <button className='bg-blue-500 btn text-white font-semibold' onClick={() => viewDetails(session.sessionDetails._id)}>View Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookedSession;

  // // Fetch the session details from the server
  // axios.get(`http://localhost:5000/api/session/${sessionId}`)
  //   .then(response => {
  //     // Display the session details
  //     console.log(response.data);
  //   })
  //   .catch(error => console.error('Error fetching session details:', error));