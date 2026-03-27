import { useEffect, useRef, useState } from "react";
import { createMovie, createShow, getMovies } from "../api";
import "./AdminPage.css";

const emptyMovieForm = {
  title: "",
  description: "",
  duration_minutes: "",
  price: "",
  genre: "",
  release_date: "",
  is_upcoming: false,
  poster: null,
};

const emptyShowForm = {
  movie: "",
  show_date: "",
  show_time: "",
};

function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovieForm);
  const [showForm, setShowForm] = useState(emptyShowForm);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [movieMessage, setMovieMessage] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [submittingMovie, setSubmittingMovie] = useState(false);
  const [submittingShow, setSubmittingShow] = useState(false);
  const posterInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadMovies() {
      try {
        const data = await getMovies();
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setMovies(list);
      } catch {
        if (!mounted) return;
        setMovies([]);
      } finally {
        if (mounted) setLoadingMovies(false);
      }
    }

    loadMovies();
    return () => {
      mounted = false;
    };
  }, []);

  const onMovieFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMovieForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? event.target.files?.[0] || null
          : value,
    }));
  };

  const onShowFieldChange = (event) => {
    const { name, value } = event.target;
    setShowForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitMovie = async (event) => {
    event.preventDefault();
    setMovieMessage("");
    setSubmittingMovie(true);

    try {
      const payload = new FormData();
      payload.append("title", movieForm.title);
      payload.append("description", movieForm.description);
      payload.append("duration_minutes", movieForm.duration_minutes);
      payload.append("price", movieForm.price);
      payload.append("genre", movieForm.genre);
      payload.append("is_upcoming", String(movieForm.is_upcoming));
      if (movieForm.release_date) {
        payload.append("release_date", movieForm.release_date);
      }
      if (movieForm.poster) {
        payload.append("poster", movieForm.poster);
      }

      const newMovie = await createMovie(payload);
      setMovies((prev) => [...prev, newMovie]);
      setMovieForm(emptyMovieForm);
      if (posterInputRef.current) {
        posterInputRef.current.value = "";
      }
      setMovieMessage("Movie added successfully.");
    } catch (error) {
      setMovieMessage(error.message || "Failed to add movie.");
    } finally {
      setSubmittingMovie(false);
    }
  };

  const submitShow = async (event) => {
    event.preventDefault();
    setShowMessage("");
    setSubmittingShow(true);

    try {
      await createShow({
        movie: Number(showForm.movie),
        show_date: showForm.show_date,
        show_time: showForm.show_time,
      });
      setShowForm(emptyShowForm);
      setShowMessage("Show added successfully.");
    } catch (error) {
      setShowMessage(error.message || "Failed to add show.");
    } finally {
      setSubmittingShow(false);
    }
  };

  return (
    <div className="admin-page-container">
      <h2 className="admin-title">Admin Panel</h2>
      <p className="admin-subtitle">Create movies and shows from this page.</p>

      <div className="admin-grid">
        <section className="admin-card">
          <h3>Add Movie</h3>
          <form onSubmit={submitMovie} className="admin-form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={movieForm.title}
              onChange={onMovieFieldChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={movieForm.description}
              onChange={onMovieFieldChange}
              rows={4}
            />
            <input
              type="number"
              name="duration_minutes"
              placeholder="Duration (minutes)"
              value={movieForm.duration_minutes}
              onChange={onMovieFieldChange}
              min="1"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={movieForm.price}
              onChange={onMovieFieldChange}
              min="0"
              required
            />
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={movieForm.genre}
              onChange={onMovieFieldChange}
            />
            <input
              type="date"
              name="release_date"
              value={movieForm.release_date}
              onChange={onMovieFieldChange}
            />
            <input
              ref={posterInputRef}
              type="file"
              name="poster"
              accept="image/*"
              onChange={onMovieFieldChange}
            />
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="is_upcoming"
                checked={movieForm.is_upcoming}
                onChange={onMovieFieldChange}
              />
              Upcoming movie
            </label>
            <button type="submit" className="btn btn-primary" disabled={submittingMovie}>
              {submittingMovie ? "Adding..." : "Add Movie"}
            </button>
          </form>
          {movieMessage && <p className="admin-message">{movieMessage}</p>}
        </section>

        <section className="admin-card">
          <h3>Add Show</h3>
          <form onSubmit={submitShow} className="admin-form">
            <select
              name="movie"
              value={showForm.movie}
              onChange={onShowFieldChange}
              required
              disabled={loadingMovies}
            >
              <option value="">
                {loadingMovies ? "Loading movies..." : "Select movie"}
              </option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="show_date"
              value={showForm.show_date}
              onChange={onShowFieldChange}
              required
            />
            <input
              type="time"
              name="show_time"
              value={showForm.show_time}
              onChange={onShowFieldChange}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={submittingShow}>
              {submittingShow ? "Adding..." : "Add Show"}
            </button>
          </form>
          {showMessage && <p className="admin-message">{showMessage}</p>}
        </section>
      </div>
    </div>
  );
}

export default AdminPage;
