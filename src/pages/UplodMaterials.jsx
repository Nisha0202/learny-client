import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';

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

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
  
    // Get the form data
    const title = e.target.elements[0].value;
    const imageFile = e.target.elements[3].files[0];
    const link = e.target.elements[4].value;
  
    // Upload the image to ImgBB and get the image URL
    const imageURL = await uploadImage(imageFile);
  
    // Create the material object
    const material = {
      title,
      sessionId: session._id,
      tutorEmail: session.tutorEmail,
      image: imageURL,
      link,
    };
  
    // Send a POST request to your server to save the material
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
  
    if (!res.ok) {
      throw new Error('Failed to upload material');
    }
  
    // Optionally, you can show a success message or do something else here
  };
  
  
  if (status === 'loading') {
    return <div className='container grid place-item-center'> Loading...</div>;
  }

  if (status === 'error') {
    return <div className='container grid place-item-center'>Error fetching data: {error.message}</div>;
  }

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
              <button className= 'btn btn-sm bg-blue-400'  onClick={() => document.getElementById('my_modal_1').showModal()}>
                Upload Material
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No data is approved.</p>
      )}

<dialog id="my_modal_1" className="modal">
  <div className="modal-box">
    <div className='flex justify-between items-center'>
      <h3 className="font-bold text-lg">Upload Material</h3>   
      <form method="dialog">
        <button className="btn">Close</button>
      </form>
    </div>

    <div className="modal-action">
      <form method="dialog" onSubmit={handleUploadSubmit} className='flex flex-col items-start gap-3'>
        <label>
          Title:
          <input className='border-2' type="text" required />
        </label>

        <label>
          Study session ID: {session._id} (read-only)
        </label>

        <label>
          Tutor Email: {session.tutorEmail} (read-only)
        </label>

        <label>
          Image Upload:
          <input className='border-2' type="file" required />
        </label>

        <label>
          Link (Google Drive link):
          <input className='border-2' type="url" required />
        </label>

        <button className='btn btn-md bg-blue-800 text-white' type="submit">Upload Material</button>
      </form>
    </div>
  </div>
</dialog>

    </div>
  );
}
