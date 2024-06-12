import React, { useState, useContext, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import Swal from 'sweetalert2';
import axios from 'axios';


const fetchSessions = async ({ queryKey }) => {
    const [, { tutorEmail }] = queryKey;
    const res = await fetch(`http://localhost:5000/api/session/tutor/${tutorEmail}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

export default function UploadMaterials() {
    const { usern } = useContext(AuthContext);
    const { data: sessionsData, status } = useQuery({
        queryKey: ['sessions', { tutorEmail: usern.email }],
        queryFn: fetchSessions,
        retry: 3, // retry up to 3 times
    });

    const [selectedSession, setSelectedSession] = useState(null); // State to keep track of the selected session
    const dialogRef = useRef(null);

    useEffect(() => {
        if (selectedSession && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [selectedSession]);

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGbb}`, formData);

    if (res.status !== 200) {
        throw new Error('Failed to upload image');
    }

    return res.data.data.url; // The URL of the uploaded image
};



    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        // Get the form data
        const title = e.target.title.value;
        const imageFile = e.target.image.files[0];
        const link = e.target.link.value;

        // Upload the image to ImgBB and get the image URL
        let imageURL = "";

        if (imageFile) {
            imageURL = await uploadImage(imageFile);
          }



        // Create the material object
        const material = {
            title,
            sessionId: selectedSession._id, // Use selectedSession._id here
            tutorEmail: selectedSession.tutorEmail, // Use selectedSession.tutorEmail here
            image: imageURL,
            link,
        };

        // Send a POST request to your server to save the material
        const res = await fetch('http://localhost:5000/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(material),
        });

        if (!res.ok) {
            document.getElementById('my_modal_1').close();
            Swal.fire('Error!', ' Please try again.', 'error');
         throw new Error('Failed to upload material');
    }
          
          document.getElementById('my_modal_1').close();  
        Swal.fire('Success!', 'Material Uploaded!', 'success');


    };

    if (status === 'loading') {
        return <div className='container grid place-item-center'> Loading...</div>;
    }

    if (status === 'error') {
        return <div className='container grid place-item-center'>Error fetching data: {error.message}</div>;
    };

    const approvedSessions = sessionsData ? sessionsData.filter(session => session.status === 'approved') : [];

    return (
        <div className='container flex flex-wrap gap-6 justify-around'>
            {Array.isArray(approvedSessions) && approvedSessions.length > 0 ? (
                approvedSessions.map((session) => (
                    <div key={session._id}>
                        <div className="p-6 bg-white rounded shadow-md plus w-80 border-2">
                            <h2 className="text-xl font-bold mb-2 max-h-14 py-1">{session.sessionTitle}</h2>
                            <p className='mb-3 text-blue-500'>${session.registrationFee}</p>
                            <p className="text-gray-600 h-24 overflow-hidden">{session.sessionDescription}</p>
                            <button className='btn btn-sm bg-blue-400' onClick={() => setSelectedSession(session)}>
                                Upload Material
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No data is approved.</p>
            )}

            {selectedSession && (
                <dialog ref={dialogRef} id="my_modal_1" className="modal z-30">
                    <div className="modal-box">
                        <div className='flex justify-between items-center'>
                            <h3 className="font-bold text-lg">Upload Material</h3>
                            <button className="btn" onClick={() => setSelectedSession(null)}>Close</button>
                        </div>

                        <div className="modal-action">
                            <form method="dialog" onSubmit={handleUploadSubmit} className='w-full flex flex-col items-start gap-3'>
                                <label>
                                    Title:
                                </label>
                                <input name="title" className='border-2' type="text" required />

                                <div className='flex flex-col gap-2'>
                                    <label>
                                        Study session ID:
                                    </label>
                                    {selectedSession._id}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label>
                                        Tutor Email:
                                    </label>
                                    {selectedSession.tutorEmail}
                                </div>



                                <label>
                                    Image:

                                </label>
                                <input name="image" className='border-2 max-w-64' type="file" />
                                <label>
                                    Drive link:
                                </label>
                                <input name="link" className='border-2 w-64' type="url"/>

                                <button className='btn btn-md bg-blue-800 text-white' type="submit">Upload Material</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            )}



        </div>

    );
}
