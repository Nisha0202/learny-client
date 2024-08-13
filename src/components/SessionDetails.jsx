import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PaymentModal from './PaymentModal';

const SessionDetails = () => {
  const { id } = useParams();
  const { usern } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  const fetchSession = async ({ queryKey }) => {
    const [, id] = queryKey;
    const sessionRes = await axios.get(`https://learny-brown.vercel.app/api/session/${id}`);
    const reviewsRes = await axios.get(`https://learny-brown.vercel.app/api/review/${id}`);
    return { ...sessionRes.data, reviews: reviewsRes.data };
  };

  const bookSession = async ({ sessionId, userEmail, tutorEmail }) => {
    const res = await axios.post(`https://learny-brown.vercel.app/api/bookedSession`, {
      sessionId,
      userEmail,
      tutorEmail,
    });
    return res.data;
  };

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
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
  const navigate = useNavigate();
  const setRedirectToPayment = () => {
    navigate(`/payment/${session._id}`);
  }
  const { data: session, isLoading, isError } = useQuery({
    queryKey: ['session', id],
    queryFn: fetchSession
  });
  const mutation = useMutation({
    mutationFn: bookSession,
    onSuccess: (data) => {
      Swal.fire('Success!', data.message, 'success');
      setIsButtonDisabled(false);
    },
    onError: (error) => {
      setIsButtonDisabled(false);
      Swal.fire('Error!', 'Failed to book session. Please try again.', 'error');
    },
  });
  const handleBookNow = () => {
    setIsButtonDisabled(true);
    if (session.registrationFee !== "Free" && session.registrationFee !== 0) {
      openPaymentModal();
      setIsButtonDisabled(false);
    } else {
      mutation.mutate({ sessionId: id, userEmail: usern.email, tutorEmail: session.tutorEmail });
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    mutation.mutate({ sessionId: id, userEmail: usern.email, tutorEmail: session.tutorEmail });
    closePaymentModal();
  };


  if (isLoading) return <div className='container min-h-screen grid place-content-center font-semibold mt-4'>Loading...</div>;
  if (isError || !session) return <div className='container min-h-screen grid place-content-center font-semibold'>Error fetching data</div>;
  let averageRating = 0;
  if (session && session.reviews) {
    averageRating = session.reviews.reduce((total, review) => total + review.rating, 0) / session.reviews.length;
  }
  const currentDate = new Date();
  const registrationEndDate = new Date(session.registrationEndDate);
  const isRegistrationOpen = currentDate <= registrationEndDate; 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };


  return (
    <div className='min-h-custom container flex flex-col item-center justify-center'>

      <div className='w-full flex flex-col gap-4 lg:flex-row'>
        <div className='w-full lg:w-2/3'>
          <div className='w-full title mb-8'>
            <h2 className="text-2xl font-bold mb-1">{session.sessionTitle}</h2>
            <p className=" mt-2 max-w-xl">{session.sessionDescription}</p>
          </div>


          <div className='flex flex-col gap-4 text-sm border-2 p-6 w-80 rounded card shadow '>
            <div className='w-full'>
              <h1 className='font-semibold text-blue-600'>Registration</h1>
              <p className='font-semibold mt-1'> {formatDate(session.registrationStartDate)}-{formatDate(session.registrationEndDate)}</p>
            </div>

            <div className='w-full '>
              <h1 className='font-semibold text-blue-600'>Class</h1>
              <p className='font-semibold mt-1'> {formatDate(session.classStartDate)}-{formatDate(session.classEndDate)}</p>
            </div>

            <div className='w-full '>
              <h1 className='font-semibold text-blue-600'>Session Duration</h1>
              <p className='font-semibold mt-1'>{session.sessionDuration} </p>
            </div>
            <div className='border-2 w-20 rounded p-1'>
              <h1 className='font-semibold '>Fee <span className='text-indigo-500 ms-1 font-bold'> ${session.registrationFee}</span></h1>
            </div>



          </div>
          <div className='flex gap-4 justify-between max-w-xl w-full items-center mt-8 lg:mt-12 button'>
            <Link to={"/"} className=' w-full font-bold py-2 px-2 bg-gray-300 hover:bg-gray-400 rounded grid place-content-center'>
              Back
            </Link>
            <div className='flex justify-end w-full'>
              {role !== 'student' ? (
                <button
                  disabled
                  className=" w-full font-bold py-2 px-2 bg-gray-400 text-black rounded">
                  Book Now
                </button>
              ) : isRegistrationOpen ? (
                <button
                  onClick={handleBookNow}
                  disabled={isButtonDisabled} // Use the state variable here
                  className="w-full font-bold py-2 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                  Book Now
                </button>
              ) : (
                <button
                  disabled
                  className=" w-full font-bold py-2 px-2 bg-red-600 text-white rounded">
                  Closed
                </button>
              )}
            </div>
          </div>

        </div>

        <div className='w-full lg:w-1/3 mt-2 flex flex-col'>

          <div className='flex justify-between w-full'>
            <div className='w-full'>
              <h1 className='font-semibold text-blue-600'>Tutor</h1>
              <p className=' mt-1'> {session.tutorName}</p>
            </div>
            <div className='w-full'>
              <h1 className='font-semibold text-blue-600'>Average Rating</h1>
              <p className=' mt-1'> {averageRating ? averageRating : 0} </p>
            </div>
          </div>
          <div className='reveiw text-base mt-4 lg:mt-8'>

            <h3 className='my-2 font-semibold'>Reviews:</h3>
            <div className='flex flex-wrap gap-4 border-2 p-4 w-80 rounded'>

              {session.reviews && session.reviews.length > 0 ? (
                session.reviews.map((review, index) => (
                  <div key={index} className="flex flex-col gap-2 ">
                    <div className='flex item-center gap-2'>
                      <FaUserCircle className="text-blue-500 text-xl" />
                      <p className="font-bold text-base/tight overflow-hidden max-w-72">{review.userName}</p>
                    </div>

                    <div className='ps-6'>
                      <div className='text-start text-sm mt-1 text-wrap'>"{review.review}"</div>
                    </div>

                  </div>
                ))
              ) : (
                <p>No Review Yet</p>
              )}
            </div>


          </div>


        </div>


      </div>

      <div className='w-full mt-6'>
              <h1 className='font-semibold'>More</h1>
              <p className='max-w-xl mt-1'>{session.otherInfo}</p>
            </div>

    
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onRequestClose={closePaymentModal}
          session={session}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );

















};
export default SessionDetails;




