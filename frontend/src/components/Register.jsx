import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as apiRegister } from "../api"; // API call
import { getErrorMessage } from "../errorHandler";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      });

      if (data.user?.id || data.access) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(getErrorMessage(data) || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <img
              src="/media/logo.png"
              alt="PIX Cinemas"
              className="auth-logo"
            />
            <p>Create your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            {success && (
              <div className="alert alert-success mb-3">
                Registration successful! Redirecting to login...
              </div>
            )}

            {/* Username, Email, Password fields only */}

            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-control"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Create a password (min 8 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-register-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>

        <div className="register-features">
          <h3>Join Today</h3>
          <ul>
            <li>🎟️ Book tickets instantly</li>
            <li>🔒 Secure & encrypted</li>
            <li>⭐ Exclusive member deals</li>
            <li>📱 Mobile-friendly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;
