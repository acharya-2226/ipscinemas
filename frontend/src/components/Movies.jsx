import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies, getShows } from "../api";
import "../pages/MoviesPage.css";

const DAY_OPTIONS = [
  { key: "today", label: "Today", offset: 0 },
  { key: "tomorrow", label: "Tomorrow", offset: 1 },
  { key: "dayAfterTomorrow", label: "Day After", offset: 2 },
];

// Helper: format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split("T")[0];

function Movies() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedDay, setSelectedDay] = useState("today");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const moviesData = await getMovies();
        const showsData = await getShows();

        setMovies(moviesData.results || moviesData || []);
        setShows(showsData.results || showsData || []);
      } catch (error) {
        console.error("Error fetching movies or shows:", error);
      }
    }

    fetchData();
  }, []);

  // Compute selected date based on the day buttons
  const dayOffset = DAY_OPTIONS.find((d) => d.key === selectedDay)?.offset || 0;
  const selectedDate = new Date();
  selectedDate.setDate(selectedDate.getDate() + dayOffset);
  const formattedDate = formatDate(selectedDate);

  // Now Showing logic:
  // Include movies already released AND that have shows on selected date
  const today = new Date();
  const nowShowingMovies = movies.filter((movie) => {
    const releaseDate = new Date(movie.release_date);
    const hasShow = shows.some(
      (show) => show.movie === movie.id && show.show_date === formattedDate
    );
    return releaseDate <= today && hasShow;
  });

  return (
    <div className="movies-container now-showing-container">
      <h2 className="movies-section-title">Now Showing</h2>

      {/* Day selector buttons */}
      <div className="day-selector">
        {DAY_OPTIONS.map((day) => (
          <button
            key={day.key}
            className={`day-selector-btn ${
              selectedDay === day.key ? "btn-login-primary" : "day-selector-btn-outline"
            }`}
            onClick={() => setSelectedDay(day.key)}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="movies-list">
        {nowShowingMovies.map((movie) => (
          <div key={movie.id} className="movie-tile">
            <img
              className="movie-poster"
              src={movie.poster}
              alt={movie.title}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(`/shows/${movie.id}`, {
                  state: { selectedDate: formattedDate },
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/shows/${movie.id}`, {
                    state: { selectedDate: formattedDate },
                  });
                }
              }}
            />
            <div className="movie-card">
              <h4>{movie.title}</h4>
              <p>{movie.genre}</p>
              <p>Duration: {movie.duration || movie.duration_minutes} min</p>
              <button
                className="btn-login-primary"
                onClick={() =>
                  navigate(`/shows/${movie.id}`, {
                    state: { selectedDate: formattedDate },
                  })
                }
              >
                View Shows
              </button>
            </div>
          </div>
        ))}
        {nowShowingMovies.length === 0 && (
          <p className="error-text movies-empty-text">
            No movies scheduled for this day.
          </p>
        )}
      </div>
    </div>
  );
}

export default Movies;