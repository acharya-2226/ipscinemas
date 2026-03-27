import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // use your context hook
import { login as apiLogin, getProfile } from "../api"; // API call
import { getErrorMessage } from "../errorHandler";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth(); // context login

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiLogin(username, password);

      if (data.access) {
        // Save tokens + username in localStorage
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", username);

        let role = "user";
        try {
          const profile = await getProfile();
          role = profile?.role || "user";
        } catch {
          role = "user";
        }

        // Update context (role + state)
        contextLogin(role, data.access, data.refresh, username);

        // Navigate to home page
        navigate("/");
      } else {
        setError(getErrorMessage(data) || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <img
              src="/media/logo.png"
              alt="PIX Cinemas"
              className="auth-logo"
            />
            <p>Sign in to book your tickets</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-login-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>

        <div className="login-features">
          <h3>Why choose us?</h3>
          <ul>
            <li>✅ Easy online booking</li>
            <li>✅ Secure payment</li>
            <li>✅ Latest movies</li>
            <li>✅ Best prices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
