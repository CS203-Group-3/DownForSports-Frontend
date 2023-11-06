import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from "./NavbarComp";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, ListGroup, Card } from "react-bootstrap";
import { getAxiosConfig } from "./Headers";
import { useNavigate } from 'react-router-dom';

function FacilityList() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [dates, setDates] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslotIds, setSelectedTimeslotIds] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingFailure, setBookingFailure] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [userRoles, setUserRoles] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // Add the loading state
  const navigate = useNavigate();

  useEffect(() => {
    const jwtResponse = JSON.parse(localStorage.getItem('jwtResponse'));
    if (!jwtResponse || !jwtResponse.accessToken) {
      navigate('/login');
      return;
    } 

    if (jwtResponse && jwtResponse.roles) {
      setUserRoles(jwtResponse.roles);
    }

    axios
      .get("http://18.141.196.51:8080/api/facilities", getAxiosConfig())
      .then((response) => {
        setFacilities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching facilities:", error);
        navigate('/login');
      });
  }, [navigate]);

  const fetchDates = (facility) => {
    axios
      .get(`http://18.141.196.51:8080/api/facilities/${facility.facilityId}/dates`, getAxiosConfig())
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
      .get(
        `http://18.141.196.51:8080/api/facilities/${selectedFacility.facilityId}/dates/${facilityDateId}/timeslots`, getAxiosConfig()
      )
      .then((response) => {
        console.log("Response from the server:", response.data);

        const timeslotsData = Object.entries(response.data).map(([timeslotId, time]) => ({
          timeslotId,
          time,
          isAvailable: true,
          isSelected: false,
        }));

        setTimeslots(timeslotsData);
        setSelectedTimeslotIds([]);
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

  const isAdjacent = (timeslot) => {
    if (selectedTimeslots.length === 0) {
      return true;
    }

    if (selectedTimeslots.length === 1) {
      const selectedTime = new Date(selectedDate + " " + selectedTimeslots[0].time);
      const newTime = new Date(selectedDate + " " + timeslot.time);
      const timeDifference = Math.abs(newTime - selectedTime) / 36e5;
      return timeDifference === 1;
    }

    return (
      timeslot === selectedTimeslots[0] ||
      timeslot === selectedTimeslots[selectedTimeslots.length - 1]
    );
  };

  const selectTimeslot = (timeslot) => {
    if (isSelected(timeslot)) {
      if (
        timeslot === selectedTimeslots[0] ||
        timeslot === selectedTimeslots[selectedTimeslots.length - 1]
      ) {
        setSelectedTimeslots(selectedTimeslots.filter((selected) => selected !== timeslot));
        setSelectedTimeslotIds(selectedTimeslotIds.filter((id) => id !== timeslot.timeslotId));
      }
    } else {
      const updatedTimeslots = [...selectedTimeslots, timeslot];
      updatedTimeslots.sort((a, b) => a.time.localeCompare(b.time));
  
      setSelectedTimeslots(updatedTimeslots);
      setSelectedTimeslotIds([...selectedTimeslotIds, timeslot.timeslotId]);
    }
  };
  

  const booking = () => {
    if (selectedFacility && selectedDateId && selectedTimeslotIds.length > 0) {
      const lastSelectedTimeslot = selectedTimeslots[selectedTimeslots.length - 1];
      const endDateTime = new Date(selectedDate + " " + lastSelectedTimeslot.time);
      endDateTime.setHours(endDateTime.getHours() + 1);

      const creditsRequired = selectedTimeslotIds.length * selectedFacility.creditCost;
      setTotalCredits(creditsRequired);

      setSelectedEndTime(endDateTime);
      setShowConfirmationDialog(true);
      setBookingSuccess(false);
      setBookingFailure(false);
    } else {
      console.error("Please select a facility, date, and at least one timeslot.");
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedFacility && selectedDateId && selectedTimeslotIds.length > 0) {
      const timeSlotsData = selectedTimeslotIds.map((timeslotId) => {
        const timeslot = timeslots.find((ts) => ts.timeslotId === timeslotId);
        return timeslot.time;
      });

      const bookingRequest = {
        userId: JSON.parse(localStorage.getItem("jwtResponse")).id,
        facilityId: selectedFacility.facilityId,
        timeBookingMade: new Date().toISOString(),
        facilityDate: selectedDate,
        timeSlots: timeSlotsData,
      };

      console.log("Updated timeSlotsData:", timeSlotsData);
      // Set loading to true when the API request is initiated
      setLoading(true);

      try {
        const response = await axios.post("http://18.141.196.51:8080/api/bookings/makebooking", bookingRequest, getAxiosConfig());
        console.log("Booking created:", response.data);

        setBookingSuccess(true);
        setBookingFailure(false);
        setShowConfirmationDialog(false);
        setModalIsOpen(false);
      } catch (error) {
        console.error("Error creating booking:", error);

        setBookingSuccess(false);
        setBookingFailure(true);
      }finally {
        // Set loading to false after the API request is completed (success or failure)
        setLoading(false);
      }
    } else {
      console.error("Please select a facility, date, and at least one timeslot.");
    }
  };

  const openDeleteConfirmation = (facility) => {
    setFacilityToDelete(facility);
    setShowDeleteConfirmation(true); // Show the delete confirmation dialog
  };
  
  const closeDeleteConfirmation = () => {
    setFacilityToDelete(null);
    setShowDeleteConfirmation(false); // Hide the delete confirmation dialog
  };
  
  const deleteFacilityConfirmed = () => {
    // Make sure to close the confirmation dialog after confirming
    if(facilityToDelete) {
      console.log("Cencelling facilily with facilityid: ", facilityToDelete.facilityId);
      axios
      .delete(`http://18.141.196.51:8080/api/facilities/${facilityToDelete.facilityId}`, getAxiosConfig())
      .then((response) => {
        console.log("Facility deleted:", response.data);
        // Refresh the list of facilities after deletion
        axios
          .get("http://18.141.196.51:8080/api/facilities", getAxiosConfig())
          .then((response) => {
            setFacilities(response.data);
          })
          .catch((error) => {
            console.error("Error fetching facilities:", error);
          });
      })
      .catch((error) => {
        console.error("Error deleting facility:", error);
      });
      closeDeleteConfirmation();
    }
  };
  

  const openModal = (facility) => {
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
      {loading && (
        // Display a loading indicator while the API request is in progress
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {bookingSuccess && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Text className="text-success">Booking made successfully!</Card.Text>
          </Card.Body>
        </Card>
      )}
      {bookingFailure && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Text className="text-danger">Booking failed. Please try again.</Card.Text>
          </Card.Body>
        </Card>
      )}

      {facilities.map((facility, index) => (
        <Card key={facility.facilityId} className="mb-3">
          <Card.Header>{facility.facilityType}</Card.Header>
          <Card.Body>
            <Card.Text>
              <strong>Description:</strong> {facility.description}
              <br />
              <strong>Open Time:</strong> {facility.openTime}
              <br />
              <strong>Closing Time:</strong> {facility.closingTime}
              <br />
              <strong>Credit Cost:</strong> {facility.creditCost}
              <br />
              <strong>Location:</strong> {facility.locationString}
            </Card.Text>
            <Card.Text>
              <Button onClick={() => openModal(facility)}>View Dates</Button>
              {userRoles.includes("ROLE_ADMIN") && (
                <>
                  <Button variant="danger" onClick={() => openDeleteConfirmation(facility)}>
                    Delete Facility
                  </Button>
                </>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}

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

      {showConfirmationDialog && (
        <Modal show={showConfirmationDialog} onHide={() => setShowConfirmationDialog(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Facility: {selectedFacility?.facilityType}</p>
            <p>Date: {selectedDate}</p>
            <p>Timeslot Start Time: {selectedTimeslots[0]?.time}</p>
            <p>Timeslot End Time: {selectedEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
            <p>Total Credits Required: {totalCredits}</p>
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
      <Modal show={showDeleteConfirmation} onHide={closeDeleteConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Facility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to delete this facility?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteConfirmation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteFacilityConfirmed}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FacilityList;
