import React from 'react';
import '../components/AppStyles.css';

function PaymentPage({ amount, onPay }) {
  return (
    <div className="form-section">
      <h2>Payment</h2>
      <p style={{fontSize: '1.2em', marginBottom: '20px'}}>Amount to pay: <span style={{color: '#764ba2', fontWeight: 'bold'}}>₹{amount}</span></p>
      <button className="submit-btn" onClick={onPay}>Pay Now</button>
      <p style={{marginTop: '20px', color: '#888'}}>Demo: Payment integration (e.g., Razorpay, Stripe) can be added here.</p>
    </div>
  );
}

export default PaymentPage;
