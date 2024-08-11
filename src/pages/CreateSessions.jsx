import React, { useState, useContext } from 'react';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import TchNav from '../components/TchNav';

const CreateSessions = () => {
  const { usern } = useContext(AuthContext);

  // Initial form state
  const initialState = {
    sessionTitle: '',
    sessionDescription: '',
    registrationStartDate: '',
    registrationEndDate: '',
    classStartDate: '',
    classEndDate: '',
    sessionDuration: '',
    otherInfo: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (!usern) {
    return (
      <div className="container min-h-[75vh] flex justify-center items-center">
        <p className="text-red-500 font-bold">You must be logged in to create a session.</p>
      </div>
    );
  }

  // Handle input change for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://learny-brown.vercel.app/api/session', {
        ...formData,
        tutorName: usern.displayName,
        tutorEmail: usern.email,
        registrationFee: 0,
        status: 'pending',
      });

      // Clear the form
      setFormData(initialState);
      Swal.fire('Success!', 'Your session has been created.', 'success');
    } catch (error) {
      console.error('Error creating session:', error);
      Swal.fire('Error!', 'There was an error creating your session. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Page navigation handlers
  const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, 2));
  const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  // Render form inputs based on the current page
  const renderInputs = () => {
    const inputProps = { className: "input input-bordered w-full", onChange: handleChange, required: true };
    const textAreaProps = { className: "textarea textarea-bordered h-24", onChange: handleChange };

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
            <input type="text" name="sessionTitle" value={formData.sessionTitle} {...inputProps} />

            <label className="label">
              <span className="label-text">Session Description</span>
            </label>
            <textarea name="sessionDescription" value={formData.sessionDescription} {...textAreaProps} />

            <label className="label">
              <span className="label-text">Registration Start Date</span>
            </label>
            <input type="date" name="registrationStartDate" value={formData.registrationStartDate} {...inputProps} />

            <label className="label">
              <span className="label-text">Registration End Date</span>
            </label>
            <input type="date" name="registrationEndDate" value={formData.registrationEndDate} {...inputProps} />
          </>
        );
      case 2:
        return (
          <>
            <label className="label">
              <span className="label-text">Class Start Date</span>
            </label>
            <input type="date" name="classStartDate" value={formData.classStartDate} {...inputProps} />

            <label className="label">
              <span className="label-text">Class End Date</span>
            </label>
            <input type="date" name="classEndDate" value={formData.classEndDate} {...inputProps} />

            <label className="label">
              <span className="label-text">Session Duration</span>
            </label>
            <input type="text" name="sessionDuration" value={formData.sessionDuration} {...inputProps} placeholder='example: 1hr' />

            <label className="label">
              <span className="label-text">Other Info</span>
            </label>
            <textarea name="otherInfo" value={formData.otherInfo} {...textAreaProps} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container min-h-[75vh]">
      <TchNav />
      <div className='max-w-md mx-auto my-4'>
        <form onSubmit={handleSubmit} className="form-control w-full">
          {renderInputs()}
          <div className="flex justify-between mt-4">
            {currentPage > 1 && <button type="button" onClick={prevPage} className="px-4 py-2 text-sm hover:bg-blue-400 bg-blue-300 font-bold rounded">Previous</button>}
            {currentPage < 2 && <button type="button" onClick={nextPage} className="px-4 py-2 text-sm hover:bg-blue-400 bg-blue-300 font-bold rounded ml-auto">Next</button>}
          </div>
          {currentPage === 2 &&
            <div className="relative w-full mt-4">
              {loading ? (
                <div className="absolute inset-0 flex justify-center my-2 items-center">
                  <div className="loading loading-ring loading-lg text-indigo-500"></div>
                </div>
              ) : (
                <button type='submit' className="w-full py-2 rounded-md text-white hover:bg-blue-700 bg-blue-500 font-bold">Create</button>
              )}
            </div>
          }
        </form>
      </div>
    </div>
  );
};

export default CreateSessions;
