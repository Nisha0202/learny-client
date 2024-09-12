import React, { useState, useContext } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import axios from 'axios';

export default function SignUp() {
  const navigate = useNavigate();
  const { createUser, usern } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [formerror, setFormerror] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Set the image preview
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGbb}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const imageUrl = response.data.data.url;
        setImageUrl(imageUrl);
        setImageUploaded(true);
      } catch (error) {
        console.error('Error uploading image:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Image upload failed.',
        });
      }
    }
  };

  const firebaseErrorMessages = {
    'auth/email-already-in-use': 'The email address is already in use by another account.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'The password is too weak.',
    // Add more custom error messages as needed
  };


  const postUserInfo = async (userInfo) => {
    try {
      const response = await fetch('https://learny-brown.vercel.app/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message);
      }

      const data = await response.json();
      console.log('Success:', data);
      Swal.fire({
        icon: 'success',
        title: 'Signed up successfully, Please Login.',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        setLoading(false);
        navigate('/login');

      });
      

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  const onSubmit = async (data) => {
    setFormerror("");
    setLoading(true);
    const { email, pass, username, role } = data;

    // Check password conditions
    const hasMinLength = pass.length >= 6;
    if (!hasMinLength) {
      setFormerror('Password must have an uppercase letter, a lowercase letter, and be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Create user
    createUser(email, pass, username, imageUrl, role)
      .then(() => {
        // Call the postUserInfo function to post the user data to the server
        postUserInfo({ email, pass, username, image: imageUrl, role });
        reset();
        setFormerror('');
        // setLoading(false);

      })

      .catch(error => {
        console.error('Error creating user:', error.message);
        const errorCode = error.code;
        const customMessage = firebaseErrorMessages[errorCode] || error.message;
        setFormerror(customMessage);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: customMessage,
        });
        setLoading(false);
      });
  };


  return (
    <div className='flex flex-col min-h-custom items-center gap-8 pt-14 pb-14 px-2'>
      <form onSubmit={handleSubmit(onSubmit)} className='max-w-md mx-auto flex flex-col items-center gap-6 inter'>
        <label className="input input-bordered flex items-center gap-2 text-gray-600 w-full">
          <FaRegUser />
          <input type="text" className="grow" placeholder="Name" name='username'
            {...register("username", { required: true })} />
          {errors.username && <span className='text-xs text-red-500'>required field</span>}
        </label>

        {/* <label htmlFor="file-upload" className="custom-file-upload w-full rounded-lg">
          <div className='flex gap-4 items-center w-full py-1.5'>
            <div className='w-6 h-6 border-2 grid items-center show-image'><MdOutlinePhotoLibrary /></div>
            
            {imageUploaded ? (
              <p>Uploaded</p>
            ) : (
              <p>Profile Picture</p>
            )}
          </div>
        </label> */}

        <label htmlFor="file-upload" className="custom-file-upload w-full rounded-lg">
          <div className='flex gap-4 items-center w-full py-1.5'>
            <div className='w-16 h-16 border-2 grid items-center justify-center show-image'>
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <MdOutlinePhotoLibrary />
              )}
            </div>
            {imageUploaded ? (
              <p>Uploaded</p>
            ) : (
              <p>Profile Picture</p>
            )}
          </div>
        </label>

        <input id="file-upload" type="file" className="input " name='image'
          {...register("image")} onChange={handleImageChange} />

        <label className="input input-bordered flex items-center gap-2 text-gray-600 w-full">
          <AiOutlineMail />
          <input type="text" className="grow" placeholder="Email" name='email'
            {...register("email", { required: true })} />
          {errors.email && <span className='text-xs text-red-500'>required field</span>}
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full">
          {showPassword ? <IoEyeOutline onClick={() => setShowPassword(false)} /> : <IoEyeOffOutline onClick={() => setShowPassword(true)} />}
          <input type={showPassword ? "text" : "password"} className="grow" name='pass' placeholder='Password'
            {...register("pass", { required: true })} />
          {errors.pass && <span className='text-xs text-red-500'>required field</span>}
        </label>
        <label className="input input-bordered flex items-center gap-2 text-gray-600 w-full">
          <FaRegUser />
          <select {...register("role", { required: true })} className="grow">
            <option value="student">Student</option>
            <option value="teacher">Tutor</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <span className='text-xs text-red-500'>required field</span>}
        </label>

        <div className="relative w-full my-2">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="loading loading-ring loading-lg text-indigo-500"></div>
            </div>
          ) : (
            <button type='submit' className="btn w-full rounded-md text-white hover:bg-blue-700 bg-blue-500 font-bold">Register</button>
          )}
        </div>

        {formerror && <p className='text-xs font-bold max-w-xs text-wrap text-red-600'> {formerror}!</p>}
      </form>
      <p className='text-sm'>After regesiter you have to login to proceed.</p>
      <div>Already joined? <Link to={'/login'} className='text-blue-500 font-bold ps-1'>Log In</Link></div>
    </div>
  );
}
