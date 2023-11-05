import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withRoleAuthorization = (allowedRoles) => (WrappedComponent) => {
  return function WithAuthorization(props) {
    const navigate = useNavigate();

    useEffect(() => {
      // Check if jwtToken is available in localStorage
      const jwtToken = localStorage.getItem('jwtToken');

      if (!jwtToken) {
        // If jwtToken is not available, navigate to the login page
        navigate('/login');
        return; // Stop further processing
      }

      // Retrieve user roles from local storage
      try {
        const userRoles = JSON.parse(jwtToken).roles;

        if (!userRoles.some((role) => allowedRoles.includes(role))) {
          navigate('/home');
        }
      } catch (error) {
        // Handle potential JSON parsing errors
        console.error('Error parsing user roles:', error);
        navigate('/home');
      }
    }, [navigate, allowedRoles]);

    return <WrappedComponent {...props} />;
  };
};

export default withRoleAuthorization;

