import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MoviesPage.css";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Add this

  useEffect(() => {
    fetch("http://localhost:8000/api/movies/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch movies");
        return res.json();
      })
      .then((data) => {
        setMovies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-text">Loading movies...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  // Separate movies into upcoming and now showing
  const today = new Date().toISOString().split("T")[0];
  const nowShowing = movies.filter((m) => !m.release_date || m.release_date <= today);
  const upcoming = movies.filter((m) => m.release_date && m.release_date > today);

  return (
    <div className="movies-container">
      <h2 className="movies-section-title">Now Showing</h2>
      <div className="movies-list">
        {nowShowing.length === 0 ? (
          <p>No movies currently showing.</p>
        ) : (
          nowShowing.map((movie) => (
            <div className="movie-tile" key={movie.id}>
              <img
                className="movie-poster"
                src={movie.poster}
                alt={movie.title}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/shows/${movie.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/shows/${movie.id}`);
                  }
                }}
              />
              <div className="movie-card">
                <h4>{movie.title}</h4>
                <p>{movie.genre}</p>
                <p>Duration: {movie.duration_minutes} mins</p>
                <button
                  className="btn-login-primary"
                  onClick={() => navigate(`/shows/${movie.id}`)}
                >
                  View Shows
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 className="movies-section-title">Upcoming</h2>
      <div className="movies-list">
        {upcoming.length === 0 ? (
          <p>No upcoming movies.</p>
        ) : (
          upcoming.map((movie) => (
            <div
              className="movie-tile"
              key={movie.id}
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
                <p>Duration: {movie.duration_minutes} mins</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MoviesPage;
