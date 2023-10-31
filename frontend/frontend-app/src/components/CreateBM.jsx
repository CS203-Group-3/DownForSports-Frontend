import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

function CreateBM() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // Add confirmPassword field
  });

  useEffect(() => {
    // Check local storage for the success message
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
      setShowSuccessMessage(true);
      localStorage.removeItem('successMessage'); // Remove it from local storage
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.username && formData.email && formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        createBMAccount();
      } else {
        setShowErrorMessage(true);
      }
    } else {
      // Handle validation or error message here (e.g., missing fields)
    }
  };
  
  const createBMAccount = () => {
    const requestBody = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
  
    // Send a POST request to create the BM account
    axios
      .post("http://localhost:8080/api/auth/registerBM", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("BM account created successfully:", response.data);
        setShowConfirmationModal(false);
        setShowErrorMessage(false);
        // Store the success message in local storage
        localStorage.setItem('successMessage', `Booking Manager account ${formData.username} has been created.`);
        // Reload the page to clear the form fields
        window.location.reload();
        // Delay showing the success message for a short duration
        setTimeout(() => {
          setShowSuccessMessage(true);
        }, 500); // Adjust the delay as needed
      })
      .catch((error) => {
        console.error("Error creating BM account:", error);
        setShowConfirmationModal(false);
        setShowSuccessMessage(false);
        setShowErrorMessage(true);
      });
  };
  

  return (
    <div>
      <MyNavbar />
      <div className="container">
        <h1>Create Booking Manager Account</h1>
        {showSuccessMessage && (
          <Alert variant="success" className="mt-3">
            Successfully created a Booking Manager account.
          </Alert>
        )}
        {showErrorMessage && (
          <Alert variant="danger" className="mt-3">
            Passwords do not match. Please check and try again.
          </Alert>
        )}
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={() => setShowConfirmationModal(true)}
          >
            Create Account
          </Button>
        </Form>
      </div>

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to create this account with the following details?
          <ul>
            <li><strong>Username:</strong> {formData.username}</li>
            <li><strong>Email:</strong> {formData.email}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateBM;



