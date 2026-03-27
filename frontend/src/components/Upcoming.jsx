import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../api";

function Upcoming() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMovies().then((data) => setMovies(data.results || data || []));
  }, []);

  const today = new Date();
  const upcomingMovies = movies.filter((movie) => {
    const releaseDate = new Date(movie.release_date);
    return releaseDate > today; // Only future movies
  });

  return (
    <div className="movies-container">
      <h2 className="movies-section-title">Upcoming Movies</h2>
      <div className="movies-list">
        {upcomingMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-tile"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/shows/${movie.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/shows/${movie.id}`);
              }
            }}
          >
            <img className="movie-poster" src={movie.poster} alt={movie.title} />
            <div className="movie-card">
              <h4>{movie.title}</h4>
              <p>{movie.genre}</p>
              <p>Release: {movie.release_date}</p>
              <p>Duration: {movie.duration || movie.duration_minutes} mins</p>
            </div>
          </div>
        ))}
        {upcomingMovies.length === 0 && (
          <p className="error-text">No upcoming movies.</p>
        )}
      </div>
    </div>
  );
}

export default Upcoming;