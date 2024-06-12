import React from 'react';
import { Route, useNavigate, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


const PrivateRoute = ({ component: Component, role: Role, ...rest }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || (token && jwtDecode(token).role);

  return (
    <Route
      {...rest}
      render={props =>
        token && role === Role ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;



