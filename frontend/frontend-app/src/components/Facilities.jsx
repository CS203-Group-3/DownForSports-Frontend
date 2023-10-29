import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function FacilityList() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [dates, setDates] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslotIds, setSelectedTimeslotIds] = useState([]); // Define selectedTimeslotIds
  const navigate = useNavigate();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false); // Add booking success state
  const [bookingFailure, setBookingFailure] = useState(false); // Add booking fail
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/facilities")
      .then((response) => {
        setFacilities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching facilities:", error);
      });
  }, []);

  const fetchDates = (facility) => {
    axios
      .get(`http://localhost:8080/api/facilities/${facility.facilityId}/dates`)
      .then((response) => {
        console.log("response: ", response.data);
        const datesArray = Object.entries(response.data).map(([facilityDateId, date]) => ({
          facilityDateId: facilityDateId,
          date: date,
        }));
        console.log("dates fetched: ", datesArray);
        setDates(datesArray);
      })
      .catch((error) => {
        console.error("Error fetching dates:", error);
      });
  };

  const fetchTimeslots = (facilityDateId) => {
    axios
      .get(`http://localhost:8080/api/facilities/${selectedFacility.facilityId}/dates/${facilityDateId}/timeslots`)
      .then((response) => {
        console.log("Response from the server:", response.data);
  
        // Extract times (values) from the response object
        const timeslotsData = Object.entries(response.data).map(([timeslotId, time]) => ({
          timeslotId,
          time,
          isAvailable: true, // You can set this based on your data
          isSelected: false, // Initialize isSelected to false
        }));
  
        // Set the timeslots data and reset the selected timeslot IDs
        setTimeslots(timeslotsData);
        setSelectedTimeslotIds([]); // Reset selected timeslot IDs
        console.log("Timeslots:", timeslotsData);
      })
      .catch((error) => {
        console.error("Error fetching timeslots:", error);
      });
  };
  
  const selectDate = (selectedDate, selectedDateId) => {
    setSelectedDate(selectedDate);
    setSelectedDateId(selectedDateId);
    setSelectedTimeslots([]);
    fetchTimeslots(selectedDateId);
  };
  
  const isSelected = (timeslot) => {
    return selectedTimeslots.includes(timeslot);
  };
  
  const selectTimeslot = (timeslot) => {
    if (isSelected(timeslot)) {
      setSelectedTimeslots(selectedTimeslots.filter((selected) => selected !== timeslot));
      setSelectedTimeslotIds(selectedTimeslotIds.filter((id) => id !== timeslot.timeslotId));
    } else {
      setSelectedTimeslots([...selectedTimeslots, timeslot]);
      setSelectedTimeslotIds([...selectedTimeslotIds, timeslot.timeslotId]);
    }
  };



  const isAdjacent = (timeslot) => {
    if (selectedTimeslots.length === 0) {
      return true; // If no timeslots are selected, the new timeslot is adjacent.
    }
  
    // Find the indexes of the selected timeslots.
    const lastIndex = timeslots.findIndex((ts) => ts.id === selectedTimeslots[selectedTimeslots.length - 1].id);
    const currentIndex = timeslots.findIndex((ts) => ts.id === timeslot.id);
  
    // Check if the new timeslot is the next one in the list.
    return currentIndex === lastIndex + 1;
  };

  const booking = () => {
    if (selectedFacility && selectedDateId && selectedTimeslotIds.length > 0) {
      // Calculate the end time by adding an hour to the last selected time slot
      const lastSelectedTimeslot = selectedTimeslots[selectedTimeslots.length - 1];
      const endDateTime = new Date(selectedDate + " " + lastSelectedTimeslot.time);
      endDateTime.setHours(endDateTime.getHours() + 1);
  
      // Display the end time in the modal
      setSelectedEndTime(endDateTime);
  
      // Open the confirmation dialog
      setShowConfirmationDialog(true);
      setBookingSuccess(false);
      setBookingFailure(false);
    } else {
      console.error("Please select a facility, date, and at least one timeslot.");
    }
  };
  

  const handleConfirmBooking = async () => {
    if (selectedFacility && selectedDateId && selectedTimeslotIds.length > 0) {
      // Create a function to format the TimeSlots array
      const formatTimeSlots = (timeslotIds, timeslotData) => {
        return timeslotIds.map((timeslotId) => {
          const timeslot = timeslotData.find((ts) => ts.timeslotId === timeslotId);
          return {
            timeSlotsId: timeslotId,
            startTime: timeslot.time,
          };
        });
      };

      // Format the TimeSlots array
      const timeSlotsData = formatTimeSlots(selectedTimeslotIds, selectedTimeslots);

      // Create the booking request
      const bookingRequest = {
        userId: JSON.parse(localStorage.getItem('jwtResponse')).id,
        facilityId: selectedFacility.facilityId,
        //timeBookingMade: new Date().toISOString(),
        facilityDate: selectedDate,
        timeSlots: timeSlotsData,
      };

      console.log("Booking Request:", bookingRequest);

      try {
        const response = await axios.post("http://localhost:8080/api/bookings/makebooking", bookingRequest);
        console.log("Booking created:", response.data);
        // Handle successful booking creation

        // Show success message
        setBookingSuccess(true);
        setBookingFailure(false);
        setShowConfirmationDialog(false);

        // Optional: Navigate to another page
        navigate("/upcomingBookings");
      } catch (error) {
        console.error("Error creating booking:", error);
        // Handle booking creation error

        // Show failure message
        setBookingSuccess(false);
        setBookingFailure(true);
        setShowConfirmationDialog(false);
      }
    } else {
      console.error("Please select a facility, date, and at least one timeslot.");
    }
  };

  const openModal = (facility) => {
    console.log("Clicked Facility:", facility);
    setSelectedFacility(facility);
    setSelectedDate(null);
    setSelectedDateId(null);
    setSelectedTimeslots([]);
    fetchDates(facility);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFacility(null);
    setSelectedDate(null);
    setSelectedDateId(null);
    setSelectedTimeslots([]);
    setModalIsOpen(false);
  };

  return (
    <div>
      <MyNavbar />
      <h1>Facility List</h1>
        {bookingSuccess && (
        <Alert variant="success">
          Booking made successfully!
        </Alert>
      )}
      {/* Display failure message */}
      {bookingFailure && (
        <Alert variant="danger">
          Booking failed. Please try again.
        </Alert>
      )}
      <ul>
        {facilities.map((facility) => (
          <li key={facility.facilityId}>
            <strong>Facility Type:</strong> {facility.facilityType}
            <br />
            <strong>Description:</strong> {facility.description}
            <Button onClick={() => openModal(facility)}>View Dates</Button>
          </li>
        ))}
      </ul>

      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          {selectedDate ? (
            <Modal.Title>Timeslots for Date: {selectedDate}</Modal.Title>
          ) : (
            <Modal.Title>Dates for Facility: {selectedFacility?.facilityType}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "scroll" }}>
          {selectedDate ? (
            <>
              <h5>Timeslots Available:</h5>
              <ListGroup>
                {timeslots.map((timeslot) => (
                  <ListGroup.Item key={timeslot.timeslotId}>
                    <input
                      type="checkbox"
                      id={`timeslot-${timeslot.timeslotId}`}
                      checked={isSelected(timeslot)}
                      onChange={() => selectTimeslot(timeslot)}
                      disabled={!isAdjacent(timeslot)}
                    />
                    <label htmlFor={`timeslot-${timeslot.timeslotId}`}>
                      {timeslot.time} - {timeslot.isAvailable ? "Available" : "Not Available"}
                    </label>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          ) : (
            <>
              <h5>Dates Available:</h5>
              <ListGroup>
                {Array.isArray(dates) ? (
                  dates.map((date) => (
                    <ListGroup.Item
                      key={date.facilityDateId}
                      onClick={() => selectDate(date.date, date.facilityDateId)}
                      style={{ textDecoration: "none", color: "black" }}
                      className="list-group-item"
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = "underline";
                        e.target.style.color = "blue";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = "none";
                        e.target.style.color = "black";
                      }}
                    >
                      {date.date}
                    </ListGroup.Item>
                  ))
                ) : (
                  <p>No dates available</p>
                )}
              </ListGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedDate ? (
            <Button variant="secondary" onClick={() => setSelectedDate(null)}>
              Back to Dates
            </Button>
          ) : null}
          {selectedDate ? (
            <Button variant="primary" onClick={booking}>
              Book
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>

      {/* Confirmation Dialog */}
      {showConfirmationDialog && (
        <Modal show={showConfirmationDialog} onHide={() => setShowConfirmationDialog(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Facility: {selectedFacility?.facilityType}</p>
            <p>Date: {selectedDate}</p>
            <p>Timeslot Start Time: {selectedTimeslots[0]?.time}</p>
            {selectedEndTime && (
              <p>Timeslot End Time: {selectedEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmationDialog(false)}>
              Go Back
            </Button>
            <Button variant="primary" onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default FacilityList;