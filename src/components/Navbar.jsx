
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import {jwtDecode} from 'jwt-decode';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AiFillSignature } from 'react-icons/ai';



const Navbar = () => {
  const { logOut, usern } = useContext(AuthContext);
  const [login, setLogin] = useState(false);
  const [role, setRole] = useState('');

  // useEffect(() => {
  //   setLogin(!!usern);
  // }, [usern]);

  
  useEffect(() => {
    setLogin(!!usern);
    // window.location.reload();

    const role = localStorage.getItem('role');
    if (role) {
      setRole(role);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log('User role:', decodedToken.role);
        setRole(decodedToken.role);
      }
    }
  }, [usern, localStorage.getItem('role'), localStorage.getItem('token')]);

  const photoURL = usern ? usern.photoURL : undefined;
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
        <Link to={"/"} className="flex items-center gap-2 text-blue-500">
          <AiFillSignature className=" text-2xl" />
          <span className="font-bold text-lg"> Learny</span>
        </Link>

        {login ? (
          <div className="flex justify-center items-center text-sm gap-2 lg:gap-4">
            <img src={photoURL || 'https://i.pinimg.com/564x/f5/b5/51/f5b5519260e87d46e516658c6fb2282d.jpg'} alt="User"
              className=" w-8 h-8 rounded-full border-2 mt-1" title={displayName}/>
            <Link to={dashboardRoute} className=" btn-sm font-bold py-2 px-2 rounded hover:text-blue-700 ">
              Dashboard
            </Link>
            <Link to={''} onClick={logOut} className="bg-transparent btn-sm hover:text-red-700 font-bold py-2 px-2 rounded">
              Logout
            </Link>
          </div>
        ) : (
          <div>
            <Link to={"/login"} className="mr-2 bg-transparent btn-sm hover:text-blue-700 font-bold py-2 px-4 rounded">
              Login
            </Link>
            <Link to={"/signup"} className="bg-transparent btn-sm hover:text-blue-700 font-bold py-2 px-4 rounded">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};
export default Navbar;


// const Navbar = () => {
//   const { logOut, usern } = useContext(AuthContext);
//   const [login, setLogin] = useState(false);
//   const [role, setRole] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLogin(!!usern);
//     if (usern) {
//       // If the user is logged in, get the role
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decodedToken = jwtDecode(token);
//         console.log('User role:', decodedToken.role);
//         setRole(decodedToken.role);
//         localStorage.setItem('role', decodedToken.role); //role is set in local storage
//       }
//     }
//   }, [usern]);

//   const photoURL = usern ? usern.photoURL : undefined;
//   const displayName = usern ? usern.displayName : 'name';
//   const dashboardRoute = useMemo(() => {
//     console.log(role);
//     switch (role) {
//       case 'student':
//         return '/student';
//       case 'teacher':
//         return '/teacher';
//       case 'admin':
//         return '/admin';
//       default:
//         return '';
//     }
//   }, [role]);

//   return (
//     <div className='py-6'>
//       <nav className="flex items-center justify-between container">
//         <Link to={"/"} className="flex items-center gap-2 text-blue-500">
//           <AiFillSignature className="text-2xl" />
//           <span className="font-bold text-lg">Learny</span>
//         </Link>

//         {login ? (
//           <div className="flex justify-center items-center text-sm gap-2 lg:gap-4">
//             <img
//               src={photoURL || 'https://i.pinimg.com/564x/f5/b5/51/f5b5519260e87d46e516658c6fb2282d.jpg'}
//               alt="User"
//               className="w-8 h-8 rounded-full border-2 mt-1"
//               title={displayName}
//             />
//             <Link to={dashboardRoute} className="btn-sm font-bold py-2 px-2 rounded hover:text-blue-700">
//               Dashboard
//             </Link>
//             <Link to={''} onClick={logOut} className="bg-transparent btn-sm hover:text-red-700 font-bold py-2 px-2 rounded">
//               Logout
//             </Link>
//           </div>
//         ) : (
//           <div>
//             <Link to={"/login"} className="mr-2 bg-transparent btn-sm hover:text-blue-700 font-bold py-2 px-4 rounded">
//               Login
//             </Link>
//             <Link to={"/signup"} className="bg-transparent btn-sm hover:text-blue-700 font-bold py-2 px-4 rounded">
//               Sign Up
//             </Link>
//           </div>
//         )}
//       </nav>
//     </div>
//   );
// };

// export default Navbar;