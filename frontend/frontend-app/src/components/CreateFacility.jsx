import React from 'react';
import MyNavbar from './NavbarComp';
import CreateFacilityForm from './CreateFacilityForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import withRoleAuthorization from './RoleAuthorization';

function createFacility() {
  return (
    <div>
      <MyNavbar />
      <CreateFacilityForm />
    </div>
  );
}

export default withRoleAuthorization(['ROLE_ADMIN'])(createFacility);

