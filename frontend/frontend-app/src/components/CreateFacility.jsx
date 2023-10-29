import React from 'react';
import MyNavbar from './NavbarComp';
import CreateFacilityForm from './CreateFacilityForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function createFacility() {
  return (
    <div>
      <MyNavbar />
      <CreateFacilityForm />
    </div>
  );
}

export default createFacility;

