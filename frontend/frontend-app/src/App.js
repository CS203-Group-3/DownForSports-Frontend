import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import WelcomePage from "./components/Welcomepage";
import Profile from "./components/Profile";
import CreateFacility from './components/CreateFacility';
import FacilityList from "./components/Facilities";
import ChangePassword from "./components/ChangePassword";
import UpcomingBookings from "./components/UpcomingBookings";
import PastBookings from "./components/PastBookings";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-facility" element={<CreateFacility />} /> 
          <Route path="/facilities" element={<FacilityList />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/upcoming-Bookings" element={<UpcomingBookings />} />
          <Route path="/past-Bookings" element={<PastBookings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
