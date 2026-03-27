import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./BookingConfirmation.css";

function BookingConfirmation({ show, onClose }) {
  const [transactionId, setTransactionId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transactionId.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  if (!show) return null;

  return (
    <div className="booking-confirmation-overlay">
      <div className="booking-confirmation-modal">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="confirmation-header">
              <h2>✅ Booking Confirmed!</h2>
            </div>

            <div className="confirmation-content">
              <div className="qr-section">
                <h4>Payment QR Code</h4>
                <div className="qr-container">
                  <QRCodeSVG
                    value="Thank You For Believing in our project. We'll Keep a feature to update dynamic payment QR Shortly"
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-message">
                  (Message visible when scanned)
                </p>
              </div>

              <div className="transaction-section">
                <label>Transaction ID:</label>
                <input
                  type="text"
                  placeholder="Enter transaction ID..."
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={!transactionId.trim()}>
                Submit & Close
              </button>
            </div>
          </form>
        ) : (
          <div className="submission-success">
            <div className="checkmark">✓</div>
            <h3>Payment Recorded!</h3>
            <p>Thank you for booking.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingConfirmation;
