// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// const fetchBookedMaterials = async () => {
//   const { data: bookedSessions } = await axios.get('http://localhost:5000/api/bookedSession');
//   const bookedSessionIds = bookedSessions.map(session => session.sessionId);
//   const { data: materials } = await axios.get('http://localhost:5000/api/materials');
//   return materials.filter(material => bookedSessionIds.includes(material.sessionId));
// };

// const ViewBookedMaterial = () => {
//   const { data: bookedMaterials, isLoading, error } = useQuery('bookedMaterials', fetchBookedMaterials);

//   if (isLoading) return 'Loading...';
//   if (error) return 'An error has occurred: ' + error.message;

//   return (
//     <div>
//       {bookedMaterials.map(material => (
//         <div key={material._id.$oid}>
//           <h2>{material.title}</h2>
//           <img src={material.image} alt={material.title} />
//           <a href={material.image} download>Download Image</a>
//           {material.link && <a href={material.link} target="_blank" rel="noopener noreferrer">Visit Google Drive Link</a>}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ViewBookedMaterial;


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StdNav from '../components/StdNav';

const fetchSessions = async ({ queryKey }) => {
  const [userEmail] = queryKey;
  const { data } = await axios.get(`http://localhost:5000/api/bookedSession?userEmail=${userEmail}`);
  return data;
};

const ViewBookedMaterial = () => {
  const navigate = useNavigate();
  const { usern } = useContext(AuthContext);
  

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: [usern.email],
    queryFn: fetchSessions,
  });


  const viewDetails = (sessionId) => {
    if (!usern) {
      navigate('/login');
    } else {
      navigate(`/viewdetails/${sessionId}`);
    }
  };

  if (isLoading)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav/>
        <div className='font-bold grid place-content-center mt-4'>
        Loading...
        </div>
      </div>
    );
  if (error)
      return (
        <div className='container min-h-[75vh]'>
          <StdNav/>
          <div className='font-bold grid place-content-center mt-4'>
          An error has occurred
          </div>
        </div>
      );
  if (!sessions || sessions.length === 0)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav/>
        <div className='font-bold grid place-content-center mt-4'>
              No Notes Yet
        </div>
      </div>
    );
  


  return (
    <div className='container min-h-[75vh]'>
      <StdNav/>
      <div className='flex flex-col lg:flex-wrap lg:flex-row items-center justify-around gap-6 mt-6 md:mt-8'>
           {sessions.map(session => {
        const desc = session.sessionDetails.sessionDescription.split(' ').slice(0, 13).join(' ');
  
        return (
          <div key={session._id} className=' '>
            <div className="p-6 bg-white rounded shadow-md plus w-80 h-72 border-2">
              <h2 className="text-xl font-bold mb-2">{session.sessionDetails.sessionTitle}</h2>
              <p className='mb-3 text-blue-500'>{session.sessionDetails.registrationFee}</p>
              <p className="text-gray-600 h-24">{desc}...</p>
              <div className='w-full flex justify-between mt-auto'>
                <button className='bg-blue-500 btn text-white font-semibold' onClick={() => viewDetails(session.sessionDetails._id)}>View Details</button>
              </div>
            </div>
          </div>
        );
      })}
      </div>
   
    </div>
  );
  


};

export default ViewBookedMaterial ;
