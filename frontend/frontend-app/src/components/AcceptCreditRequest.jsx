import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card, Button, Modal, Form, Alert } from 'react-bootstrap'; // Import Alert component
import { getAxiosConfig } from './Headers';
import withRoleAuthorization from './RoleAuthorization';
import { useNavigate } from 'react-router-dom';

function AcceptCreditRequest() {
  const [creditRequests, setCreditRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State variable for success message
  const [showErrorMessage, setShowErrorMessage] = useState(false); // State variable for error message
  const [amount, setAmount] = useState(0);
  const [creditID, setcreditID] = useState(0);
  const [userID, setUserID] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtResponse = JSON.parse(localStorage.getItem('jwtResponse'));
    if (!jwtResponse || !jwtResponse.accessToken) {
      navigate('/login');
      return;
    } 
    // Make an API call to fetch credit requests data when the component mounts
    axios.get("http://localhost:8080/api/bookings/creditrequest", getAxiosConfig())
      .then((response) => {
        setCreditRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching credit requests:', error);
        navigate('/login');
      });
  }, [navigate]);

  const openModal = (amount, creditID, userID) => {
    setAmount(amount);
    setcreditID(creditID);
    setShowModal(true);
    setUserID(userID);
    console.log(userID);
    console.log(creditID);

  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleConfirmAction = (action) => {
    if (action === 'Accept') {
      // Handle the Accept action
      console.log(creditID);
      console.log(userID);
      axios
        .post("http://localhost:8080/api/bookings/creditrequest/confirm",
        {
          userID: userID,
          amount: amount,
          creditRequestID: creditID
        },
        {
          headers: {
            Authorization : JSON.parse(localStorage.getItem('jwtResponse')).accessToken,
            withCredentials: true,
            'Content-Type': 'application/json',
          },
        }
        )
        .then(() => {
          console.log('Credit request processed successfully');
          setShowModal(false);
          window.location.reload();
          setShowSuccessMessage(true);
          setShowErrorMessage(false);
        })
        .catch((error) => {
          console.error('Error processing credit request:', error);
          setShowErrorMessage(true);
          setShowSuccessMessage(false);
        });
    } else if (action === 'Decline') {
      // Handle the Decline action
      axios
        .post("http://localhost:8080/api/bookings/creditrequest/confirm", {
          userID: JSON.parse(localStorage.getItem('jwtResponse')).id,
          refundAmount: 0
        }, getAxiosConfig())
        .then(() => {
          console.log('Credit request declined successfully');
          setShowModal(false);
          setShowSuccessMessage(true);
          setShowErrorMessage(false);
        })
        .catch((error) => {
          console.error('Error declining credit request:', error);
          setShowErrorMessage(true);
          setShowSuccessMessage(false);
        });
    }
  };

  const maxAmount = creditRequests.length > 0 ? creditRequests[0].bookingResponse.amount : 0;

  return (
    <div>
      <MyNavbar />
      <h1>Credit Requests</h1>
      {showSuccessMessage && (
        <Alert variant="success">
          Credit request processed successfully.
        </Alert>
      )}
      {showErrorMessage && (
        <Alert variant="danger">
          Error processing credit request. Please try again.
        </Alert>
      )}
      {creditRequests.length > 0 ? (
        <div>
          {creditRequests.map((creditRequest, index) => (
            <Card key={index} className="mb-3">
              <Card.Header>Credit Request</Card.Header>
              <Card.Body>
                <Card.Title>Username: {creditRequest.username}</Card.Title>
                <Card.Text>
                  <strong>Amount:</strong> {creditRequest.amount}
                  <br />
                  <strong>Facility:</strong> {creditRequest.bookingResponse.facility}
                  <br />
                  <strong>Description:</strong> {creditRequest.bookingResponse.description}
                  <br />
                  <strong>Start Time:</strong> {creditRequest.bookingResponse.startTime}
                  <br />
                  <strong>End Time:</strong> {creditRequest.bookingResponse.endTime}
                  <br />
                  <strong>Date:</strong> {creditRequest.bookingResponse.date}
                  <br />
                  <strong>Location:</strong> {creditRequest.bookingResponse.location}
                  <br />
                </Card.Text>
                <Button variant="primary" onClick={() => openModal(creditRequest.amount, creditRequest.creditID, creditRequest.userID)}>
                  Confirm
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p>No credit requests available.</p>
      )}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Amount (max: {amount})</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={maxAmount}
              />
            </Form.Group>
          </Form>
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

export default withRoleAuthorization(['ROLE_BOOKINGMANAGER'])(AcceptCreditRequest);
