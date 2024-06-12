import React, { useContext } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';

const fetchSessions = async ({ queryKey }) => {
  const [, { tutorEmail }] = queryKey;
  const res = await fetch(`http://localhost:5000/api/session/tutor/${tutorEmail}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const sendRequestAgain = async (sessionId) => {
  const res = await fetch(`http://localhost:5000/api/session/${sessionId}/request-approval`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function RequestSession() {
  const { usern } = useContext(AuthContext);
  const { data: sessionsData, status } = useQuery({
    queryKey: ['sessions', { tutorEmail: usern.email }],
    queryFn: fetchSessions,
    retry: 3, // retry up to 3 times
  });

  const mutation = useMutation({
    mutationFn: sendRequestAgain,
    onSuccess: () => {
      Swal.fire('Success!', data.message, 'success');
    },
    onError: (error) => {
      Swal.fire('Error!', 'Failed to book session. Please try again.', 'error');
    },
  });

  return (
    <div className='container flex flex-wrap gap-6 justify-around'>
      {Array.isArray(sessionsData) && sessionsData.map((session) => (
        <div key={session._id}>
          <div className="p-6 bg-white rounded shadow-md plus w-80 border-2">
            <h2 className="text-xl font-bold mb-2 max-h-14 py-1">{session.sessionTitle}</h2>
            <p className='mb-3 text-blue-500'>${session.registrationFee}</p>
            <p className="text-gray-600 h-24 overflow-hidden">{session.sessionDescription}</p>
            {session.status !== 'rejected' ? (
              <p className='font-bold text-blue-500'>{session.status}</p>
            ) : (
              <button className= 'btn btn-sm bg-red-400' onClick={() => mutation.mutate(session._id)}>
                Send Request Again
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
