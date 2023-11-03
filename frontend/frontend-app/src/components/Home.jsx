import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the JWT token is present in localStorage
    const jwtToken = localStorage.getItem('jwtResponse');
    
    // If not authenticated, redirect to the login page
    if (jwtToken == null) {
      navigate('/login');
    } else {
      console.log(jwtToken);
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
