import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { getAxiosConfig } from './Headers';

function AcceptCreditRequest() {
  const [creditRequests, setCreditRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    amount: 0,
    action: null, // To store the user's action (Accept, Decline, or Go Back)
  });

  useEffect(() => {
    // Make an API call to fetch credit requests data when the component mounts
    axios.get("http://localhost:8080/api/bookings/creditrequest", getAxiosConfig())
      .then((response) => {
        setCreditRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching credit requests:', error);
      });
  }, []);

  const openModal = (amount) => {
    setConfirmationData({
      amount,
      action: null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleConfirmAction = (action) => {
    setConfirmationData({ ...confirmationData, action });
    setShowModal(true);
  };

  // Handle submitting the confirmation
  const handleConfirmationSubmit = () => {
    const { amount, action } = confirmationData;
    if (action === 'Accept') {
      // Handle the Accept action here
      // You can make an API call to send the confirmation to the server
      // Example: axios.post("your_api_endpoint", { amount, action })
    } else if (action === 'Decline') {
      // Handle the Decline action here
      // Example: axios.post("your_api_endpoint", { amount, action })
    }
    // Close the modal
    setShowModal(false);
  };

  return (
    <div>
      <MyNavbar />
      <h1>Credit Requests</h1>
      {creditRequests.length > 0 ? (
        <div>
          {creditRequests.map((creditRequest, index) => (
            <Card key={index} className="mb-3">
              <Card.Header>Credit Request</Card.Header>
              <Card.Body>
                <Card.Title>Amount: {creditRequest.amount}</Card.Title>
                <Card.Text>
                  <Button variant="primary" onClick={() => openModal(creditRequest.amount)}>
                    Confirm
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p>No credit requests available.</p>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Amount: {confirmationData.amount}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Go Back
          </Button>
          <Button variant="danger" onClick={() => handleConfirmAction("Decline")}>
            Decline
          </Button>
          <Button variant="success" onClick={() => handleConfirmAction("Accept")}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AcceptCreditRequest;
