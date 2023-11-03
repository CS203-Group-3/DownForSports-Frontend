import "./NavbarStyles.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import AccountMenu from "./AccountMenu";

function Navbar() {
  return (
    <nav>
      <h1 href="index.html">Facility Booking</h1>

      <div>
        <ul id="navbar">
          <li>
            <a href="index.html">Home</a>
          </li>
          <li>
            <a href="index.html" className="active">
              Booking
            </a>
          </li>
          <li>
            <a href="index.html">Contact</a>
          </li>
          <li>
            <a href="index.html">About</a>
          </li>
        </ul>
      </div>
      <div>
        {/* <AccountCircleIcon className="profileIcon" /> */}
        <AccountMenu />
      </div>
    </nav>
  );
}

export default Navbar;
