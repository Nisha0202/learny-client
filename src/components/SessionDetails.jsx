import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const fetchSession = async ({ queryKey }) => {
  const [, id] = queryKey;
  const res = await axios.get(`http://localhost:5000/api/session/${id}`);
  return res.data;
};
const bookSession = async ({ sessionId, userEmail, tutorEmail }) => {
  const res = await axios.post(`http://localhost:5000/api/bookedSession`, {
    sessionId,
    userEmail,
    tutorEmail,
  });
  return res.data;
};
const SessionDetails = () => {
  const { id } = useParams();
  const { usern } = useContext(AuthContext);
  const [redirectToPayment, setRedirectToPayment] = useState(false);

  const { data: session, isLoading, isError } = useQuery({
    queryKey: ['session', id],
    queryFn: fetchSession
  });
  const mutation = useMutation({
    mutationFn: bookSession,
    onSuccess: (data) => {
      Swal.fire('Success!', data.message, 'success');
    },
    onError: (error) => {
      Swal.fire('Error!', 'Failed to book session. Please try again.', 'error');
    },
  });

  const handleBookNow = () => {
    if (session.registrationFee !== "Free") {
      setRedirectToPayment(true);
    } else {
      mutation.mutate({ sessionId: id, userEmail: usern.email, tutorEmail: session.tutorEmail });
    }
  };

  if (isLoading) return <div className='container grid place-content-center'>Loading...</div>;
  if (isError || !session) return <div className='container grid place-content-center'>Error fetching data</div>;
  return (
    <div className='container my-12'>
      <div className="plus  mx-auto flex flex-col gap-3">
        <h2 className="text-2xl font-bold mb-1 mt-4">{session.sessionTitle}</h2>
        <p className="text-gray-600 text-sm">{session.sessionDescription}</p>
        <div className='flex flex-col md:flex-row my-4 justify-between items-center'>
          <p>Tutor: <span className='font-bold text-lg text-blue-700'>{session.tutorName}</span></p>
          <p>Average Rating: <span className='font-bold text-lg text-indigo-500'>{session.averageRating}</span> </p></div>

        <div className='flex flex-col gap-4 text-sm'>
          <p>Registration Start Date: {" "}{session.registrationStartDate}</p>
          <p className='border-2 max-w-72 border-blue-400 py-2 px-1'>Registration End Date: {" "} {session.registrationEndDate}</p>
          <p>Class Start Date: {" "} {session.classStartDate}</p>
          <p>Class End Date:{" "} {session.classEndDate}</p>
          <p>Session Duration:{" "} {session.sessionDuration}</p>
          <p>Registration:
            <span className='text-indigo-500 font-bold'> {session.registrationFee}</span></p>
        </div>
        <div className='flex flex-col gap-3 mt-4'>
          <h3 className='text-lg font-bold'>Reviews:</h3>
          {session.reviews.map((review, index) => (
            <div key={index} className="flex items-center gap-2">
              <FaUserCircle className="text-blue-500" />
              <p className="font-bold">{review.studentName}:</p>
              <p>{review.review}</p>
            </div>
          ))}
        </div>
        <div className='flex justify-end mb-2'>
          <button
            disabled={!session.isRegistrationOpen || usern.role === 'admin' || usern.role === 'tutor'}
            onClick={handleBookNow}
            className={`mt-2 w-64 font-bold py-2 px-2 text-white rounded ${session.isRegistrationOpen ? 'bg-blue-700' : 'bg-red-700'}`}  >
            {session.isRegistrationOpen ? 'Book Now' : 'Registration Closed'}
          </button>
        </div>

      </div>
    </div>

  );
};

export default SessionDetails;
