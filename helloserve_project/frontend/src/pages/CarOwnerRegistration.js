import React, { useState } from 'react';

function CarOwnerRegistration({ API_URL, onProceedToPayment }) {
  const [renterForm, setRenterForm] = useState({
    name: '',
    email: '',
    phone: '',
    carType: '',
    date: '',
    startTime: '',
    endTime: '',
    image: null
  });

  const calculatePrice = () => {
    if (!renterForm.startTime || !renterForm.endTime || !renterForm.date) return 0;
    const start = new Date(`${renterForm.date}T${renterForm.startTime}`);
    const end = new Date(`${renterForm.date}T${renterForm.endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
    const pricePerHour = 50;
    return Math.round(diffHours * pricePerHour * 100) / 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = calculatePrice();
    const formData = new FormData();
    Object.entries(renterForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('price', price);
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        onProceedToPayment(price);
      } else {
        alert('Failed to create booking');
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
  };

  return (
    <div className="form-section">
      <h2>Car Owner Registration</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={renterForm.name} onChange={e => setRenterForm({...renterForm, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={renterForm.email} onChange={e => setRenterForm({...renterForm, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input type="tel" value={renterForm.phone} onChange={e => setRenterForm({...renterForm, phone: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Car Type:</label>
          <input type="text" value={renterForm.carType} onChange={e => setRenterForm({...renterForm, carType: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={renterForm.date} onChange={e => setRenterForm({...renterForm, date: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input type="time" value={renterForm.startTime} onChange={e => setRenterForm({...renterForm, startTime: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input type="time" value={renterForm.endTime} onChange={e => setRenterForm({...renterForm, endTime: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Car Image:</label>
          <input type="file" accept="image/*" onChange={e => setRenterForm({...renterForm, image: e.target.files[0]})} required />
        </div>
        <div className="form-group">
          <label>Price (₹):</label>
          <input type="number" value={calculatePrice()} readOnly />
          <small style={{color: '#764ba2'}}>Calculated in real-time based on selected time and date</small>
        </div>
        <button type="submit" className="submit-btn">Proceed to Payment</button>
      </form>
    </div>
  );
}

export default CarOwnerRegistration;
