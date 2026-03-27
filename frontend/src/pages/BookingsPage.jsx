import { useEffect, useState } from "react";
import { getBookings, getShows } from "../api";
import "./BookingsPage.css";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [showsById, setShowsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      const [bookingsResult, showsResult] = await Promise.allSettled([
        getBookings(),
        getShows(),
      ]);

      if (!active) return;

      if (bookingsResult.status === "rejected") {
        setError(bookingsResult.reason?.message || "Failed to load bookings");
        setLoading(false);
        return;
      }

      const bookingList = Array.isArray(bookingsResult.value)
        ? bookingsResult.value
        : [];
      const sorted = [...bookingList].sort(
        (a, b) => new Date(b.booked_at) - new Date(a.booked_at)
      );
      setBookings(sorted);

      if (showsResult.status === "fulfilled") {
        const shows = Array.isArray(showsResult.value) ? showsResult.value : [];
        const lookup = shows.reduce((acc, show) => {
          acc[show.id] = show;
          return acc;
        }, {});
        setShowsById(lookup);
      }

      setLoading(false);
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p className="loading-text">Loading bookings...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="bookings-empty">You do not have any bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const seats = Array.isArray(booking.seats) ? booking.seats : [];
            const seatLabels = seats.map((seat) => seat.seat_number).join(", ");
            const showInfo = showsById[booking.show];
            const movieName = showInfo?.movie_title || `Show #${booking.show}`;

            return (
              <div className="booking-card" key={booking.id}>
                <div className="booking-row">
                  <span className="booking-label">Booking ID</span>
                  <span className="booking-value">#{booking.id}</span>
                </div>
                <div className="booking-row">
                  <span className="booking-label">Username</span>
                  <span className="booking-value">
                    {booking.user_username || `User #${booking.user}`}
                  </span>
                </div>
                <div className="booking-row">
                  <span className="booking-label">Movie</span>
                  <span className="booking-value">{movieName}</span>
                </div>
                <div className="booking-row">
                  <span className="booking-label">Booked At</span>
                  <span className="booking-value">
                    {new Date(booking.booked_at).toLocaleString()}
                  </span>
                </div>
                <div className="booking-row">
                  <span className="booking-label">Seats</span>
                  <span className="booking-value">
                    {seatLabels || "No seats in this booking"}
                  </span>
                </div>
                <div className="booking-row">
                  <span className="booking-label">Total</span>
                  <span className="booking-value">Rs {seats.length * 200}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
