import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';

function FacilityList() {
  const [facilities, setFacilities] = useState([]);

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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FacilityList;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import MyNavbar from './NavbarComp';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Modal, Button } from 'react-bootstrap';

// function FacilityList() {
//   const [facilities, setFacilities] = useState([]);
//   const [selectedFacility, setSelectedFacility] = useState(null);
//   const [timeslots, setTimeslots] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   useEffect(() => {
//     // Fetch facilities data from your API endpoint
//     axios.get("http://localhost:8080/api/facilities")
//       .then((response) => {
//         setFacilities(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching facilities:", error);
//       });
//   }, []);

//   // Function to open the modal and set the selected facility
//   const openModal = (facility) => {
//     setSelectedFacility(facility);

//     // Fetch timeslots for the selected facility
//     axios.get(`http://localhost:8080/api/facilities/${facility.facilityId}/bookings`)
//       .then((response) => {
//         setTimeslots(response.data);
//         setModalIsOpen(true); // Open the modal
//       })
//       .catch((error) => {
//         console.error("Error fetching timeslots:", error);
//       });
//   };

//   // Function to close the modal
//   const closeModal = () => {
//     setSelectedFacility(null);
//     setModalIsOpen(false);
//     setTimeslots([]);
//   };

//   return (
//     <div>
//       <MyNavbar />
//       <h1>Facility List</h1>
//       <ul>
//         {facilities.map((facility) => (
//           <li key={facility.facilityId}>
//             <strong>Facility Type:</strong> {facility.facilityType}
//             <br />
//             <strong>Description:</strong> {facility.description}
//             <button onClick={() => openModal(facility)} className="view-timeslots-button">
//               View Timeslots
//             </button>
//           </li>
//         ))}
//       </ul>

//       <Modal show={modalIsOpen} onHide={closeModal} backdrop="static" keyboard={false}>
//         <Modal.Header closeButton>
//           <Modal.Title>Timeslots for Facility: {selectedFacility?.facilityType}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <ul>
//           {timeslots.slice(0, -1).map((timeslot, index) => (
//   <li key={index}>
//     {/* Display timeslot details here */}
//     <strong>Start Time:</strong> {timeslot}
//     <br />
//     <strong>End Time:</strong>{" "}
//     {index < timeslots.length - 1 ? timeslots[index + 1] : "N/A"}
//   </li>
// ))}

//           </ul>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={closeModal}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default FacilityList;
