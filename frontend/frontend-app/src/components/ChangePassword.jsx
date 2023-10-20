import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  //no posting
//   const handleChangePassword = () => {
//     // Implement the logic to change the password here
//     if (newPassword === confirmNewPassword) {
//       // Passwords match, proceed with the change
//       // You can make an API call to your server to update the password
//       console.log('Password changed successfully.');
//     } else {
//       // Passwords do not match, show an error
//       console.error('New passwords do not match.');
//     }
//   };

    //send in http request to backend
    const handleChangePassword = () => {
        if (newPassword === confirmNewPassword) {
          // Passwords match, proceed with the change
          const jwtResponse = JSON.parse(localStorage.getItem('jwtResponse'));
          const userId = jwtResponse.id;
    
          // Create a ChangePasswordRequest object to send to the server
          const changePasswordRequest = {
            currentPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmNewPassword,
          };
    
          axios.post(`http://localhost:8080/api/user/${userId}`, changePasswordRequest, {
            headers: {
              Authorization: jwtResponse.accessToken,
              withCredentials: true,
            },
          })
          .then(response => {
            console.log('Password changed successfully.');
            // Handle success, e.g., show a success message to the user.
          })
          .catch(error => {
            console.error('Error changing password:', error);
            // Handle errors, e.g., show an error message to the user.
          });
        } else {
          console.error('New passwords do not match.');
          // Handle the case where new passwords do not match.
        }
      };
  

  // Inline CSS styles
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

return (
    <div>
      <MyNavbar /> {/* Include the MyNavbar component at the top */}
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h1>Change Password</h1>
          <form>
            <div>
              <label htmlFor="oldPassword">Old Password:</label>
              <input type="password" id="oldPassword" name="oldPassword" style={{ width: '100%' }} />
            </div>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input type="password" id="newPassword" name="newPassword" style={{ width: '100%' }} />
            </div>
            <div>
              <label htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input type="password" id="confirmNewPassword" name="confirmNewPassword" style={{ width: '100%' }} />
            </div>
            <button style={{ marginTop: '10px', width: '100%' }} className="btn btn-primary" type="submit">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;