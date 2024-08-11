import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StdNav from './StdNav';

const BookedSession = () => {
  const navigate = useNavigate();
  const { usern } = useContext(AuthContext);


  // Redirect to login if user is not available
  if (!usern) {
    return (
      <div className="container min-h-[75vh] flex justify-center items-center">
        <p className="text-red-500 font-bold">You must be logged in to access.</p>
      </div>
    );
  }

  const fetchSessions = async (userEmail) => {
    const { data } = await axios.get(`https://learny-brown.vercel.app/api/bookedSession?userEmail=${userEmail}`);
    return data;
  };
  

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: [usern?.email],
    queryFn: () => fetchSessions(usern.email),
    enabled: !!usern?.email, 
  });

  if (isLoading)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav />
        <div className='font-bold grid place-content-center mt-4'>
          Loading...
        </div>
      </div>
    );

    if (error || !sessions || sessions.length === 0) {
      console.error("Error fetching sessions:", error);
      return (
        <div className='container min-h-[75vh]'>
          <StdNav />
          <div className='font-bold grid place-content-center mt-4'>
            No Booked Session Yet
          </div>
        </div>
      );
    }
    

  const viewDetails = (sessionId) => {
    if (!usern) {
      navigate('/login');
    } else {
      navigate(`/viewdetails/${sessionId}`);
    }
  };



  return (
    <div className='container min-h-[75vh]'>
      <StdNav />
      <div className='flex flex-col lg:flex-wrap lg:flex-row items-center justify-around gap-6 mt-6 md:mt-8'>
        {sessions.map(session => {
          const desc = session.sessionDetails.sessionDescription.split(' ').slice(0, 13).join(' ');

          return (
            <div key={session._id} className=''>
              <div className="p-6 bg-white rounded shadow-md plus w-72 border-2">
                <h2 className="text-xl font-bold mb-2 h-16 overflow-hidden">
                  {session.sessionDetails.sessionTitle}
                </h2>
                <p className='mb-3 text-blue-500'>${session.sessionDetails.registrationFee}</p>
                <p className="text-gray-600 h-28">{desc}...</p>
                <div className='w-full flex justify-between mt-auto'>
                  <button
                    className='bg-blue-500 btn text-white font-semibold'
                    onClick={() => viewDetails(session.sessionDetails._id)}
                  >
                    View Details
                  </button>
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
