import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OTPModal(props) {
  const [show, setShow] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Call the save function when the "Register" button is clicked
    save();
    setShow(true);
  };

  const handleOtpInputChange = (e) => {
    setOtpValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem("jwtResponse")).id;
    if (otpValue.length === 6) {
      try {
        // Send OTP to the backend for validation
        const response = await axios.post("/api/otp/validateOtp", {
          userId: userId,
          oneTimePasswordCode: otpValue
        });
        if (response.data === true) {
          setValidationResult("OTP is valid.");
        } else {
          setValidationResult("OTP is not valid.");
        }
      } catch (error) {
        console.error("Error:", error);
        setValidationResult("Error occurred during OTP validation.");
      }
    } else {
      setValidationResult("Please enter a 6-digit OTP.");
    }
  };

  // This is the save function
  const save = async () => {
    if (props.password !== props.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Register the user
      await axios.post("http://localhost:8080/api/auth/register", {
        username: props.username,
        email: props.email,
        password: props.password
      });

      // Log in the user immediately after registration
      await axios
        .post("http://localhost:8080/api/auth/login", {
          username: props.username,
          password: props.password
        })
        .then((response) => {
          const jwtResponse = {
            accessToken: "Bearer " + response.data.accessToken,
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            roles: response.data.roles // Replace with the actual roles from your response
          };
          localStorage.setItem("jwtResponse", JSON.stringify(jwtResponse));
          console.log("accessToken:", jwtResponse.accessToken);
          console.log("Username:", jwtResponse.username);
          console.log("Role:", jwtResponse.roles);
          alert("Registration and Login Successful");
          navigate("/home");
        });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        alert("Error Message:" + errorMessage);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Register
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>OTP Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>Enter the 6 digit OTP code sent to your email.</Modal.Body>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="text"
            placeholder="Enter OTP"
            value={otpValue}
            onChange={handleOtpInputChange}
            maxLength="6"
          />
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default OTPModal;
