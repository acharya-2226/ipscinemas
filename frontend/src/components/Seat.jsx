import "./Seat.css";

function Seat({ seat, selectedSeats, setSelectedSeats }) {
  const isSelected = selectedSeats.includes(seat.id);
  const isBooked = seat.is_booked;

  function toggleSeat() {
    if (isBooked) return;

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  }

  let seatClass = "seat";
  if (isBooked) {
    seatClass += " booked";
  } else if (isSelected) {
    seatClass += " selected";
  } else {
    seatClass += " available";
  }

  return (
    <button
      className={seatClass}
      onClick={toggleSeat}
      disabled={isBooked}
      title={`${seat.seat_number} - ${isBooked ? "Booked" : "Available"}`}
      aria-label={seat.seat_number}
      type="button"
    >
      <svg className="seat-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        <path d="M14.5 12.5h-13a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V13a.5.5 0 0 0-.5-.5" />
      </svg>
    </button>
  );
}

export default Seat;

