
import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

// const fetchSession = async ({ queryKey }) => {
//     const [, id] = queryKey;
//     const res = await axios.get(`http://localhost:5000/api/session/${id}`);
//     return res.data;
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

const ViewDetails = () => {
    const { id } = useParams();
    const { usern } = useContext(AuthContext);
    const queryClient = useQueryClient();
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

    // Add useState hooks for review and rating
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);


    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        console.log(id);
        try {
            // Send a POST request to your server with the review and rating
            await axios.post(`http://localhost:5000/api/review`, {
                sessionId: id,
                userEmail: usern.email,
                userName: usern.displayName,
                review,
                rating
            });
            // Clear the form
            setReview('');
            setRating(0);
            // Re-fetch the session data to update the reviews
            queryClient.invalidateQueries(['session', id]);
        
            document.getElementById('my_modal_1').close();
            // Show a success alert
            Swal.fire('Success!', 'Your review has been submitted.', 'success');
        } catch (error) {
            console.error('Error submitting review:', error);
            document.getElementById('my_modal_1').close();
            // Show an error alert
            Swal.fire('Error!', 'There was an error submitting your review. Please try again.', 'error');
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
                        <p>More: {session.otherInfo}</p>
                </div>
                <div className='flex flex-col gap-3 mt-4'>
                    <h3 className='text-lg font-bold'>Reviews:</h3>
                    {session.reviews.map((review, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <FaUserCircle className="text-blue-500" />
                            <p className="font-bold">{review.userName}:</p>
                            <p>{review.review}</p>
                        </div>
                    ))}
                </div>
                <div className='flex mt-2'>

                    <button className='btn btn-md bg-blue-600 text-white' onClick={() => document.getElementById('my_modal_1').showModal()}>
                        Review Session
                    </button>


                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <div className='flex justify-between items-center'>
                                <h3 className="font-bold text-lg">Review</h3>   
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>

                            <div className="modal-action">
                            
                                    <form method="dialog" onSubmit={handleReviewSubmit} className='flex flex-col items-start gap-3'>
                                        <label>
                                            Review:
                                            <input className='border-2' type="text" value={review} onChange={(e) => setReview(e.target.value)} required />
                                        </label>

                                        <label>
                                            Rating:
                                            <input className='border-2' type="number"step="0.1" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} required />/5
                                        </label>
                                        <button className='btn btn-md bg-blue-800 text-white' type="submit">Submit Review</button>
                                    </form>

                            </div>
                        </div>
                    </dialog>


                </div>
            </div>
        </div>

    );
};

export default ViewDetails;
