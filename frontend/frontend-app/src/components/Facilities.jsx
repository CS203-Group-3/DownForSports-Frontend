import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, ListGroup } from 'react-bootstrap';
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

  // async function booking() {
  //   // Pass selectedFacility, selectedDateId, and selectedTimeslotIds to the booking page
  //   navigate("/upcomingBookings", {
  //     state: {
  //       facility: selectedFacility,
  //       facilityDateId: selectedDateId,
  //       selectedTimeslotIds,
  //     },
  //   });
  // }

  const booking = async () => {
    if (selectedFacility && selectedDateId && selectedTimeslotIds.length > 0) {
      // 1. Create a function to format the TimeSlots array
      const formatTimeSlots = (timeslotIds, timeslotData) => {
        return timeslotIds.map((timeslotId) => {
          const timeslot = timeslotData.find((ts) => ts.timeslotId === timeslotId);
          return {
            timeSlotsId: timeslotId,
            startTime: timeslot.time,
          };
        });
      };
  
      // 2. Format the TimeSlots array
      const timeSlotsData = formatTimeSlots(selectedTimeslotIds, selectedTimeslots);
  
      // 3. Create the booking request
      const bookingRequest = {
        userId: JSON.parse(localStorage.getItem('jwtResponse')).id,
        facilityId: selectedFacility.facilityId,
        timeBookingMade: new Date().toISOString(), // Format the date as needed
        facilityDate: selectedDate,
        timeSlots: timeSlotsData, // Use the formatted array
      };
  
      console.log("Booking Request:", bookingRequest);
  
      // Send the booking request to the backend
      try {
        const response = await axios.post("http://localhost:8080/api/bookings/makebooking", bookingRequest);
        console.log("Booking created:", response.data);
        // Handle successful booking creation
      } catch (error) {
        console.error("Error creating booking:", error);
        // Handle booking creation error
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
    </div>
  );
}

export default FacilityList;