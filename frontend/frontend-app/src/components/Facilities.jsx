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
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch facilities data from your API endpoint
    axios.get("http://localhost:8080/api/facilities")
      .then((response) => {
        setFacilities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching facilities:", error);
      });
  }, []);

  // Function to open the modal and set the selected facility
  const openModal = (facility) => {
    setSelectedFacility(facility);
    setSelectedDate(null); // Reset selected date
    setSelectedTimeslots([]); // Reset selected timeslots
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedFacility(null);
    setSelectedDate(null);
    setSelectedTimeslots([]);
    setModalIsOpen(false);
  };

  // Hardcoded sample data for dates and timeslots (for testing purposes)
  const sampleDates = [
    {
      date: "2023-11-01",
      timeslots: [
        { time: "09:00", isAvailable: true },
        { time: "10:00", isAvailable: false },
        { time: "11:00", isAvailable: true },
        { time: "12:00", isAvailable: true },
      ],
    },
    {
      date: "2023-11-02",
      timeslots: [
        { time: "09:00", isAvailable: true },
        { time: "10:00", isAvailable: true },
        { time: "11:00", isAvailable: false },
        { time: "12:00", isAvailable: true },
      ],
    },
    // Add more dates and timeslots as needed
  ];

  async function booking() {
    navigate("/upcomingBookings");
  }

  // Function to set the selected date and show the timeslots for that date
  const selectDate = (date) => {
    setSelectedDate(date);
    setSelectedTimeslots([]); // Clear selected timeslots when a new date is selected
  };

  const selectTimeslot = (timeslot) => {
    if (isSelected(timeslot)) {
      // If the timeslot is already selected, remove it from the list
      setSelectedTimeslots(selectedTimeslots.filter((selected) => selected !== timeslot));
    } else if (isAdjacent(timeslot)) {
      // If the timeslot is adjacent, add it to the list
      setSelectedTimeslots([...selectedTimeslots, timeslot]);
    }
  };

  const isSelected = (timeslot) => {
    // Check if the timeslot is already selected
    return selectedTimeslots.includes(timeslot);
  };

  const isAdjacent = (timeslot) => {
    if (selectedTimeslots.length === 0) {
      // If no timeslots are selected, any timeslot can be selected
      return true;
    }

    // Check if the timeslot is adjacent to the last selected timeslot
    const lastSelectedTimeslot = selectedTimeslots[selectedTimeslots.length - 1];
    // You can implement this based on your specific requirements
    // For example, you can check if the timeslots are consecutive
    // For example, if they are in the same order
    const timeslots = selectedDate.timeslots.map((ts) => ts.time);
    return timeslots.indexOf(timeslot.time) === timeslots.indexOf(lastSelectedTimeslot.time) + 1;
  };

  return (
    <div>
      <MyNavbar />
      <h1>Facility List</h1>
      <ul>
        {facilities.map((facility) => (
          <li key={facility.id}>
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
            <Modal.Title>Timeslots for Date: {selectedDate.date}</Modal.Title>
          ) : (
            <Modal.Title>Dates for Facility: {selectedFacility?.facilityType}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "scroll" }}>
        {selectedDate ? (
          <>
            <h5>Timeslots Available:</h5>
              <ListGroup>
                {selectedDate.timeslots.map((timeslot, index) => (
                  <ListGroup.Item key={index}>
                    <input
                      type="checkbox"
                      id={`timeslot-${index}`}
                      checked={isSelected(timeslot)}
                      onChange={() => selectTimeslot(timeslot)}
                      disabled={!isAdjacent(timeslot)}
                    />
                    <label htmlFor={`timeslot-${index}`}>
                      {timeslot.time} - {timeslot.isAvailable ? "Available" : "Not Available"}
                    </label>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            {/* <Button variant="primary" onClick={booking}>
              Book
            </Button> */}
          </>
        ) : (
          <>
            <h5>Dates Available:</h5>
            <ListGroup>
              {sampleDates.map((date, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() => selectDate(date)}
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
              ))}
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
