import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import AdmNav from '../components/AdmNav';
import axios from 'axios';

const StudySessionCard = ({ session }) => {
    const { usern } = useContext(AuthContext);
    const currentDate = new Date();
    const registrationEndDate = new Date(session.registrationEndDate);
    const isRegistrationOpen = currentDate <= registrationEndDate;
    const navigate = useNavigate();
    const [approveModalIsOpen, setApproveModalIsOpen] = useState(false);
    const [rejectModalIsOpen, setRejectModalIsOpen] = useState(false);
    const [sessionFee, setSessionFee] = useState(0);
    const [isPaid, setIsPaid] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleDelete = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/sessions/${session._id}`)
                        .then(response => {
                            console.log(response);
                            Swal.fire('Deleted!', 'Session has been deleted.', 'success');
                            setTimeout(function(){
                                window.location.reload();
                            }, 1000);
                        })
                        .catch(error => {
                            console.error(error);
                            Swal.fire('Error!', 'Deletion failed!', 'error');
                        });
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Error occured!', 'error');
                }
            }
        })
    };
    
    const openApproveModal = () => {
        setApproveModalIsOpen(true);
    };

    const closeApproveModal = () => {
        setApproveModalIsOpen(false);
    };

    const openRejectModal = () => {
        setRejectModalIsOpen(true);
    };

    const closeRejectModal = () => {
        setRejectModalIsOpen(false);
    };

    const handleApprove = async () => {
        try {
            await axios.put(`http://localhost:5000/api/sessions/${session._id}`, { status: 'approved', registrationFee: isPaid ? sessionFee : 0 })
                .then(response => {
                    console.log(response);
                    Swal.fire('Success!', 'Session approved!', 'success');
                    closeApproveModal();
                    setTimeout(function(){
                        window.location.reload();
                    }, 1200);
                    

                })
                .catch(error => {
                    console.error(error);
                    Swal.fire('Error!', 'Approval failed!', 'error');
                });
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', 'Error occured!', 'error');
        }
    };

    const handleReject = async () => {
        try {
            await axios.put(`http://localhost:5000/api/sessions/${session._id}`, { status: 'rejected', rejectionReason, feedback })
                .then(response => {
                    console.log(response);
                    Swal.fire('Success!', 'Session rejected!', 'success');
                    closeRejectModal();
                    setTimeout(function(){
                        window.location.reload();
                    }, 1000);
                    
                })
                .catch(error => {
                    console.error(error);
                    Swal.fire('Error!', 'Rejection failed!', 'error');
                });
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', 'Error occured!', 'error');
        }
    };

    const handleUpdate = () => {
        // Navigate to the update page for this session
        console.log(session._id);
        navigate(`/update-session/${session._id}`);
    };
    return (
        <div className="p-6 bg-white rounded shadow-md plus w-80 border-2">
            <h2 className="text-xl font-bold mb-2 h-14 py-1">{session.sessionTitle}</h2>
            <p className='mb-3 text-blue-500'>${session.registrationFee}</p>
            <p className="text-gray-600 h-24 overflow-hidden">{session.sessionDescription.split(' ').slice(0, 13).join(' ')}...</p>
            <div className='w-full flex items-start justify-between mt-auto'>
                <button className={`mt-2 font-bold py-1  rounded ${isRegistrationOpen ? 'text-green-700' : 'text-red-700'}`}>
                    {isRegistrationOpen ? 'Ongoing' : 'Closed'}
                </button>
                {session.status === 'approved' && (
            <div className='flex flex-col gap-4 justify-end'>
                <button className="mt-2 py-1 btn btn-sm  rounded hover:text-blue-700 font-bold">{session.status}</button>
                <div className='flex flex-col md:flex-row gap-4 justify-end'>
                    <button onClick={handleUpdate} className='mt-2 py-1 btn btn-sm rounded hover:text-blue-700 font-bold'>Update</button>
                    <button onClick={handleDelete} className='mt-2 py-1 btn btn-sm rounded hover:text-red-700 font-bold'>Delete</button>
                </div>
            </div>
        )}
        {session.status === 'pending' && (
            <div className='flex flex-col gap-4 justify-end'>
                <button className="mt-4 py-1 btn btn-sm  rounded hover:text-blue-700 font-bold">{session.status}</button>
                <div className='flex flex-col md:flex-row gap-4'>
                    <button onClick={openApproveModal} className='mt-2 py-1 btn btn-sm rounded hover:text-blue-700 font-bold'>approve?</button>
                    <button onClick={openRejectModal} className='mt-2 py-1 btn btn-sm rounded hover:text-red-700 font-bold'>reject?</button>
                </div>
            </div>
        )}
        {session.status !== 'approved' && session.status !== 'pending' && (
            <div>
                <button className="mt-2 py-1 btn btn-sm  rounded hover:text-blue-700 font-bold">{session.status}</button>
            </div>
        )}
            </div>

            <Modal 
                isOpen={approveModalIsOpen} 
                onRequestClose={closeApproveModal}
                style={{
                    content: {
                        width: '240px',
                        height: '450px',
                        margin: 'auto auto', // This will center the modal
                    },
                }}
            >
                <div className='grid place-content-center'>
                    <h2 className='text-lg '>Approve Session</h2>
                    <div className='flex flex-col gap-6 my-6'>
                        <label>
                            <input type="radio" checked={!isPaid} onChange={() => setIsPaid(false)} />
                            Free?
                        </label>
                        <label>
                            <input className='' type="radio" checked={isPaid} onChange={() => setIsPaid(true)} />
                            Paid?
                        </label>
                        {isPaid && (
                            <label>
                                Session Fee:
                                <input className='p-2 border-2' type="number" step={0.1} value={sessionFee} onChange={(e) => setSessionFee(e.target.value)} />
                            </label>
                        )}
                    </div>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <button className='btn btn-sm bg-blue-400' onClick={handleApprove}>Approve</button>
                        <button className='btn btn-sm' onClick={closeApproveModal}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal 
                isOpen={rejectModalIsOpen} 
                onRequestClose={closeRejectModal}
                style={{
                    content: {
                        width: '240px',
                        height: '450px',
                        margin: 'auto auto', // This will center the modal
                    },
                }}
            >
                <div className='grid place-content-center'>
                    <h2 className='text-lg '>Reject Session</h2>
                    <div className='flex flex-col gap-6 my-6'>
                        <label>
                            Rejection Reason:
                            <input className='p-2 border-2' type="text" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                        </label>
                        <label>
                            Feedback:
                            <input className='p-2 border-2' type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                        </label>
                    </div>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <button className='btn btn-sm bg-red-400' onClick={handleReject}>Reject</button>
                        <button className='btn btn-sm' onClick={closeRejectModal}>Cancel</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};





//al session
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


const AllSessions = () => {
    const [displayCount, setDisplayCount] = useState(3);
    const { data: sessionsData, status } = useQuery({
        queryKey: ['sessions'],
        queryFn: fetchSessions,
        retry: 3, // retry up to 3 times
    });


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
    if (!sessionsData || !Array.isArray(sessionsArray)) {
        console.error('sessionsData is not an array or is null/undefined');
        return <div className='container grid place-item-center'>Loading</div>;
    }

    return (
        <div className='container grid place-item-center gap-8'>
            <AdmNav />
            <div className='flex flex-wrap justify-evenly gap-4'>
                {sessionsArray.map((session, index) => (
                    <StudySessionCard key={index} session={session} />
                ))}
            </div>
    

        </div>
    );

};

export default AllSessions;






