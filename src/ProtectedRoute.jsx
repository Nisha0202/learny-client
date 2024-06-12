import React from 'react';
import { Route, useNavigate, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


const ProtectedRoute = ({ component: Component, role: Role, ...rest }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || (token && jwtDecode(token).role);

  return token && role === Role ? <Component {...rest} /> : <Navigate to="/login" />;
};


export default ProtectedRoute ;



