import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  let role = '';
  const navigate = useNavigate();

  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role;
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && roles.includes(role) ? (
          <Component {...props} />
        ) : (
          navigate('/unauthorized')
        )
      }
    />
  );
};

export default ProtectedRoute;

