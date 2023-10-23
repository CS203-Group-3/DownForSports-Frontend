import React, { useState } from 'react';
import axios from 'axios';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
        .post(`http://localhost:8080/api/user/${userId}`, changePasswordRequest, {
          headers: {
            Authorization: jwtResponse.accessToken,
            withCredentials: true,
          },
        })
        .then((response) => {
          console.log('Password changed successfully.');
          setSuccessMessage('Password changed successfully');
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
