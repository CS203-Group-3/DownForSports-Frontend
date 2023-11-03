import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card, Button, Modal, Form } from 'react-bootstrap';

function PastBookings() {
  const [pastBookings, setPastBookings] = useState([
    {
      facility: "Sample Facility 1",
      description: "Sample Description 1",
      startTime: "2023-10-01 09:00",
      endTime: "2023-10-01 11:00",
      date: "2023-10-01",
      location: "Sample Location 1",
    },
    {
      facility: "Sample Facility 2",
      description: "Sample Description 2",
      startTime: "2023-10-02 14:00",
      endTime: "2023-10-02 16:00",
      date: "2023-10-02",
      location: "Sample Location 2",
    },
    {
      facility: "Sample Facility 3",
      description: "Sample Description 3",
      startTime: "2023-10-03 10:00",
      endTime: "2023-10-03 12:00",
      date: "2023-10-03",
      location: "Sample Location 3",
    },
    // Add more sample past bookings as needed
  ]);

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [bookingIdForCreditAppeal, setBookingIdForCreditAppeal] = useState(null);

  const userId = JSON.parse(localStorage.getItem('jwtResponse')).id;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/bookings/viewpastbookings", {
        params: {
          userId: userId,
        },
      })
      .then((response) => {
        console.log("View response: ", response.data);
        setPastBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching past bookings:', error);
      });
  }, [userId]);

  const openModal = (bookingId) => {
    setBookingIdForCreditAppeal(bookingId); // Set the bookingId for credit appeal
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFormSubmit = () => {
    const creditRequestData = {
      amount: parseInt(amount),
      details: description,
      bookingId: bookingIdForCreditAppeal,
    };
  
    axios
      .post("http://localhost:8080/api/bookings/creditrequest", creditRequestData)
      .then((response) => {
        console.log("Credit request created:", response.data);
        setConfirmationMessage("Request sent successfully");
        setShowConfirmationModal(true);
      })
      .catch((error) => {
        console.error("Error creating credit request:", error);
        setConfirmationMessage("Request failed");
        setShowConfirmationModal(true);
      });
  };
  
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div>
      <MyNavbar />
      <h1>Past Bookings</h1>
      {pastBookings.length > 0 ? (
        <div>
          {pastBookings.map((booking, index) => (
            <Card key={index} className="mb-3">
              <Card.Header>Past Booking</Card.Header>
              <Card.Body>
                <Card.Title>Facility: {booking.facility}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {booking.description}
                  <br />
                  <strong>Start Time:</strong> {booking.startTime}
                  <br />
                  <strong>End Time:</strong> {booking.endTime}
                  <br />
                  <strong>Date:</strong> {booking.date}
                  <br />
                  <strong>Location:</strong> {booking.location}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" onClick={() => openModal(booking.bookingId)}>
                  Credit Appeal
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <p>You have no past bookings.</p>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Credit Appeal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmationModal} onHide={closeConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{confirmationMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PastBookings;

