import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withRoleAuthorization = (allowedRoles) => (WrappedComponent) => {
  return function WithAuthorization(props) {
    const navigate = useNavigate();

    useEffect(() => {
      // Retrieve user roles from local storage
      const userRoles = JSON.parse(localStorage.getItem('jwtResponse')).roles;

      if (!userRoles.some((role) => allowedRoles.includes(role))) {
        navigate('/home');
      }
    }, [navigate]); // No need to include props in the dependency array

    return <WrappedComponent {...props} />;
  };
};

export default withRoleAuthorization;

