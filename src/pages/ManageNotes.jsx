import React, { useState, useContext } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2';

function ManageNotes() {
    const { usern } = useContext(AuthContext); 
    const [currentNote, setCurrentNote] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const queryClient = useQueryClient();

    const fetchNotes = async () => {
        const userEmail = usern.email; 
        const response = await fetch(`http://localhost:5000/api/notes?userEmail=${userEmail}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      };
    

      const { data: notes, error, isLoading } = useQuery({
        queryKey: ['notes', usern.email],
        queryFn: fetchNotes,
    });
    
    const updateNote = (id, title, description) => {
        fetch(`http://localhost:5000/api/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        })
        .then(response => response.json())
        .then(data => {
            // Update the note in the state
            queryClient.invalidateQueries(['notes', usern.email]); // Invalidate the query to refetch the notes
            Swal.fire('Success!', 'Your note has been updated.', 'success');
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire('Error!', 'There was an error updating your note. Please try again.', 'error');
        });
    };

    const deleteNote = (id) => {
        fetch(`http://localhost:5000/api/notes/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            // Remove the note from the state
            queryClient.invalidateQueries(['notes', usern.email]); // Invalidate the query to refetch the notes
            Swal.fire('Success!', 'Your note has been deleted.', 'success');
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire('Error!', 'There was an error deleting your note. Please try again.', 'error');
        });
    };

    const openUpdateDialog = (note) => {
        setCurrentNote(note);
        setTitle(note.title);
        setDescription(note.description);
    };

    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        updateNote(currentNote._id, title, description); // Call updateNote directly
        setCurrentNote(null);
    };

    if (isLoading) return <div className='container grid place-item-center'>Loading...</div> ;
    if (error) return <div className='container grid place-item-center'>An error has occurred: {error.message}</div> ; // Corrected the error message

    return (
        <div className='container'>
        {notes && notes.map(note => (
            <div key={note._id} className='w-full h-32 flex flex-col md:flex-row gap-8 border-2 p-4'>
                <h2 className='font-bold text-wrap text-lg'>{note.title}</h2>
                <div className='flex gap-4'> 
                     <button className='btn btn-sm bg-blue-500 text-white' onClick={() => openUpdateDialog(note)}>Update</button>
                <button className='btn btn-sm bg-red-500 text-white' onClick={() => deleteNote(note._id)}>Delete</button>
           

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
                                <button className='btn btn-md bg-blue-800 text-white' type="submit">Update</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}

export default ManageNotes;
