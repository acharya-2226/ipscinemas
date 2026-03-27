import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { isLoggedIn, username, userRole, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return null; // wait for auth check

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label="PIX Cinemas Home">
          <img
            src="/media/logo.png"
            alt="PIX Cinemas"
            className="navbar-brand-logo"
          />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/movies">Movies</Link>
            </li>

            {isLoggedIn ? (
              <>                
                <li className="nav-item">
                  <span className="nav-link">Hi, {username || "User"}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookings">My Bookings</Link>
                </li>
                {(userRole === "owner" || userRole === "staff" || userRole === "admin") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}
               
                <li className="nav-item">
                  <button className="btn btn-link nav-link logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
