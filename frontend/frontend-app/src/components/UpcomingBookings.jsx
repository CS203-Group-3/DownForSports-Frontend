import React, { useState, useEffect } from 'react';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function UpcomingBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const userId = JSON.parse(localStorage.getItem('jwtResponse')).id;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/bookings/viewupcomingbookings", {
        params: {
          userId: userId, // Include userId as a query parameter
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

  return (
    <div>
      <MyNavbar />
      <h1>Upcoming Bookings</h1>
      {upcomingBookings.length > 0 ? (
        <ul>
          {upcomingBookings.map((booking, index) => (
            <li key={index}>
              <strong>Facility: </strong> {booking.facility}
              <br />
              <strong>Description: </strong> {booking.description}
              <br />
              <strong>Start Time: </strong> {booking.startTime}
              <br />
              <strong>End Time: </strong> {booking.endTime}
              <br />
              <strong>Date: </strong> {booking.date}
              <br />
              <strong>Location: </strong> {booking.location}
              <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no upcoming bookings.</p>
      )}
    </div>
  );
}

export default UpcomingBookings;

