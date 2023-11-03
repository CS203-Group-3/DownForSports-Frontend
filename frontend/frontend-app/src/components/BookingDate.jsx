import React from "react";
import "../../public/styles.css";
import BookingSlot from "./BookingSlot";
import timings from "../timings";

function BookingDate(props) {
  return (
    <div className="BookingDate">
      <h3>{props.date}</h3>
      {timings.map((bookingSlot) => (
        <BookingSlot key={bookingSlot.key} start={bookingSlot.start} />
      ))}
    </div>
  );
}

export default BookingDate;
