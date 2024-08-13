import React, { useState, useContext } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import StdNav from '../components/StdNav';

function ManageNotes() {
  const { usern } = useContext(AuthContext);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();


  if (!usern) {
    return (
      <div className="container min-h-[75vh] flex justify-center items-center">
        <p className="text-red-500 font-bold">You must be logged in to access.</p>
      </div>
    );
  }

  const fetchNotes = async () => {
    const userEmail = usern.email;

    const response = await fetch(`https://learny-brown.vercel.app/api/notes?userEmail=${userEmail}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    setLoading(false);
    return response.json();
  };


  const { data: notes, error, isLoading } = useQuery({
    queryKey: ['notes', usern.email],
    queryFn: fetchNotes,
  });



  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, title, description }) => {
      const response = await axios.put(`https://learny-brown.vercel.app/api/notes/${id}`, { title, description });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes', usern.email]);
      Swal.fire('Success!', 'Your note has been updated.', 'success');
    },
    onError: (error) => {
      console.error('Error:', error);
      Swal.fire('Error!', 'There was an error updating your note. Please try again.', 'error');
    }
  });


  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    updateNoteMutation.mutate({ id: currentNote._id, title, description });
    setCurrentNote(null);
  };


  const deleteNote = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this note!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      const response = await fetch(`https://learny-brown.vercel.app/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Remove the note from the state
      queryClient.invalidateQueries(['notes', usern.email]); // Invalidate the query to refetch the notes
      Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
    }
  };


  const openUpdateDialog = (note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setDescription(note.description);
  };

  if (isLoading)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav />
        <div className='font-bold grid place-content-center mt-4'>
          Loading...
        </div>
      </div>
    );
  if (error)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav />
        <div className='font-bold grid place-content-center mt-4'>
          An error has occurred
        </div>
      </div>
    );
  if (!notes || notes.length === 0)
    return (
      <div className='container min-h-[75vh]'>
        <StdNav />
        <div className='font-bold grid place-content-center mt-4'>
          No Notes Yet
        </div>
      </div>
    );






  return (
    <div className='container min-h-[75vh]'>
      <StdNav />
      {notes && notes.map(note => (
        <div key={note._id} className='w-full h-32 flex flex-col md:flex-row gap-8 border-2 p-4 mt-2'>
          <div>
            <h2 className='font-bold text-wrap text-lg'>{note.title}</h2>
            <p className='text-sm mt-4'>{note.description}</p>
          </div>

          <div className='flex gap-4'>
            <button className='btn btn-sm bg-blue-500 hover:bg-blue-600 text-white' onClick={() => openUpdateDialog(note)}>Update</button>
            <button className='btn btn-sm bg-red-500 hover:bg-red-600 text-white' onClick={() => deleteNote(note._id)}>Delete</button>


          </div>

        </div>
      ))}

      {currentNote && (
        <dialog open className="modal">
          <div className="modal-box">
            <div className='flex justify-between items-center'>
              <h3 className="font-bold text-lg">Update Note</h3>
              <button className="btn" onClick={() => setCurrentNote(null)}>Close</button>
            </div>

            <div className="modal-action">
              <form onSubmit={handleUpdateSubmit} className='flex flex-col items-start gap-3'>
                <label>
                  Title:
                  <input className='border-2' type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>

                <label>
                  Description:
                  <input className='border-2' type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
                <button className='btn btn-md bg-blue-800 hover:bg-blue-700 text-white' type="submit">Update</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
      {loading && (
        <div className="absolute inset-0 flex justify-center my-2 items-center">
          <div className="loading loading-ring loading-xl text-indigo-500"></div>
        </div>
      )}
    </div>
  );
}

export default ManageNotes;
