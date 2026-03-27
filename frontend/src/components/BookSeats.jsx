import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE, createBooking, getProfile, getSeats } from "../api";
import Seat from "./Seat";
import BookingConfirmation from "./BookingConfirmation";
import "./BookSeats.css";

function BookSeats({ showId, onBack }) {
  const { showId: routeShowId } = useParams();
  const navigate = useNavigate();
  const activeShowId = showId || routeShowId;

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!activeShowId) return;

    getSeats(activeShowId).then((data) => setSeats(Array.isArray(data) ? data : []));

    getProfile().then((data) => setUser(data)).catch(() => {});

    fetch(`${API_BASE}/shows/${activeShowId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load show");
        return res.json();
      })
      .then((data) => setShow(data))
      .catch(() => {});
  }, [activeShowId]);

  function handleBooking() {
    if (!selectedSeats.length) {
      alert("Select at least one seat");
      return;
    }

    const moviePrice = parseFloat(show?.movie_price ?? show?.price ?? 0);

    createBooking(activeShowId, selectedSeats, moviePrice)
      .then(() => setShowConfirmation(true))
      .catch(() => {
        alert("Booking failed!");
      });
  }

  function handleBack() {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    navigate("/");
  }

  function handleConfirmationClose() {
    setShowConfirmation(false);
    setSelectedSeats([]);
    handleBack();
  }

  // Group seats by row
  const seatsByRow = {};
  seats.forEach((seat) => {
    const row = seat.seat_number.charAt(0);
    if (!seatsByRow[row]) seatsByRow[row] = [];
    seatsByRow[row].push(seat);
  });

  const sortedRows = Object.keys(seatsByRow).sort();

  const totalPrice = show
    ? (selectedSeats.length * parseFloat(show.movie_price ?? show.price ?? 0)).toFixed(2)
    : "0.00";

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="booking-header mb-4">
        <div className="header-left">
          <h2>Select Seats</h2>
        </div>
        <div className="header-right">
          {user && (
            <div className="user-profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="user-icon"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
              </svg>
              <span className="username">{user.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Seats Panel */}
      <div className="selected-seats-panel mb-4">
        <div className="selected-seats-header">
          <h5>Selected Seats ({selectedSeats.length})</h5>
        </div>
        <div className="selected-seats-list">
          {selectedSeats.length > 0 ? (
            seats
              .filter((s) => selectedSeats.includes(s.id))
              .map((s) => s.seat_number)
              .sort((a, b) => {
                const rowA = a.charCodeAt(0);
                const rowB = b.charCodeAt(0);
                if (rowA !== rowB) return rowA - rowB;
                return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10);
              })
              .map((seatNumber) => (
                <span key={seatNumber} className="seat-badge">{seatNumber}</span>
              ))
          ) : (
            <p className="no-seats-text">No seats selected yet</p>
          )}
        </div>
      </div>

      {/* Cinematic Screen */}
      <div className="screen-wrapper">
        <div className="screen-glass">
          <span className="screen-text">SCREEN</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid-wrapper mb-4">
        <div className="seat-grid">
          <div className="headers-row">
            <div className="row-label-header"></div>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={`col-${i + 1}`} className="column-header">{i + 1}</div>
            ))}
          </div>

          {sortedRows.map((row) => (
            <div key={`row-${row}`} className="seat-row">
              <div className="row-label">{row}</div>
              {Array.from({ length: 10 }, (_, i) => {
                const seat = seatsByRow[row].find((s) => s.seat_number === `${row}${i + 1}`);
                return seat ? (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                  />
                ) : (
                  <div key={`empty-${row}-${i + 1}`} className="empty-seat"></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="legend mb-4">
        <div className="legend-item"><div className="legend-icon available"></div><span>Available</span></div>
        <div className="legend-item"><div className="legend-icon selected"></div><span>Selected</span></div>
        <div className="legend-item"><div className="legend-icon booked"></div><span>Booked</span></div>
      </div>

      {/* Booking Summary */}
      <div className="booking-summary">
        <h4>Total Seats: {selectedSeats.length}</h4>
        <h4>Total Price: Rs {totalPrice}</h4>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleBooking}
          disabled={selectedSeats.length === 0}
        >
          Confirm Booking
        </button>
      </div>

      <BookingConfirmation
        show={showConfirmation}
        onClose={handleConfirmationClose}
        showDetails={show}
      />
    </div>
  );
}

export default BookSeats;