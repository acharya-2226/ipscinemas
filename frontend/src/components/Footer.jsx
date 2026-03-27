import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row">

          {/* Left - Logo */}
          <div className="col-md-3 mb-4 mb-md-0">
            <img
              src="/media/logo.png"
              alt="PIX Cinemas"
              className="footer-logo"
            />
            <p className="small">
              Your go-to site for movie tickets, showtimes, and the latest releases.
            </p>
          </div>

          {/* About Section */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5>About</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-light text-decoration-none">Our Story</a></li>
              <li><a href="/team" className="text-light text-decoration-none">Team</a></li>
              <li><a href="/careers" className="text-light text-decoration-none">Careers</a></li>
            </ul>
          </div>

          {/* Help & Support Section */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5>Help & Support</h5>
            <ul className="list-unstyled">
              <li><a href="/faq" className="text-light text-decoration-none">FAQ</a></li>
              <li><a href="/support" className="text-light text-decoration-none">Support</a></li>
              <li><a href="mailto:support@movieapp.com" className="text-light text-decoration-none">Email Support</a></li>
              <li><a href="/terms" className="text-light text-decoration-none">Terms & Policies</a></li>
            </ul>
          </div>

          {/* Booking / Contact Section */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5>Booking</h5>
            <ul className="list-unstyled">
              <li><a href="/shows" className="text-light text-decoration-none">+977-9999999999</a></li>
              
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="text-center mt-4 small">
          © {new Date().getFullYear()} MovieApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
