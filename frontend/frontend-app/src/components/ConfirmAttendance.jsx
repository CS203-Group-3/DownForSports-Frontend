import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Tabs, Tab, Card, Button, Modal } from 'react-bootstrap'; // Import Tabs and Tab from React-Bootstrap

function ConfirmAttendance() {
  const [bookings, setBookings] = useState([
    {
      bookingId: 1,
      facility: "Sample Facility 1",
      description: "Sample Description 1",
      startTime: "2023-11-01 09:00",
      endTime: "2023-11-01 11:00",
      date: "2023-11-01",
      location: "Sample Location 1",
      bookingAttendanceChecked: false,
    },
    {
      bookingId: 2,
      facility: "Sample Facility 2",
      description: "Sample Description 2",
      startTime: "2023-11-02 14:00",
      endTime: "2023-11-02 16:00",
      date: "2023-11-02",
      location: "Sample Location 2",
      bookingAttendanceChecked: true,
    },
    {
      bookingId: 3,
      facility: "Sample Facility 3",
      description: "Sample Description 3",
      startTime: "2023-11-01 14:00",
      endTime: "2023-11-01 16:00",
      date: "2023-11-01",
      location: "Sample Location 3",
      bookingAttendanceChecked: true,
    },
    {
      bookingId: 4,
      facility: "Sample Facility 4",
      description: "Sample Description 4",
      startTime: "2023-11-03 14:00",
      endTime: "2023-11-03 16:00",
      date: "2023-11-03",
      location: "Sample Location 4",
      bookingAttendanceChecked: false,
    },
    {
      bookingId: 5,
      facility: "Sample Facility 5",
      description: "Sample Description 5",
      startTime: "2023-11-04 14:00",
      endTime: "2023-11-04 16:00",
      date: "2023-11-04",
      location: "Sample Location 5",
      bookingAttendanceChecked: false,
    },
    // Add more sample bookings as needed
  ]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // Fetch all bookings from the API
    axios.get('http://localhost:8080/api/bookings/')
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (id) => {
    setBookingId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmAttendance = (attendanceStatus) => {
    axios.post('http://localhost:8080/api/bookings/confirmbookingattendance', {
      bookingId: bookingId,
      attendanceStatus: attendanceStatus
    })
    .then((response) => {
      console.log('Attendance confirmed successfully.');
      handleCloseModal();
      window.location.reload(); // Reload the page
    })
    .catch((error) => {
      console.error('Error confirming attendance:', error);
    });
  };

  // Get the current date in the format "yyyy-MM-dd"
  const today = new Date().toISOString().split('T')[0];

  // Filter today's bookings
  const todayBookings = bookings.filter((booking) => booking.date === today);

  // Filter upcoming bookings (exclude today's bookings)
  const upcomingBookings = bookings.filter((booking) => booking.date > today && !todayBookings.includes(booking));

  return (
    <div>
      <MyNavbar />
      <h1>Confirm Attendance</h1>

      <Tabs defaultActiveKey="today" id="bookings-tabs">
        <Tab eventKey="today" title="Today's Bookings">
          <div className="container">
            <div className="row">
              {todayBookings.map((booking) => (
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
        </Tab>
        <Tab eventKey="upcoming" title="Upcoming Bookings">
          <div className="container">
            <div className="row">
              {upcomingBookings.map((booking) => (
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
        </Tab>
      </Tabs>

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
