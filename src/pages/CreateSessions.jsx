import React, { useState, useContext } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateSessions = () => {
  const { usern } = useContext(AuthContext);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [registrationStartDate, setRegistrationStartDate] = useState('');
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  const [classStartDate, setClassStartDate] = useState('');
  const [classEndDate, setClassEndDate] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        // Send a POST request to your server with the session data
        await axios.post(`http://localhost:5000/api/session`, {
            tutorName: usern.displayName ,
            tutorEmail: usern.email,
            sessionTitle,
            sessionDescription,
            registrationStartDate,
            registrationEndDate,
            classStartDate,
            classEndDate,
            sessionDuration,
            registrationFee: 0,
            status: 'pending'
        });
        // Clear the form
        setSessionTitle('');
        setSessionDescription('');
        setRegistrationStartDate('');
        setRegistrationEndDate('');
        setClassStartDate('');
        setClassEndDate('');
        setSessionDuration('');
        // Show a success alert
        Swal.fire('Success!', 'Your session has been created.', 'success');
    } catch (error) {
        console.error('Error creating session:', error);
        // Show an error alert
        Swal.fire('Error!', 'There was an error creating your session. Please try again.', 'error');
    }
  };

  return (
    <div className="container min-h-[75vh]">
        <div className='max-w-md mx-auto my-4'>
    
        

        <form onSubmit={handleSubmit} className="form-control w-full">
  <label className="label">
    <span className="label-text">Tutor Name</span>
  </label>
  <input type="text" value={usern.displayName || ''} readOnly className="input input-bordered w-full" />

  <label className="label">
    <span className="label-text">Tutor Email</span>
  </label>
  <input type="email" value={usern.email || ''} readOnly className="input input-bordered w-full" />

  <label className="label">
    <span className="label-text">Session Title</span>
  </label>
  <input type="text" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} className="input input-bordered w-full" required />

  <label className="label">
    <span className="label-text">Session Description</span>
  </label>
  <textarea value={sessionDescription} onChange={(e) => setSessionDescription(e.target.value)} className="textarea textarea-bordered h-24" required></textarea>
  <label className="label">
  <span className="label-text">Registration Start Date</span>
</label>
<input type="date" value={registrationStartDate} onChange={(e) => setRegistrationStartDate(e.target.value)} className="input input-bordered w-full" required />

<label className="label">
  <span className="label-text">Registration End Date</span>
</label>
<input type="date" value={registrationEndDate} onChange={(e) => setRegistrationEndDate(e.target.value)} className="input input-bordered w-full" required />

<label className="label">
  <span className="label-text">Class Start Date</span>
</label>
<input type="date" value={classStartDate} onChange={(e) => setClassStartDate(e.target.value)} className="input input-bordered w-full" required />

<label className="label">
  <span className="label-text">Class End Date</span>
</label>
<input type="date" value={classEndDate} onChange={(e) => setClassEndDate(e.target.value)} className="input input-bordered w-full" required />

<label className="label">
  <span className="label-text">Session Duration</span>
</label>
<input type="text" value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} className="input input-bordered w-full" placeholder='example: 1hr' required />


  <button type="submit" className="btn bg-blue-500 text-white mt-4">Create Session</button>
</form>

        
       
        </div>
    </div>
  );
};

export default CreateSessions;
