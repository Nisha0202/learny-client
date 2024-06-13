import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const fetchMaterials = async ({ queryKey }) => {
  const [sessionId] = queryKey;
  const { data } = await axios.get(`http://localhost:5000/api/material/${sessionId}`);
  return data;
};

export default function BookedMaterials() {
  const { sessionId } = useParams();
  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', sessionId],
    queryFn: fetchMaterials,
  });
  

  if (isLoading)
    return (
      <div className='container min-h-[75vh]'>
   
        <div className='font-bold grid place-content-center mt-4'>
        Loading...
        </div>
      </div>
    );
  if (error)
      return (
        <div className='container min-h-[75vh]'>
          <div className='font-bold grid place-content-center mt-4'>
          An error has occurred
          </div>
        </div>
      );
      if (!materials || materials.length === 0)
        return (
            <div className='container min-h-[75vh]'>
              <div className='font-bold grid place-content-center mt-4'>
              No materials
              <Link to={"/booked-session-material"} className='text-blue-400 text-center py-4 font-normal'>Back</Link>
              </div>
              
            </div>
          );

  return (
    <div className='container min-h-[75vh]'>
           <div>
    <h1>Booked Materials</h1>
    {materials.map(material => (
      <div key={material._id}>
        <h2>{material.title}</h2>
        {material.image && <img src={material.image} alt={material.title} />}
        {material.link && <a href={material.link}>Link to Material</a>}
      </div>
    
    ))}
  </div>
  <div className='flex justify-end'>
  <Link to={"/booked-session-material"} className='text-blue-400 text-center py-4 font-normal'>Back</Link>
              </div>
    </div>
 
  );
}
