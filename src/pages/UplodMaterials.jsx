import React, { useState, useContext, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import Swal from 'sweetalert2';
import axios from 'axios';
import TchNav from '../components/TchNav';

const fetchSessions = async ({ queryKey }) => {
    const [, { tutorEmail }] = queryKey;
    const res = await fetch(`https://learny-brown.vercel.app/api/session/tutor/${tutorEmail}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

export default function UploadMaterials() {
    const { usern } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const dialogRef = useRef(null);

    if (!usern) {
        return (
          <div className="container min-h-[75vh] flex justify-center items-center">
            <p className="text-red-500 font-bold">You must be logged in to access.</p>
          </div>
        );
      }
      
    const { data: sessionsData, status } = useQuery({
        queryKey: ['sessions', { tutorEmail: usern?.email }],
        queryFn: fetchSessions,
        retry: 3,
        enabled: !!usern, // Only run query if usern is available
    });

    // Handle showing the dialog when a session is selected
    useEffect(() => {
        if (selectedSession && dialogRef.current) {
            dialogRef.current.showModal();
        } else if (dialogRef.current) {
            dialogRef.current.close();
        }
    }, [selectedSession]);

    const uploadImage = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGbb}`, formData);

        if (res.status !== 200) {
            throw new Error('Failed to upload image');
        }

        return res.data.data.url;
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const title = e.target.title.value;
        const imageFile = e.target.image.files[0];
        const link = e.target.link.value;

        let imageURL = "";

        if (imageFile) {
            imageURL = await uploadImage(imageFile);
        }

        const material = {
            title,
            sessionId: selectedSession._id,
            tutorEmail: selectedSession.tutorEmail,
            image: imageURL,
            link,
        };

        const res = await fetch('https://learny-brown.vercel.app/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(material),
        });

        setLoading(false);

        if (!res.ok) {
            Swal.fire('Error!', 'Please try again.', 'error');
            return;
        }

        Swal.fire('Success!', 'Material Uploaded!', 'success');
        setSelectedSession(null); // Close the dialog after submission
    };

    if (status === 'loading')
        return (
            <div className='container min-h-[75vh]'>
                <TchNav />
                <div className='font-bold grid place-content-center mt-4'>
                    Loading...
                </div>
            </div>
        );

    if (status === 'error')
        return (
            <div className='container min-h-[75vh]'>
                <TchNav />
                <div className='font-bold grid place-content-center mt-4'>
                    An error has occurred
                </div>
            </div>
        );

    if (!sessionsData || sessionsData.length === 0)
        return (
            <div className='container min-h-[75vh]'>
                <TchNav />
                <div className='font-bold grid place-content-center mt-4'>
                    No Session Created Yet
                </div>
            </div>
        );

    const approvedSessions = sessionsData ? sessionsData.filter(session => session.status === 'approved') : [];

    return (
        <div className='container min-h-[75vh]'>
            <TchNav />
            <div className='flex flex-wrap gap-6 justify-around mt-6 md:mt-8'>
                {Array.isArray(approvedSessions) && approvedSessions.length > 0 ? (
                    approvedSessions.map((session) => (
                        <div key={session._id}>
                            <div className="p-6 bg-white rounded shadow-md plus w-72 border-2">
                                <h2 className="text-xl font-bold mb-2 h-16 py-1 overflow-hidden">{session.sessionTitle}</h2>
                                <p className='mb-3 text-blue-500'>${session.registrationFee}</p>
                                <p className="text-gray-600 h-28 overflow-hidden">{session.sessionDescription}</p>
                                <button className='btn btn-sm bg-blue-400' onClick={() => setSelectedSession(session)}>
                                    Upload Material
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='font-bold'>No Session is approved.</p>
                )}

                {selectedSession && (
                    <dialog ref={dialogRef} id="my_modal_1" className="modal z-30">
                        <div className="modal-box p-6 flex flex-col justify-between items-center">
                            <div className='flex justify-between items-center w-full'>
                                <h3 className="font-bold text-lg">Upload Material</h3>
                                <button className="btn btn-sm" onClick={() => setSelectedSession(null)}>Close</button>
                            </div>

                            <form onSubmit={handleUploadSubmit} className='mt-4 space-y-4 text-sm max-w-md'>
                                <div className='space-y-2'>
                                    <label className='block font-medium'>Title:</label>
                                    <input name="title" className='border-2 border-gray-300 p-2 rounded w-full' type="text" required />
                                </div>

                                <div className='space-y-2'>
                                    <label className='block font-medium'>Study session ID:</label>
                                    <p className='border-2 border-gray-300 p-2 rounded'>{selectedSession._id}</p>
                                </div>

                                <div className='space-y-2'>
                                    <label className='block font-medium'>Tutor Email:</label>
                                    <p className='border-2 border-gray-300 p-2 rounded'>{selectedSession.tutorEmail}</p>
                                </div>

                                <div className='space-y-2'>
                                    <label className='block font-medium'>Image:</label>
                                    <input name="image" className='border-2 input border-gray-300 p-2 rounded' type="file" />

                                </div>

                                <div className='space-y-2'>
                                    <label className='block font-medium'>Drive link:</label>
                                    <input name="link" className='border-2 border-gray-300 p-2 rounded w-full' type="url" />
                                </div>

                            
                                        <button type='submit' className="btn w-full rounded-md text-white hover:bg-blue-800 bg-blue-700 font-bold">Upload Material</button>
                                   
                            </form>
                            {loading && (
                                        <div className="absolute inset-0 flex justify-center my-2 items-center">
                                            <div className="loading loading-ring loading-xl text-indigo-500"></div>
                                        </div>
                                    ) }
                        </div>
                    </dialog>
                )}
            </div>
        </div>
    );
}
