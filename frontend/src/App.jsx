// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import MoviesPage from "./pages/MoviesPage";
import ShowDetails from "./components/ShowDetails";
import BookSeats from "./components/BookSeats";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from "./components/Footer";
import Register from "./components/Register";
import BookingsPage from "./pages/BookingsPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/shows/:movieId" element={<ShowDetails />} />
            <Route
              path="/book/:showId"
              element={
                <ProtectedRoute>
                  <BookSeats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["owner", "staff", "admin"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
        
      </Router>
    </AuthProvider>
  );
}

export default App;
