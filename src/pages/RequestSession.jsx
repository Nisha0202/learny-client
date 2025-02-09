import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import Swal from 'sweetalert2';
import TchNav from '../components/TchNav';

const fetchSessions = async ({ queryKey }) => {
  const [, { tutorEmail }] = queryKey;
  const res = await fetch(`https://learny-brown.vercel.app/api/session/tutor/${tutorEmail}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const sendRequestAgain = async (sessionId) => {
  const res = await fetch(`https://learny-brown.vercel.app/api/session/${sessionId}/request-approval`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function RequestSession() {
  const { usern } = useContext(AuthContext);

  
  if (!usern) {
    return (
      <div className="container   flex justify-center items-center">
        <p className="text-red-500 font-bold">You must be logged in to access.</p>
      </div>
    );
  }

  const { data: sessionsData, status, refetch } = useQuery({ // Add refetch to the returned values
    queryKey: ['sessions', { tutorEmail: usern.email }],
    queryFn: fetchSessions,
    retry: 3, // retry up to 3 times
  });

  const mutation = useMutation({
    mutationFn: sendRequestAgain,
    onSuccess: (data) => { // Add data as a parameter
      Swal.fire('Success!', data.message, 'success');
      refetch(); // Call refetch after the mutation
    },
    onError: (error) => {
      Swal.fire('Error!', 'Failed to book session. Please try again.', 'error');
    },
  });


  if (status === 'loading')
    return (
      <div className='container  '>
        <TchNav/>
        <div className='font-bold grid place-content-center mt-4'>
        Loading...
        </div>
      </div>
    );
  if (status === 'error')
      return (
        <div className='container  '>
          <TchNav/>
          <div className='font-bold grid place-content-center mt-4'>
          An error has occurred
          </div>
        </div>
      );
  if (!sessionsData || sessionsData.length === 0)
    return (
      <div className='container  '>
        <TchNav/>
        <div className='font-bold grid place-content-center mt-4'>
              No Session Created Yet
        </div>
      </div>
    );

  return (
    <div className='container   '>
      <TchNav/>
      <div className='flex flex-wrap gap-6 justify-around mt-6 md:mt-8'>
           {Array.isArray(sessionsData) && sessionsData.map((session) => (
        <div key={session._id}>
          <div className="p-6 bg-white rounded shadow-md plus w-72 border-2">
            <h2 className="text-xl font-bold mb-2 h-16 py-1 overflow-hidden">{session.sessionTitle}</h2>
            <p className='mb-2 text-blue-500'>${session.registrationFee}</p>
            <p className="text-gray-600 h-28 mb-4 overflow-auto py-2">{session.sessionDescription}</p>
            {session.status !== 'rejected' ? (
              <p className='font-bold text-blue-500'>{session.status}</p>
            ) : (
              <div>
              <button className= 'btn btn-sm mt-2 bg-red-400 hover:bg-red-300 rounded-md' onClick={() => mutation.mutate(session._id)}>
                Send Request Again
              </button>
              {session.feedback && session.rejectionReason && (
                <div className='mt-3 text-sm'>
                    <p className='mb-3 text-gray-800  '><span className='font-semibold'>Feedback: </span>{session.feedback}</p>
                    <p className="text-gray-800 "><span className='font-semibold'>Reason:</span> {session.rejectionReason}</p>
                </div>
              )}
          
              </div>
              
            )}
          </div>
        </div>
      ))}
      </div>
   
    </div>
  );
}

