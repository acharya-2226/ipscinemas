import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import BookSeats from "./BookSeats";
import "./ShowDetails.css";

function ShowDetails() {
  const { movieId } = useParams();
  const location = useLocation();
  const selectedDate =
    location.state?.selectedDate || new Date().toISOString().split("T")[0];

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShowId, setSelectedShowId] = useState(null);

  // Fetch movie details
  useEffect(() => {
    fetch(`http://localhost:8000/api/movies/${movieId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch movie");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [movieId]);

  // Fetch shows for the selected date
  useEffect(() => {
    fetch(
      `http://localhost:8000/api/shows/?movie_id=${movieId}&show_date=${selectedDate}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch shows");
        return res.json();
      })
      .then((data) => setShows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching shows:", err));
  }, [movieId, selectedDate]);

  if (loading) return <p className="loading-text">Loading movie details...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!movie) return <p className="not-found-text">Movie not found</p>;

  // If a show is selected, show seat booking
  if (selectedShowId) {
    return (
      <div className="show-details-container">
        <BookSeats showId={selectedShowId} onBack={() => setSelectedShowId(null)} />
      </div>
    );
  }

  return (
    <div className="show-details-container">
      <div className="movie-info">
        {/* Poster */}
        <div className="poster-container">
          <img src={movie.poster} alt={movie.title} className="movie-poster" />
        </div>

        {/* Details */}
        <div className="movie-details">
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <p>
            <strong>Duration:</strong> {movie.duration_minutes} mins
          </p>
          <p>
            <strong>Genre:</strong> {movie.genre}
          </p>
          <p>
            <strong>Price:</strong> Rs {movie.price}
          </p>

          <h3>Available Shows on {selectedDate}</h3>
          {shows.length === 0 ? (
            <p>No shows available for this day</p>
          ) : (
            <div className="shows-buttons">
              {shows.map((show) => (
                <button
                  key={show.id}
                  className="btn-login-primary show-time-btn"
                  onClick={() => setSelectedShowId(show.id)}
                >
                  {show.show_time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowDetails;