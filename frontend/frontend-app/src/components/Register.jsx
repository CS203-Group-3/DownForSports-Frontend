import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const [jwtResponse, setJwtResponse] = useState(null);

  async function save(event) {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      // Register the user
      await axios.post("http://localhost:8080/api/auth/register", {
        username: username,
        email: email,
        password: password,
      });
  
      alert("Registration Successful");
      setShowOtpModal(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        alert("Error Message:" + errorMessage);
      } else {
        console.error("Error:", error.message);
      }
    }
  }
  
  function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  function handlePasswordInput(event) {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordTouched(true);
  }

  function handleOtpChange(event) {
    setOtp(event.target.value);
  }
  
  async function verifyOtp() {
    try {
      const otpResponse = await axios.post("http://localhost:8080/api/otp/validateOtp", {
        userId: jwtResponse.id,
        oneTimePasswordCode: otp,
      });
  
      setOtpVerified(true);
      setShowOtpModal(false);
  
      if (otpVerified) {
        try {
          // Only attempt auto-login if OTP is verified
          const loginResponse = await axios.post("http://localhost:8080/api/auth/login", {
            username: username,
            password: password,
          }).then((response) => {
            const jwtResponse = {
              accessToken: "Bearer " + response.data.accessToken,
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
              roles: response.data.roles,
            };
            localStorage.setItem('jwtResponse', JSON.stringify(jwtResponse));
            console.log('accessToken:', jwtResponse.accessToken);
            console.log('Username:', jwtResponse.username);
            console.log('Role:', jwtResponse.roles);
            alert("Login Successful");
            navigate("/home");
          });
          navigate("/home");
        } catch (error) {
          if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data.message;
            alert("Auto Login Failed: " + errorMessage);
          } else {
            console.error("Auto Login Error:", error.message);
          }
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        alert("OTP Verification Failed: " + errorMessage);
      } else {
        console.error("OTP Verification Error:", error.message);
      }
    }
  }
  

  return (
    <div>
      <div class="container mt-4">
        <div class="card">
          <h1>Registration</h1>
          <form>
            <div class="form-group">
              <label>NRIC</label>
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="Enter NRIC"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={handlePasswordInput}
              />
              {passwordTouched && !validatePassword(password) && (
                <div className="text-danger">
                  Password must contain at least 8 characters, a lowercase and uppercase letter, a number, and a special character (@$!%*?&)
                </div>
              )}
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
            </div>
            <button type="submit" class="btn btn-primary mt-4" onClick={save}>
              Register
            </button>
          </form>
          <p className="mt-3">Already created an account? <a href="/login">Log in here</a></p>
        </div>
      </div>
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>OTP Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={verifyOtp}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Register;
