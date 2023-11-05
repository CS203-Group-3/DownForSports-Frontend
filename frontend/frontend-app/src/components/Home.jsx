import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { getAxiosConfig } from './Headers';

const HomePage = () => {
  const navigate = useNavigate();

  
  useEffect(() => {
    // Check if the JWT token is present in localStorage
    const jwtToken = localStorage.getItem('jwtResponse');

    // If not authenticated, reroute to the login page
    if (!jwtToken) {
      navigate('/login');
    } else {
      // Send a GET request to check if the token is valid
      const userId = JSON.parse(localStorage.getItem('jwtResponse')).id;
      axios.get(`http://localhost:8080/api/user/details/${userId}`, getAxiosConfig())
      .then((response) => {
        // Token is valid, do nothing
        console.log('Token is valid.');
      })
      .catch((error) => {
        // Token is invalid or there was an error
        console.error('Token validation error:', error);
        // Redirect to the login page
        navigate('/login');
      });
    }
  }, [navigate]);


  const backgroundStyle = {
    backgroundImage: `url('https://keeble-sample.s3.ap-southeast-1.amazonaws.com/%E2%80%94Pngtree%E2%80%94sports+basketball+backplane_780138.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh',
    opacity: '1',
  };

  const centerContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%', // Adjusted the height
  };

  const buttonContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  };
  
  const navigateToFacilities = () => {
    navigate('/facilities');
  };

  return (
    <div>
      <MyNavbar />
      <div style={backgroundStyle}>
        <div className="container" style={centerContainer}>
          <div className="row">
            <h1 style={{ textAlign: 'center' }}>Down for a game?</h1>
            <div style={buttonContainer}>
              <button style={buttonStyle} onClick={navigateToFacilities}>Book a Facility today</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
