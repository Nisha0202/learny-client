import React, { useState, useContext } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import TchNav from '../components/TchNav';

const CreateSessions = () => {
  const { usern } = useContext(AuthContext);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [registrationStartDate, setRegistrationStartDate] = useState('');
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  const [classStartDate, setClassStartDate] = useState('');
  const [classEndDate, setClassEndDate] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [otherInfo, setOtherInfo] = useState('');
  const [loading, setLoading] = useState(null);

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);
    try {
        // Send a POST request to your server with the session data
        await axios.post(`https://learny-brown.vercel.app/api/session`, {
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
            status: 'pending',
            otherInfo
        });
        // Clear the form
        setSessionTitle('');
        setSessionDescription('');
        setRegistrationStartDate('');
        setRegistrationEndDate('');
        setClassStartDate('');
        setClassEndDate('');
        setSessionDuration('');
        setOtherInfo('');
        // Show a success alert
        Swal.fire('Success!', 'Your session has been created.', 'success');
        setLoading(false);
    } catch (error) {
        console.error('Error creating session:', error);
        // Show an error alert
        Swal.fire('Error!', 'There was an error creating your session. Please try again.', 'error');
        setLoading(false);
    }
  };


  const [currentPage, setCurrentPage] = useState(1);
  const inputsPerPage = 5;


  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

const renderInputs = () => {
  switch (currentPage) {
    case 1:
      return (
        <>
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

        </>
      );
    case 2:
      return (
        <>
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

          <label className="label">
            <span className="label-text">Other Info</span>
          </label>
          <textarea value={otherInfo} onChange={(e) => setOtherInfo(e.target.value)} className="textarea textarea-bordered h-24"></textarea>
        </>
      );
    default:
      return null;
  }
};

return (
  <div className="container min-h-[75vh]">
      <TchNav/>
       <div className='max-w-md mx-auto my-4'>
  <form onSubmit={handleSubmit} className="form-control w-full">
    {renderInputs()}

    <div className="flex justify-between mt-4">
      {currentPage > 1 && <button type="button" onClick={prevPage} className="px-4 py-2 text-sm hover:bg-blue-400 bg-blue-300 font-bold rounded ">Previous</button>}
      {currentPage < 2 && <button type="button" onClick={nextPage} className="px-4 py-2 text-sm hover:bg-blue-400 bg-blue-300 font-bold rounded ml-auto">Next</button>}
    </div>

    {currentPage === 2 && 
      <div className="relative w-full mt-4">
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="loading loading-ring loading-lg text-indigo-500"></div>
        </div>
      ) : (
        <button type='submit' className=" w-full py-2 rounded-md text-white hover:bg-blue-700 bg-blue-500 font-bold">Create</button>
      )}
    </div>
    
    
    
    
    }
  </form>
  </div>
  </div>
);




{/* <button type="submit" className="btn bg-blue-500 text-white mt-4">Create Session</button> */}









};

export default CreateSessions;
