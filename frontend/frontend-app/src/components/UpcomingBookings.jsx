import React, { useState } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import axios from 'axios';

function ConfirmAttendance() {
  const [showModal, setShowModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookings, setBookings] = useState([]);


  const handleOpenModal = (id) => {
    setBookingId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmAttendance = (attendanceStatus) => {
    axios.post('http://localhost:8080/api/confirmbookingattendance', {
      bookingId: bookingId,
      attendanceStatus: attendanceStatus
    })
    .then((response) => {
      console.log('Attendance confirmed successfully.');
      handleCloseModal();
    })
    .catch((error) => {
      console.error('Error confirming attendance:', error);
    });
  };

  return (
    <div>
      <h1>Confirm Attendance</h1>
      <div className="container">
        <div className="row">
          {bookings.map((booking) => (
            <div className="col-md-4 mb-3" key={booking.bookingId}>
              <Card>
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
                  <Button variant="primary" onClick={() => handleOpenModal(booking.bookingId)}>Confirm Attendance</Button>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Did you attend this booking?</p>
          <Button onClick={() => handleConfirmAttendance(1)}>Present</Button>
          <Button onClick={() => handleConfirmAttendance(-1)}>No Show</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConfirmAttendance;
