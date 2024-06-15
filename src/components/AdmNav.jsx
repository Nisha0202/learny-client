
  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  
  const AdmNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    return (
      <nav className="flex flex-wrap items-center justify-between p-6 bg-blue-500 text-white">
        <Link to={"/admin"} className="flex flex-1 items-center flex-shrink-0 mr-6 font-bold text-white">
          Admin Dashboard
        </Link>
        <div className="block lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v15z"/></svg>
          </button>
        </div>
        <div className={`${isOpen ? 'block' : 'hidden'} w-full block flex-grow lg:flex lg:items-center lg:w-auto`}>
          <div className="text-sm lg:flex-grow">
    
            <Link to="/all-users" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4">
              View all users
            </Link>
            {/* <div className="relative inline-block text-left">
              <button type="button" onClick={toggleDropdown} className="mt-4 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
                View all study session
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`${dropdownOpen ? 'block' : 'hidden'} origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}>
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link to="/approved-sessions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Approved</Link>
                  <Link to="/not-approved-sessions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Not Approved</Link>
                </div>
              </div>
            </div> */}
             <Link to="/all-sessions" className="block mt-4 lg:ms-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4">
             View all study session
            </Link>
            <Link to="/manage-notes" className="block mt-4 lg:ms-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4">
              View all materials
            </Link>
          </div>
        </div>
      </nav>
    );
  };
  
  export default AdmNav;
  


// const StdNav = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="flex flex-wrap items-center justify-between p-6 bg-blue-500 text-white">
//       <Link to={"/student"} className="flex flex-1 items-center flex-shrink-0 mr-6 font-bold text-white">
//         Admin Dashboard
//       </Link>
//       <div className="block lg:hidden">
//         <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white">
//           <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v15z"/></svg>
//         </button>
//       </div>
//       <div className={`${isOpen ? 'block' : 'hidden'} w-full block flex-grow lg:flex lg:items-center lg:w-auto`}>
//         <div className="text-sm lg:flex-grow">
//           <Link to="/booked-sessions" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4">
//           View all users
//           </Link>
//           <Link to="/create-notes" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4">
//           View all study session
//           </Link>
//           <Link to="/manage-notes" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4">
//           View all materials
//           </Link>
        
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default StdNav;