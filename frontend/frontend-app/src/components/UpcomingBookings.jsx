import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card, Button, Modal, Alert, Tabs, Tab } from 'react-bootstrap';
import { getAxiosConfig } from './Headers';
import { useNavigate } from 'react-router-dom';

function UpcomingBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [refundAmount, setRefundAmount] = useState(null); // New state for refund amount
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  const jwtResponse = JSON.parse(localStorage.getItem('jwtResponse'));

  useEffect(() => {
    if (!jwtResponse || !jwtResponse.accessToken) {
      navigate('/login');
      return;
    }
    const userId = jwtResponse.id;
    axios
      .get("http://18.141.196.51:8080/api/bookings/viewupcomingbookings", {
        params: {
          userId: userId,
        },
        headers: {
          Authorization: jwtResponse.accessToken,
          withCredentials: true,
        },
      })
      .then((response) => {
        console.log("View response: ", response.data);

        const sortedBookings = response.data.sort((a, b) => {
          const dateTimeA = new Date(a.date + ' ' + a.startTime);
          const dateTimeB = new Date(b.date + ' ' + b.startTime);
          return dateTimeA - dateTimeB;
        });

        setUpcomingBookings(sortedBookings);
      })
      .catch((error) => {
        console.error('Error fetching upcoming bookings:', error);
      });
  }, [navigate]);

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);

    // Calculate refund amount here based on the difference in days between today and the chosen booking
    const dateBooked = new Date(booking.date);
    const currentDate = new Date();
    dateBooked.setHours(0, 0, 0, 0); // Set time to midnight
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    const daysDifference = Math.floor((dateBooked - currentDate) / (1000 * 60 * 60 * 24));
    let refundAmount = 0;
    if (daysDifference >= 6) {
      refundAmount = booking.creditDeducted; // 100% refund
    } else if (daysDifference === 5) {
      refundAmount = booking.creditDeducted * 0.8; // 80% refund
    } else if (daysDifference >= 3 && daysDifference <= 4) {
      refundAmount = booking.creditDeducted * 0.5; // 50% refund
    }

    // Set the calculated refund amount
    setRefundAmount(refundAmount);
    console.log(`Days difference: ${daysDifference}`);
    console.log(`Refund amount: ${refundAmount}`);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
    setRefundAmount(null); // Reset refund amount
  };

  const confirmCancelBooking = () => {
    if (bookingToCancel) {
      console.log('Canceling booking with bookingId:', bookingToCancel.bookingId);
      axios
        .post("http://18.141.196.51:8080/api/bookings/cancelbooking", { bookingId: bookingToCancel.bookingId }, getAxiosConfig())
        .then((response) => {
          console.log("Booking canceled:", response.data);
          setSuccessMessage("Booking deleted successfully");
          axios
            .get("http://18.141.196.51:8080/api/bookings/viewupcomingbookings", {
              params: {
                userId: jwtResponse.id,
              },
              headers: {
                Authorization: jwtResponse.accessToken,
                withCredentials: true,
              },
            })
            .then((refreshedData) => {
              const sortedBookings = refreshedData.data.sort((a, b) => {
                const dateTimeA = new Date(a.date + ' ' + a.startTime);
                const dateTimeB = new Date(b.date + ' ' + b.startTime);
                return dateTimeA - dateTimeB;
              });

              setUpcomingBookings(sortedBookings);
            })
            .catch((error) => {
              console.error('Error fetching upcoming bookings after cancellation:', error);
            });
          closeCancelModal();
        })
        .catch((error) => {
          console.error('Error canceling booking:', error);
          closeCancelModal();
        });
    }
  };

  const todayBookings = upcomingBookings.filter((booking) => booking.date === today);
  const futureBookings = upcomingBookings.filter((booking) => booking.date > today);

  return (
    <div>
      <MyNavbar />
      <h1>Upcoming Bookings</h1>
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}
      <Tabs defaultActiveKey="today" id="bookings-tabs">
        <Tab eventKey="today" title="Today's Bookings">
          <div>
            {todayBookings.map((booking, index) => (
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
        </Tab>
        <Tab eventKey="future" title="Future Bookings">
          <div>
            {futureBookings.map((booking, index) => (
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
        </Tab>
      </Tabs>
      <Modal show={showCancelModal} onHide={closeCancelModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {refundAmount !== null && (
            <p>
              Are you sure you want to cancel this booking? You will be refunded {refundAmount} credits.
            </p>
          )}
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
