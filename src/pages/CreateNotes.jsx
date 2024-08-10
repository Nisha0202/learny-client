import React, { useState, useContext } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import StdNav from '../components/StdNav';

const CreateNotes = () => {
  const { usern } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(null);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
        // Send a POST request to your server with the note data
        await axios.post(`https://learny-brown.vercel.app/api/notes`, {
            userEmail: usern.email,
            title,
            description
        });
        // Clear the form
        setTitle('');
        setDescription('');
        // Show a success alert
        setLoading(false);
        Swal.fire('Success!', 'Your note has been created.', 'success');
    } catch (error) {
        console.error('Error creating note:', error);
        // Show an error alert
        setLoading(false);
        Swal.fire('Error!', 'There was an error creating your note. Please try again.', 'error');
    }
};


  return (
    <div className="container min-h-[75vh]">
         <StdNav/>
        <div className='max-w-md mx-auto my-12'>
        <form onSubmit={handleSubmit} className="form-control w-full">
  <label className="label">
    <span className="label-text">Email</span>
  </label>
  <input type="email" value={usern.email || ''} readOnly className="input input-bordered w-full " />

  <label className="label">
    <span className="label-text">Title</span>
  </label>
  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input input-bordered w-full" required />

  <label className="label">
    <span className="label-text">Description</span>
  </label>
  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="textarea textarea-bordered h-24" required></textarea>

  <div className="relative w-full mt-4">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="loading loading-ring loading-lg text-indigo-500"></div>
            </div>
          ) : (
            <button type='submit' className=" w-full py-2 rounded-md text-white hover:bg-blue-700 bg-blue-500 font-bold">Create</button>
          )}
        </div>
  {/* <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 text-white mt-4">Create Note</button> */}
</form>

        </div>
    
    </div>
  );
};

export default CreateNotes;
