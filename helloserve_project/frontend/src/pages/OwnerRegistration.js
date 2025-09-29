import React, { useState } from 'react';

function OwnerRegistration({ API_URL }) {
  const [ownerForm, setOwnerForm] = useState({
    name: '',
    email: '',
    size: '',
    gate: false,
    evCharging: false,
    shed: false,
    cctv: false,
    location: '',
    price: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(ownerForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      const response = await fetch(`${API_URL}/api/parking-spaces`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('Parking space registered successfully!');
        setOwnerForm({ name: '', email: '', size: '', gate: false, evCharging: false, shed: false, cctv: false, location: '', price: '', image: null });
      } else {
        alert('Failed to register parking space');
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
  };

  return (
    <div className="form-section">
      <h2>Parking Space Owner Registration</h2>
      <form className="form" onSubmit={handleSubmit}>
        {/* ...form fields as before... */}
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={ownerForm.name} onChange={e => setOwnerForm({...ownerForm, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={ownerForm.email} onChange={e => setOwnerForm({...ownerForm, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Parking Size (sq ft):</label>
          <input type="number" value={ownerForm.size} onChange={e => setOwnerForm({...ownerForm, size: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Gate Available:</label>
          <input type="checkbox" checked={ownerForm.gate} onChange={e => setOwnerForm({...ownerForm, gate: e.target.checked})} />
        </div>
        <div className="form-group">
          <label>EV Charging Port:</label>
          <input type="checkbox" checked={ownerForm.evCharging} onChange={e => setOwnerForm({...ownerForm, evCharging: e.target.checked})} />
        </div>
        <div className="form-group">
          <label>Shed for Cover:</label>
          <input type="checkbox" checked={ownerForm.shed} onChange={e => setOwnerForm({...ownerForm, shed: e.target.checked})} />
        </div>
        <div className="form-group">
          <label>CCTV Available:</label>
          <input type="checkbox" checked={ownerForm.cctv} onChange={e => setOwnerForm({...ownerForm, cctv: e.target.checked})} />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={ownerForm.location} onChange={e => setOwnerForm({...ownerForm, location: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Price per Hour (₹):</label>
          <input type="number" value={ownerForm.price} onChange={e => setOwnerForm({...ownerForm, price: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Parking Space Image:</label>
          <input type="file" accept="image/*" onChange={e => setOwnerForm({...ownerForm, image: e.target.files[0]})} required />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default OwnerRegistration;
