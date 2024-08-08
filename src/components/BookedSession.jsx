import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StdNav from './StdNav';

const fetchSessions = async ({ queryKey }) => {
  const [userEmail] = queryKey;
  console.log(usern.email)
  // const { data } = await axios.get(`http://localhost:5000/bookedSession?userEmail=${userEmail}`);
 
  const { data } = await axios.get(`https://learny-brown.vercel.app/bookedSession?userEmail=${userEmail}`);
 console.log('Fetched data:', data);
  return data;
};

const BookedSession = () => {
  const navigate = useNavigate();
  const { usern } = useContext(AuthContext);
  

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: [usern.email],
    queryFn: fetchSessions,
  });
  console.log(usern.email)
  if (isLoading)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav/>
        <div className='font-bold grid place-content-center mt-4'>
        Loading...
        </div>
      </div>
    );

  if (error)
      return (
        <div className='container min-h-[75vh]'>
          <StdNav/>
          <div className='font-bold grid place-content-center mt-4'>
          No Booked Session Yet
          </div>
        </div>
      );

  if (!sessions || sessions.length === 0)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav/>
        <div className='font-bold grid place-content-center mt-4'>
              No Booked Session Yet
        </div>
      </div>
    );
 
  const viewDetails = (sessionId) => {
    if (!usern) {
      navigate('/login');
    } else {
      navigate(`/viewdetails/${sessionId}`);
    }
  };

  


  return (
    <div className='container min-h-[75vh]'>
         <StdNav/>
         <div className='flex flex-col lg:flex-wrap lg:flex-row items-center justify-around gap-6 mt-6 md:mt-8'>
          {sessions.map(session => {
        const desc = session.sessionDetails.sessionDescription.split(' ').slice(0, 13).join(' ');
  
        return (

          <div key={session._id} className=''>
            <div className="p-6 bg-white rounded shadow-md plus w-72 border-2">
              <h2 className="text-xl font-bold mb-2 h-16 overflow-hidden">{session.sessionDetails.sessionTitle}</h2>
              <p className='mb-3 text-blue-500'>${session.sessionDetails.registrationFee}</p>
              <p className="text-gray-600 h-28">{desc}...</p>
              <div className='w-full flex justify-between mt-auto'>
                <button className='bg-blue-500 btn text-white font-semibold' onClick={() => viewDetails(session.sessionDetails._id)}>View Details</button>
              </div>
            </div>
          </div>
        );
      })} 
         </div>
     
    </div>
  );
  


};

export default BookedSession;