import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver'

// Define the fetchMaterials function correctly
const fetchMaterials = async ({ queryKey }) => {
  const [, sessionId] = queryKey;
  try {
    console.log("hello");
    const { data } = await axios.get(`http://localhost:5000/api/material/${sessionId}`);
    return data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error;
  }
};


export default function BookedMaterials() {
  const { sessionId } = useParams();
  console.log("please");

  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', sessionId],
    queryFn: fetchMaterials,
    enabled: !!sessionId, // Ensure the query runs only if sessionId is available
  });



  const downloadImage = (imageUrl) => {
    saveAs(imageUrl, 'image.jpg');
  }
  


  if (isLoading)
    return (
      <div className='container min-h-[75vh]'>
        <div className='font-bold grid place-content-center mt-4'>Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className='container min-h-[75vh]'>
        <div className='font-bold grid place-content-center mt-4'>An error has occurred</div>
      </div>
    );

  if (!materials || materials.length === 0)
    return (
      <div className='container min-h-[75vh]'>
        <div className='font-bold grid place-content-center mt-4'>No materials</div>
        <Link to={"/booked-session-material"} className='text-blue-400 text-center py-4 font-normal'>Back</Link>
      </div>
    );

  return (
    <div className='container min-h-[75vh]'>
      <div className=' mt-6 md:mt-8'>
        <h1>Booked Materials</h1>

        <div className=' mt-6 md:mt-8'>
          {Array.isArray(materials) && materials.map(material => (
            <div key={material._id} className='w-full  flex flex-col md:flex-row gap-8 border-2 p-4 mt-2'>
              <div className='flex flex-col gap-3 min-w-44'>
                <h2 className='font-bold text-wrap text-lg'>{material.title}</h2>
                {material.link && <a href={material.link} className='text-blue-500' target="_blank" rel="noopener noreferrer">View Google Drive Link</a>}
              </div>
              {material.image && (
                <div>
                  <img src={material.image} className='w-24 h-24 object-contain border-2' alt='Material' />

                  <div className='btn btn-sm mt-2' onClick={() => downloadImage(material.image)}>Download!</div>


                </div>
              )}








            </div>
          ))}
        </div>
        <div className='flex justify-end'>
          <Link to={"/booked-session-material"} className='btn w-64 text-blue-400 text-center mt-3 font-normal'>Back</Link>
        </div>
      </div>
    </div>
  );
}
