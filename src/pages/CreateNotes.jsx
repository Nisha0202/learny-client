import React, { useState, useContext } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import axios from 'axios';

const CreateNotes = () => {
  const { usern } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to your server with the note data
      await axios.post(`http://localhost:5000/api/notes`, {
        userEmail: usern.email,
        title,
        description
      });
      // Clear the form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input type="email" value={usern.email} readOnly className="border-2 p-2" />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border-2 p-2" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border-2 p-2" required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Note</button>
      </form>
    </div>
  );
};

export default CreateNotes;
