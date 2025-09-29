import React from 'react';

const OwnerScreen = ({ ownerForm, setOwnerForm, handleOwnerSubmit, handleBack }) => (
  <div className="form-container">
    <button className="back-btn" onClick={handleBack}>← Back to Dashboard</button>
    <h2 className="section-title">Property Listing Submission</h2>
    <form className="form" onSubmit={handleOwnerSubmit}>
      <div className="form-row">
        <div className="form-group">
          <input type="text" value={ownerForm.name === null ? '' : String(ownerForm.name)} onChange={e => setOwnerForm({...ownerForm, name: e.target.value})} required placeholder=" " id="ownerName"/>
          <label htmlFor="ownerName">Full Name *</label>
        </div>
        <div className="form-group">
          <input type="email" value={ownerForm.email === null ? '' : String(ownerForm.email)} onChange={e => setOwnerForm({...ownerForm, email: e.target.value})} required placeholder=" " id="ownerEmail"/>
          <label htmlFor="ownerEmail">Email Address *</label>
        </div>
      </div>
      <div className="form-group">
  <input type="text" value={ownerForm.location === null ? '' : String(ownerForm.location)} onChange={e => setOwnerForm({...ownerForm, location: e.target.value})} required placeholder=" " id="ownerLocation"/>
        <label htmlFor="ownerLocation">Space Address/Location *</label>
      </div>
      <div className="form-row">
        <div className="form-group">
          <input type="number" value={ownerForm.size === null ? '' : String(ownerForm.size)} onChange={e => setOwnerForm({...ownerForm, size: e.target.value})} required min="50" placeholder=" " id="ownerSize"/>
          <label htmlFor="ownerSize">Size (sq ft) *</label>
        </div>
        <div className="form-group">
          <input type="number" value={ownerForm.price === null ? '' : String(ownerForm.price)} onChange={e => setOwnerForm({...ownerForm, price: e.target.value})} required min="10" placeholder=" " id="ownerPrice"/>
          <label htmlFor="ownerPrice">Price per Hour (₹) *</label>
        </div>
      </div>
      <div className="form-group amenities-group">
        <label>Available Amenities</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={ownerForm.gate} onChange={e => setOwnerForm({...ownerForm, gate: e.target.checked})} />
            Gated Access
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={ownerForm.evCharging} onChange={e => setOwnerForm({...ownerForm, evCharging: e.target.checked})} />
            EV Charging
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={ownerForm.shed} onChange={e => setOwnerForm({...ownerForm, shed: e.target.checked})} />
            Covered Parking
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={ownerForm.cctv} onChange={e => setOwnerForm({...ownerForm, cctv: e.target.checked})} />
            CCTV Security
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>Space Image *</label>
        <input type="file" accept="image/*" onChange={e => setOwnerForm({...ownerForm, image: e.target.files[0]})} required />
        <small>Upload a clear, high-resolution photo of the space</small>
      </div>
      <button type="submit" className="submit-btn">Submit Space Listing</button>
    </form>
  </div>
);

export default OwnerScreen;
