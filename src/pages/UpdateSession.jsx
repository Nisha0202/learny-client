import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';


const UpdateSession = () => {
  const [session, setSession] = useState(null);
  const { sessionId } = useParams();
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`https://learny-brown.vercel.app/api/sessions/${sessionId}`);
        setSession(response.data);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);

const handleUpdate = async () => {

    try {
        const { _id, ...updateData } = session;   
         const response = await axios.put(`https://learny-brown.vercel.app/api/sessions/${sessionId}`, updateData);
      Swal.fire('Success!', 'Update successful!', 'success');
    } catch (error) {
      console.error('Error updating session:', error);
      Swal.fire('failor!', 'Update failed!', 'failor');
    }
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div className='container mx-auto p-4'>
      <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        {/* Iterate over session object keys and create form fields */}
        {Object.keys(session).map((key) => (
          <div key={key} className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id={key}
              type='text'
              value={session[key]}
              onChange={(e) => setSession({ ...session, [key]: e.target.value })}
            />
          </div>
        ))}
        <div className='flex flex-row gap-4'>
            <button
          className='bg-blue-500 btn btn-md  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'
          onClick={handleUpdate}
        >
          Update
        </button>  
        <Link to={"/all-sessions"} className='btn btn-md py-2 px-4 rounded '>Cancle</Link>
        </div>
      
      </form>
    </div>
  );
};

export default UpdateSession;


