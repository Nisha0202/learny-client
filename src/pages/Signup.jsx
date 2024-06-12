import React, { useState, useRef, useContext, useEffect } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { AuthContext } from '../FirebaseProbider/FirbaseProvider'
import { useForm} from "react-hook-form"
import Swal from 'sweetalert2';

export default function SignUp() {
    const navigate = useNavigate();
    const { createUser, usern } = useContext(AuthContext);

    const postUserInfo = async (userInfo) => {
        try {
          const response = await fetch('http://localhost:5000/api/users', {
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
            title: 'User created successfully',
            showConfirmButton: false,
            timer: 2000
          });
          navigate('/login');
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          });
        }
      };
      
      
    useEffect(() => {
        if (usern) {
            navigate('/login');
        }
    }, [usern, navigate]);

    const [formerror, setFormerror] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {register, handleSubmit, reset,  formState: { errors }, } = useForm();
    
    const onSubmit = (data) => {
        const { email, pass, username, image, role } = data;
        // Check password conditions
        const hasUppercase = pass.toLowerCase() !== pass;
        const hasLowercase = pass.toUpperCase() !== pass;
        const hasMinLength = pass.length >= 6;
        if (!hasUppercase || !hasLowercase || !hasMinLength) {
            setFormerror('Password must have an uppercase letter, a lowercase letter, and be at least 6 characters long');
            return;
        }
    


                createUser(email, pass, username, image, role)
        .then(() => {

// Call the postUserInfo function to post the user data to the server
       postUserInfo({ email, pass, username,  image, role });
            reset();
            setFormerror('');
            navigate('/login');

        }).catch(error => {
                console.error('Error creating user:', error.message);
                setFormerror(error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                });
            });




    };

    if(usern) return

    return (
        <div className='flex flex-col items-center gap-8 py-16 px-2'>
        
  
            <form onSubmit={handleSubmit(onSubmit)} className='max-w-96 mx-auto flex flex-col items-center gap-6 inter'>
                <label className="input input-bordered flex items-center gap-2 text-gray-600 w-full">
                    <FaRegUser />
                    <input type="text" className="grow" placeholder="Name" name='username'
                     {...register("username", { required: true })} />
                      {errors.username && <span className='text-xs text-red-500'>required field</span>}
                </label>
                <label className="input input-bordered flex items-center gap-2 text-gray-600 w-full">
                    <MdOutlinePhotoLibrary />
                    <input type="text" className="grow" placeholder="Photo URL" name='photo' 
                        {...register("image", { required: false })}/>
                </label>
                <label className="input input-bordered flex items-center gap-2 text-gray-600 w-full">
                    <AiOutlineMail />
                    <input type="text" className="grow" placeholder="Email" name='email'
                        {...register("email", { required: true })} />
                         {errors.email && <span className='text-xs text-red-500'>required field</span>}
                </label>
                <label className="input input-bordered flex items-center gap-2 w-full">
                    {showPassword ? <IoEyeOutline onClick={() => setShowPassword(false)} /> : <IoEyeOffOutline onClick={() => setShowPassword(true)} />}
                    <input type={showPassword ? "text" : "password"} className="grow" name='pass' placeholder='password'
                    {...register("pass", { required: true })}  />
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
                <button type='submit' className="btn w-full rounded-md text-white hover:bg-blue-700 bg-blue-500  font-bold">Register</button>
                {formerror && <p className='text-xs font-bold max-w-xs text-wrap text-red-600'> {formerror}!</p>}
            </form>
            <p className='text-sm'>After regesiter you have to login to proceed.</p>
            <div>Already joined? <Link to={'/login'} className='text-blue-500 font-bold'>Log In</Link></div>
        </div>
    )
}

