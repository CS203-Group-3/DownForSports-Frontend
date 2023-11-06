import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAxiosConfig } from './Headers';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    // Check if jwtToken is available in localStorage
    const jwtToken = JSON.parse(localStorage.getItem('jwtResponse'));
    if (!jwtToken) {
      // If jwtToken is not available, navigate to the login page
      navigate('/login');
    }
  }, [navigate]);

  const handleChangePassword = () => {
    setError(null);
    setSuccessMessage(null);

    if (newPassword === confirmNewPassword) {
      const jwtResponse = JSON.parse(localStorage.getItem('jwtResponse'));
      const userId = jwtResponse.id;

      const changePasswordRequest = {
        currentPassword: oldPassword,
        newPassword: newPassword,
      };

      axios
        .post(`http://18.141.196.51:8080/api/user/${userId}`, changePasswordRequest, {
          headers: {
            Authorization: jwtResponse.accessToken,
            withCredentials: true,
          },
        })
        .then((response) => {
          console.log('Password changed successfully.');
          setSuccessMessage('Password changed successfully');
          // Automatically log out the user after changing the password
          logout();
        })
        .catch((error) => {
          console.error('Error changing password:', error);
          if (error.response && error.response.data) {
            setError(error.response.data);
          }
        });
    } else {
      setError('New passwords do not match.');
    }
  };

    // Logout function to remove the JWT token from localStorage
    function logout() {
      // Retrieve the user's ID or userID from your front-end
      const userId = JSON.parse(localStorage.getItem('jwtResponse')).id; // Replace with your logic to get the user's ID
      axios.delete(`http://18.141.196.51:8080/api/user/logout/${userId}`, getAxiosConfig())
        .then((response) => {
          // Handle successful logout, e.g., clear user data in the front-end
          localStorage.removeItem('jwtResponse');
          navigate('/login'); // Redirect to the login page or any desired page
        })
        .catch((error) => {
          // Handle any errors during the logout process
          console.error("Error logging out:", error);
        });
    }

  return (
    <div>
      <MyNavbar />
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h1>Change Password</h1>
          <form>
            <div>
              <label htmlFor="oldPassword">Old Password:</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <button
              style={{ marginTop: '10px', width: '100%' }}
              className="btn btn-primary"
              type="button"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success mt-3" role="alert">
                {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 60px)',
};

const boxStyle = {
  border: '1px solid #ccc',
  padding: '20px',
  borderRadius: '5px',
  maxWidth: '400px',
  width: '100%',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
};

export default ChangePassword;
