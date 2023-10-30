import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card } from 'react-bootstrap';

function PastBookings() {
  const [pastBookings, setPastBookings] = useState([]);
  const userId = JSON.parse(localStorage.getItem('jwtResponse')).id;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/bookings/viewpastbookings", {
        params: {
          userId: userId, // Include userId as a query parameter
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
            </Card>
          ))}
        </div>
      ) : (
        <p>You have no past bookings.</p>
      )}
    </div>
  );
}

export default PastBookings;

