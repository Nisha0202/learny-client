import React, { useState, useContext } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import Swal from 'sweetalert2';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider'


export default function Login() {
  //google sign up
  const { googleLogin, githubLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInUser } = useContext(AuthContext);
  const [formerror, setFormerror] = useState('');

  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();


  const firebaseErrorMessages = {
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'Incorrect password, please try again.',
    'auth/too-many-requests': 'Too many login attempts, please try again later.',
    'auth/network-request-failed': 'Network error, please check your connection and try again.',
    // Add more Firebase error codes and custom messages as needed
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('https://learny-brown.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message);
      }

      const data = await response.json();
      console.log('Success:', data);
      Swal.fire({
        icon: 'success',
        title: 'Logged in successfully',
        showConfirmButton: false,
        timer: 1500
      });
      setLoading(false);

      // Save the token to manage sessions securely
      localStorage.setItem('token', data.token);
      reset();

      navigate('/');
      setTimeout(function () {
        location.reload();
      }, 800);



    } catch (error) {
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

    }
  };



  const onSubmit = (data) => {
    setLoading(true);
    const { email, pass } = data;

    const signIn = async (email, pass) => {
      try {
        const result = await signInUser(email, pass);
        return result;
      } catch (error) {
        console.error('Error in signIn:', error);

      }
    };
    signIn(email, pass).then(() => {
      console.log('Login successful');
      login({ email, pass });

    }).catch(error => {
      console.error('Error creating user:', error.message);

    });
  };


  return (
    <div className='flex flex-col items-center gap-8 py-16 px-2'>
      <form onSubmit={handleSubmit(onSubmit)} className='max-w-96 mx-auto flex flex-col items-center gap-6  inter'>
        <label className="input input-bordered flex items-center gap-2 text-gray-600">
          <AiOutlineMail />
          <input type="text" className="grow" placeholder="Email" name='email'
            {...register("email", { required: true })} />
          {errors.pass && <span className='text-xs text-red-500'>required field</span>}
        </label>
        <label className="input input-bordered flex items-center gap-2">
          {showPassword ? <IoEyeOutline onClick={() => setShowPassword(false)} /> : <IoEyeOffOutline onClick={() => setShowPassword(true)} />}
          <input type={showPassword ? "text" : "password"} className="grow" name='pass' placeholder='password'
            {...register("pass", { required: true })} />
          {errors.pass && <span className='text-xs text-red-500'>required field</span>}
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

      </form>
      <div className='flex flex-col md:flex-row mx-auto gap-4'>
        <button className="btn rounded-md bg-black text-white flex items-center gap-2 py-2 px-4 hover:bg-gray-800" onClick={() => githubLogin(navigate)}>
          <FaGithub /> Log In with Github
        </button>
        <button className="btn rounded-md bg-red-600 text-white flex items-center gap-2 py-2 px-4 hover:bg-red-700" onClick={() => googleLogin(navigate)}>
          <FaGoogle /> Log In with Google
        </button>
      </div>


      <div className='text-sm'>If you have already registered, please login.</div>
      <div>New to join? <Link to={'/signup'} className='text-blue-500 font-bold'>Register</Link></div>
    </div>
  )
}

