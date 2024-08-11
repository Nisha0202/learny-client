import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import {jwtDecode} from 'jwt-decode';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillSignature } from 'react-icons/ai';

const Navbar = () => {
  const { logOut, usern } = useContext(AuthContext);
  const [login, setLogin] = useState(false);


  const [token, setToken] = useState(localStorage.getItem('token'));
const [role, setRole] = useState(localStorage.getItem('role'));

useEffect(() => {
  setLogin(!!token || !!role);
  if (token) {
    const decodedToken = jwtDecode(token);
    console.log('User role:', decodedToken.role);
    if(!role){
      setRole(decodedToken.role);
    }
    


  }
}, [usern, token]);


  const photoURL = usern ? usern.photoURL : undefined;
  console.log(photoURL);
  const displayName = usern ? usern.displayName : 'name';

  const dashboardRoute = useMemo(() => {
    console.log(role);
   
    switch (role) {
      case 'student':
        return '/student';
      case 'teacher':
        return '/teacher';
      case 'admin':
        return '/admin';
      default:
        return '';
    }
  }, [role]);

  return (
    <div className=' py-6'>
      <nav className="flex items-center justify-between container">
        <Link to={"/"} className="flex items-center gap-1 text-blue-500">
          <AiFillSignature className=" text-2xl" />
          <span className="font-bold md:text-lg text-base" title='Learny Home'> Learny</span>
        </Link>

        {login ? (
          <div className="flex justify-center items-center text-sm gap-1 lg:gap-3">
            <img src={photoURL || 'https://i.pinimg.com/564x/f5/b5/51/f5b5519260e87d46e516658c6fb2282d.jpg'} alt="User"
              className=" w-8 h-8 rounded-full border-2 mt-1" title={displayName}/>
            <Link to={dashboardRoute} className=" btn-sm font-bold py-2 rounded hover:text-blue-700 ">
              Dashboard
            </Link>
            <Link to={''} onClick={logOut} className="bg-transparent btn-sm hover:text-red-700 font-bold py-2 px-0">
              Logout
            </Link>
          </div>
        ) : (
          <div className='flex justify-center items-center text-sm gap-1 lg:gap-3' >
            <Link to={"/login"} className="mr-2 bg-transparent btn-sm hover:text-blue-700 font-bold py-2 px-2.5">
              Login
            </Link>
            <Link to={"/signup"} className="bg-transparent btn-sm hover:text-blue-700 font-bold py-2 px-0">
              Register
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};
export default Navbar;

