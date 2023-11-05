import React, { useState, useEffect, useRef } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card, Button, Modal, Alert } from 'react-bootstrap';
import { getAxiosConfig } from './Headers';

function UpcomingBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 
  const userId = JSON.parse(localStorage.getItem('jwtResponse')).id;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/bookings/viewupcomingbookings", {
        params: {
          userId: userId,
        },
        headers: {
          Authorization: JSON.parse(localStorage.getItem('jwtResponse')).accessToken,
          withCredentials: true,
        },
      })
      .then((response) => {
        console.log("View response: ", response.data);
        setUpcomingBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching upcoming bookings:', error);
      });
  }, [userId]);

 
  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const confirmCancelBooking = () => {
    if (bookingToCancel) {
      console.log('Canceling booking with bookingId:', bookingToCancel.bookingId); // Log the bookingId
      axios
        .post("http://localhost:8080/api/bookings/cancelbooking", { bookingId: bookingToCancel.bookingId }, getAxiosConfig())
        .then((response) => {
          console.log("Booking canceled:", response.data);
          // Handle success and display a confirmation message
          setSuccessMessage("Booking deleted successfully");
          // You can also refresh the list of upcoming bookings
          // Refresh the list of upcoming bookings
          axios
            .get("http://localhost:8080/api/bookings/viewupcomingbookings", {
              params: {
                userId: userId,
              },
              headers: {
                Authorization: JSON.parse(localStorage.getItem('jwtResponse')).accessToken,
                withCredentials: true,
              },
            })
            .then((refreshedData) => {
              setUpcomingBookings(refreshedData.data);
            })
            .catch((error) => {
              console.error('Error fetching upcoming bookings after cancellation:', error);
            });
          closeCancelModal();
        })
        .catch((error) => {
          console.error('Error canceling booking:', error);
          // Handle the error and display an error message
          closeCancelModal();
        });
    }
  };

  return (
    <div>
      <MyNavbar />
            <h1>Upcoming Bookings</h1>
            {successMessage && (
              <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                {successMessage}
              </Alert>
            )}
            {upcomingBookings.length > 0 ? (
              <div>
                {upcomingBookings.map((booking, index) => (
                  <Card key={index} className="mb-3">
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
                      <Button variant="danger" onClick={() => openCancelModal(booking)}>
                        Cancel Booking
                      </Button>
                    </Card.Footer>
                  </Card>
                  ))}
                  </div>
                  ) : (
                    <p>You have no upcoming bookings.</p>
                  )}
      <Modal show={showCancelModal} onHide={closeCancelModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCancelModal}>
            No, Go Back
          </Button>
          <Button variant="danger" onClick={confirmCancelBooking}>
            Yes, Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default UpcomingBookings;