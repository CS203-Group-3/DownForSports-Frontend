import Navbar from "./Navbar";
import BookingSlot from "./BookingSlot";
import timings from "../timings";
import { useState } from "react";
import BookingDate from "./BookingDate";
import dates from "../Dates";

function FacilityBookingPage() {
  return (
    <div>
      <Navbar />
      {dates.map((bookingDate) => (
        <BookingDate key={bookingDate.key} date={bookingDate.date} />
      ))}
    </div>
  );
}

export default FacilityBookingPage;
