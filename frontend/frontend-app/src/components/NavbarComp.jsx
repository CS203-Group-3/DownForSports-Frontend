import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

// Sample profile picture URL (replace with your actual URL)
const userProfilePicture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvQOzLVWtuIaOlLcxtYyFdnQVDUHcGKTaCRQ&usqp=CAU';
const profilePictureStyle = {
  maxWidth: '40px', // Set the maximum width of the image
  maxHeight: '40px', // Set the maximum height of the image
};

function MyNavbar() {
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    // Fetch user roles from local storage
    const jwtResponse = JSON.parse(localStorage.getItem('jwtResponse'));
    if (jwtResponse && jwtResponse.roles) {
      setUserRoles(jwtResponse.roles);
    }
  }, []);

  // Logout function to remove the JWT token from localStorage
  function logout() {
    localStorage.removeItem('jwtResponse');
    // Redirect to the login page or any other desired page
    navigate('/login');
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/home">Facility Booking</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/facilities">Facilities</Nav.Link>
            {userRoles.includes('ROLE_ADMIN') && (
              <Nav.Link as={Link} to="/create-facility">Create Facility</Nav.Link>
            )}
            <NavDropdown title="Booking Details" id="basic-nav-dropdown">
              <NavDropdown.Item href="/past-Bookings">Past Bookings</NavDropdown.Item>
              <NavDropdown.Item href="/upcoming-Bookings">Upcoming Bookings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/facilites">Book a facility</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown title={<img src={userProfilePicture} alt="Profile" style={profilePictureStyle} />} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
