import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// const fetchSession = async ({ queryKey }) => {
//   const [, id] = queryKey;
//   const res = await axios.get(`http://localhost:5000/api/session/${id}`);
//   return res.data;
// };

const fetchSession = async ({ queryKey }) => {
  const [, id] = queryKey;
  const sessionRes = await axios.get(`http://localhost:5000/api/session/${id}`);
  const reviewsRes = await axios.get(`http://localhost:5000/api/review/${id}`);
  return { ...sessionRes.data, reviews: reviewsRes.data };
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
  const [role, setRole] = useState('');
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setRole(role);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log('User role:', decodedToken.role);
        setRole(decodedToken.role);
      }
    }
  }, [usern]);
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
    if (session.registrationFee !== "Free" || session.registrationFee !== 0) {
      setRedirectToPayment(true);
    } else {
      mutation.mutate({ sessionId: id, userEmail: usern.email, tutorEmail: session.tutorEmail });
    }
  };

  if (isLoading) return <div className='container grid place-content-center'>Loading...</div>;
  if (isError || !session) return <div className='container grid place-content-center'>Error fetching data</div>;

    // Move the averageRating calculation here, after session data is fetched
    let averageRating = 0;
    if (session && session.reviews) {
      averageRating = session.reviews.reduce((total, review) => total + review.rating, 0) / session.reviews.length;
    }

  const currentDate = new Date();
  const registrationEndDate = new Date(session.registrationEndDate);
  const isRegistrationOpen = currentDate <= registrationEndDate;

  return (
    <div className='container my-12'>
      <div className="plus  mx-auto flex flex-col gap-3">
        <h2 className="text-2xl font-bold mb-1 mt-4">{session.sessionTitle}</h2>
        <p className="text-gray-600 text-sm">{session.sessionDescription}</p>
        <div className='flex flex-col md:flex-row my-4 justify-between items-center'>
          <p>Tutor: <span className='font-bold text-lg text-blue-700'>{session.tutorName}</span></p>
          {/* <p>Average Rating: <span className='font-bold text-lg text-indigo-500'>{session.averageRating}</span> </p> */}
          
          <p>Average Rating: <span className='font-bold text-lg text-indigo-500'>
            {averageRating ? averageRating : session.averageRating}
            </span> </p>
          
          </div>
        
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
{session.reviews && session.reviews.length > 0 ? (
  session.reviews.map((review, index) => (
    <div key={index} className="flex items-center gap-2">
      <FaUserCircle className="text-blue-500" />
      <p className="font-bold">{review.userName}:</p>
      <p>{review.review}</p>
    </div>
  ))
) : (
  <p>No Review Yet</p>
)}
</div>

        <div className='flex justify-end mb-2'>
      
if (role !== 'student') {
  <button
  disabled
  className="mt-2 w-64 font-bold py-2 px-2 text-black rounded">
 Book Now
</button>
}else if(isRegistrationOpen){
   <button
   className="mt-2 w-64 font-bold py-2 px-2 bg-blue-500 text-white rounded">
  Book Now
 </button>
}else{
  <button
   className="mt-2 w-64 font-bold py-2 px-2 bg-red-500 text-white rounded">
   Registration Closed
 </button>
}



        </div>

      </div>
    </div>

  );
};

export default SessionDetails;
