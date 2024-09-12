
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TchNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get current path

  // Function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? 'font-bold' : ''; // Apply 'font-bold' if path matches
  };

  return (
    <nav className="flex flex-wrap items-center justify-between p-6 bg-blue-500 text-white">
      <Link to={"/teacher"} className="flex flex-1 items-center flex-shrink-0 mr-6 font-bold text-white">
        Teacher Dashboard
      </Link>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-1 border rounded text-white border-white hover:text-white hover:border-white"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v15z" />
          </svg>
        </button>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} w-full block flex-grow lg:flex lg:items-center lg:w-auto`}>
        <div className="text-sm lg:flex-grow">
          <Link
            to="/create-sessions"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4 ${isActive('/create-sessions')}`}
          >
            Create study session
          </Link>
          <Link
            to="/request-session"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4 ${isActive('/request-session')}`}
          >
            View all study sessions
          </Link>
          <Link
            to="/upload-materials"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4 ${isActive('/upload-materials')}`}
          >
            Upload materials
          </Link>
          <Link
            to="/view-materials"
            className={`block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 ${isActive('/view-materials')}`}
          >
            View all materials
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TchNav;
