import React from 'react';
import './components/AppStyles.css';

function PaymentPage({ amount, onPay, bookingDetails }) {
  // We'll use the onPay prop as the click handler for the payment button

  return (
    <div className="payment-section">
      <h3 style={{color: 'var(--secondary-color)', marginBottom: '25px'}}>Booking Summary</h3>
      
      <div style={{textAlign: 'left', marginBottom: '30px', padding: '15px', border: '1px solid #333', borderRadius: '8px'}}>
        <p><strong>Renter:</strong> {bookingDetails?.name || 'N/A'}</p>
        <p><strong>Vehicle:</strong> {bookingDetails?.vehicleType || 'N/A'}</p>
        <p><strong>Date:</strong> {bookingDetails?.date || 'N/A'}</p>
        <p><strong>Time:</strong> {bookingDetails?.startTime || 'N/A'} - {bookingDetails?.endTime || 'N/A'}</p>
      </div>

      <p style={{fontSize: '1.5em', marginBottom: '20px', fontWeight: '500'}}>
        Total Payable: <span style={{color: 'var(--error-color)', fontWeight: 'bold'}}>₹{amount}</span>
      </p>

      <button className="submit-btn" onClick={onPay}>
        Complete Payment
      </button>
    </div>
  );
}

export default PaymentPage;