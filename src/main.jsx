
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Root from './root/Root';
import Home from './pages/Home';
import ErrorPage from './components/ErrorPage';
import FirbaseProvider from './FirebaseProbider/FirbaseProvider';
import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Admin from './pages/Admin';
import Unauthorized from './pages/Unauthorized';
import SessionDetails from './components/SessionDetails';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Payment from './pages/Payment';
import BookedSession from './components/BookedSession';
import ViewDetails from './components/ViewDetails';

const queryClient = new QueryClient()


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/student",
        element: <Student />,
      },
      {
        path: "/teacher",
        element: <Teacher />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized/>,
      },
      {
        path: "/session/:id",
        element: <SessionDetails/>,
    
      },
      {
        path: "/viewdetails/:id",
        element: <ViewDetails/>,
    
      },
      {
        path: "/payment/:id",
        element: <Payment/>,
      },
      {
        path: "/booked-sessions",
        element: <BookedSession/>,
      },
    
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
        <FirbaseProvider>
      <RouterProvider router={router} />
    </FirbaseProvider>
     </QueryClientProvider>
  
  </React.StrictMode>,
)
