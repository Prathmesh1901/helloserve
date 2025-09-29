import React, { useState, useEffect } from 'react';
import './components/AppStyles.css';
import './components/Header.css';
import './components/Menu.css';
import './components/Form.css';
import './components/Dashboard.css';
import './components/Layout.css';
import { auth, provider, signInWithPopup, signOutUser } from './firebase'; 
import PaymentPage from './PaymentPage';
import SlideMenu from './components/SlideMenu';

function App() {
  // State variables
  const [users, setUsers] = useState([]);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [initialLoading, setInitialLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState('landing'); 
  
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Owner form states (Controlled Inputs)
  const [ownerForm, setOwnerForm] = useState({
    name: '', email: '', size: '', gate: false, evCharging: false,
    shed: false, cctv: false, location: '', price: '', image: null
  });

  // Renter form states (Controlled Inputs)
  const [renterForm, setRenterForm] = useState({
    name: '', email: '', phone: '', carType: '', date: '',
    startTime: '', endTime: '', price: 0, image: null
  });
  
  const API_URL = 'http://localhost:8081';

  // --- Core Data Fetching Function ---
  const fetchData = async () => {
    try {
      setError(null);
      
      const [usersRes, spacesRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/api/users`),
          fetch(`${API_URL}/api/parking-spaces`),
          fetch(`${API_URL}/api/bookings`)
      ]);
      
      const usersData = usersRes.ok ? await usersRes.json() : [];
      const spacesData = spacesRes.ok ? await spacesRes.json() : [];
      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
      
      setUsers(usersData);
      setParkingSpaces(spacesData);
      setBookings(bookingsData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    fetchData();
    
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setScreen('dashboard'); 
      }
    });
    
    return unsubscribe;
  }, []); 


  // --- Auth & User Management ---

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setScreen('dashboard'); 
    } catch (error) {
      console.error('Google sign-in failed:', error);
      // alert('Sign-in failed. Please check your connection or allow popups.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setScreen('landing');
      setIsMenuOpen(false);
    } catch (error) {
      alert('Failed to sign out.');
    }
  };
  
  // --- Navigation & Back Button ---
  const handleBack = () => {
    if (showPayment) {
      setShowPayment(false);
    } else if (screen === 'owner' || screen === 'renter') {
      setScreen('dashboard');
    } else {
      setScreen('landing');
    }
  };
  
  // --- Profile Logic ---
  const getInitials = (user) => {
    if (!user || !user.displayName) return 'U';
    const parts = user.displayName.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const ProfileDropdown = () => {
    if (!user) return null;
    const initials = getInitials(user);

    return (
      <div className="profile-dropdown-container">
        <div className="profile-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="profile-initials">{initials}</div> 
          <span className="profile-name-small">{user.displayName || 'User Profile'}</span>
        </div>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <p style={{color: 'var(--primary-color)'}}>{user.email}</p>
            <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
      </div>
    );
  };
  
  // --- Hamburger Icon ---
  const Hamburger = () => (
    <div className={`hamburger${isMenuOpen ? ' open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <div className="hamburger-bar bar1"></div>
      <div className="hamburger-bar bar2"></div>
      <div className="hamburger-bar bar3"></div>
    </div>
  );

  // --- Header Layout ---
  const Header = () => (
    <div className="header" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 24}}>
      <Hamburger />
      <ProfileDropdown />
    </div>
  );

  // --- Data & Form Handlers ---
  const calculatePrice = () => {
    if (!renterForm.startTime || !renterForm.endTime || !renterForm.date) return 0;
    const start = new Date(`${renterForm.date}T${renterForm.startTime}`);
    const end = new Date(`${renterForm.date}T${renterForm.endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
    const pricePerHour = 50;
    return Math.round(diffHours * pricePerHour * 100) / 100;
  };

  const handleOwnerSubmit = async (e) => { 
    e.preventDefault(); 
    // Simplified logic for demo
    alert('Parking space registered successfully!'); 
    setScreen('dashboard');
  };

  const handleRenterSubmit = async (e) => { 
    e.preventDefault(); 
    const price = calculatePrice();
    if (price <= 0) { alert('Please select valid start and end times for booking.'); return; }
    setPaymentAmount(price);
    
    // Simplified logic: proceed to payment
    setShowPayment(true);
  };
  
  const handlePaymentComplete = () => { 
    alert('Payment successful! Your parking space has been booked.');
    setScreen('dashboard');
    fetchData();
  };

  // --- Render Functions ---

  if (initialLoading) {
    return (
      <div className="App">
        <div className="status-screen loading-spinner">
          <h2>Connecting to Backend Server...</h2>
          <p>Please wait while we initialize services. If this persists, check your server console or CORS settings.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="status-screen error-message">
          <h1>Connection Error</h1>
          <p>Cannot connect to backend: **{error}**</p>
          <p>This is likely a **CORS** issue or the server on **port 8081** is not running.</p>
          <button onClick={fetchData} className="submit-btn" style={{marginTop: '30px'}}>Retry Connection</button>
        </div>
      </div>
    );
  }

  const LandingScreen = () => (
    <div className="landing-page">
      <h1 className="landing-title">HelloServe</h1>
      <p className="landing-subtitle">The Professional Smart Parking and Space Leasing Platform.</p>
      
      <div className="auth-section">
        <button className="google-signin" onClick={handleGoogleSignIn}>
          {/* FIX: Final simplified logo and text */}
          <img 
            src="data:image/png;base64,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" 
            alt="Google G" 
          />
          Sign in
        </button>
      </div>
    </div>
  );
  
  const DashboardScreen = () => (
    <div className="dashboard-page">
      <h2 className="section-title">Welcome to Your Portal</h2>
      <p className="landing-subtitle" style={{marginBottom: '20px'}}>
        Please select your role to continue.
      </p>

      {/* Role Selection (Functional) */}
      <div className="role-selection">
        <div className="role-block" onClick={() => setScreen('owner')}>
          <h2>Property Owner</h2>
          <p>List your parking space, manage listings, and view earnings.</p>
        </div>
        <div className="role-block" onClick={() => setScreen('renter')}>
          <h2>Vehicle Renter</h2>
          <p>Search available spaces, book slots, and manage reservations.</p>
        </div>
      </div>
      
      {/* Stats Display (Condensed size) */}
      <div className="stats-container">
        <h3 className="section-title" style={{fontSize: '1.5em', borderBottom: '1px solid var(--border-color)', marginBottom: '20px'}}>
          Platform Overview
        </h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{parkingSpaces.length}</span>
            <span className="stat-label">Listed Spaces</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{bookings.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Registered Users</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  const OwnerScreen = () => (
    <div className="form-container">
      <button className="back-btn" onClick={handleBack}>← Back to Dashboard</button>
      <h2 className="section-title">Property Listing Submission</h2>
      <form className="form" onSubmit={handleOwnerSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input type="text" value={ownerForm.name} onChange={e => setOwnerForm({...ownerForm, name: e.target.value})} required placeholder=" " id="ownerName"/>
            <label htmlFor="ownerName">Full Name *</label>
          </div>
          <div className="form-group">
            <input type="email" value={ownerForm.email} onChange={e => setOwnerForm({...ownerForm, email: e.target.value})} required placeholder=" " id="ownerEmail"/>
            <label htmlFor="ownerEmail">Email Address *</label>
          </div>
        </div>
        <div className="form-group">
          <input type="text" value={ownerForm.location} onChange={e => setOwnerForm({...ownerForm, location: e.target.value})} required placeholder=" " id="ownerLocation"/>
          <label htmlFor="ownerLocation">Space Address/Location *</label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="number" value={ownerForm.size} onChange={e => setOwnerForm({...ownerForm, size: e.target.value})} required min="50" placeholder=" " id="ownerSize"/>
            <label htmlFor="ownerSize">Size (sq ft) *</label>
          </div>
          <div className="form-group">
            <input type="number" value={ownerForm.price} onChange={e => setOwnerForm({...ownerForm, price: e.target.value})} required min="10" placeholder=" " id="ownerPrice"/>
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
  
  const RenterScreen = () => (
    <div className="form-container">
      <button className="back-btn" onClick={handleBack}>← Back to Dashboard</button>
      <h2 className="section-title">New Parking Booking</h2>
      <form className="form" onSubmit={handleRenterSubmit}>
        <div className="form-group">
          <input type="text" value={renterForm.name} onChange={e => setRenterForm({...renterForm, name: e.target.value})} required placeholder=" " id="renterName"/>
          <label htmlFor="renterName">Full Name *</label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="email" value={renterForm.email} onChange={e => setRenterForm({...renterForm, email: e.target.value})} required placeholder=" " id="renterEmail"/>
            <label htmlFor="renterEmail">Email Address *</label>
          </div>
          <div className="form-group">
            <input type="tel" value={renterForm.phone} onChange={e => setRenterForm({...renterForm, phone: e.target.value})} required placeholder=" " pattern="[0-9]{10}" id="renterPhone"/>
            <label htmlFor="renterPhone">Phone Number *</label>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <select value={renterForm.carType} onChange={e => setRenterForm({...renterForm, carType: e.target.value})} required>
              <option value="">Select vehicle type</option>
              <option value="Hatchback">Hatchback/Sedan</option>
              <option value="SUV">SUV/Truck</option>
              <option value="Bike">Bike/Scooter</option>
              <option value="Other">Other</option>
            </select>
            <label>Vehicle Type *</label>
          </div>
          <div className="form-group">
            <label>Vehicle Image *</label>
            <input type="file" accept="image/*" onChange={e => setRenterForm({...renterForm, image: e.target.files[0]})} required/>
            <small>Upload a photo of your vehicle.</small>
          </div>
        </div>
        <div className="form-group">
          <input type="date" value={renterForm.date} onChange={e => setRenterForm({...renterForm, date: e.target.value})} required min={new Date().toISOString().split('T')[0]} id="renterDate"/>
          <label htmlFor="renterDate">Booking Date *</label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="time" value={renterForm.startTime} onChange={e => setRenterForm({...renterForm, startTime: e.target.value})} required id="renterStart"/>
            <label htmlFor="renterStart">Start Time *</label>
          </div>
          <div className="form-group">
            <input type="time" value={renterForm.endTime} onChange={e => setRenterForm({...renterForm, endTime: e.target.value})} required id="renterEnd"/>
            <label htmlFor="renterEnd">End Time *</label>
          </div>
        </div>
        <div className="form-group price-display">
          <label style={{color: 'var(--text-primary)', marginBottom: '5px'}}>Estimated Total Price</label>
          <div className="price-amount">₹{calculatePrice()}</div>
          <small style={{color: 'var(--text-primary)'}}>Rate: ₹50 per hour</small>
        </div>
        <button type="submit" className="submit-btn" disabled={calculatePrice() <= 0}>
          Proceed to Payment (₹{calculatePrice()})
        </button>
      </form>
    </div>
  );

  const PaymentScreen = () => (
    <div className="form-container">
      <button className="back-btn" onClick={handleBack}>← Back to Form</button>
      <h2 className="section-title">Secure Payment</h2>
      <div className="payment-content" style={{textAlign: 'center', padding: '20px'}}>
        <PaymentPage 
          amount={paymentAmount} 
          onPay={handlePaymentComplete} 
          bookingDetails={{
            name: renterForm.name,
            email: renterForm.email,
            date: renterForm.date,
            startTime: renterForm.startTime,
            endTime: renterForm.endTime,
            vehicleType: renterForm.carType
          }}
        />
        <p style={{marginTop: '30px', fontSize: '0.9em', color: 'var(--text-secondary)'}}>
          Note: This is a secure demonstration gateway. Clicking "Complete Payment" simulates a successful transaction.
        </p>
      </div>
    </div>
  );

  // --- Main Render Logic ---
  return (
    <div className="App">
      <Header />
      {/* SlideMenu */}
      <SlideMenu
        open={isMenuOpen}
        user={user}
        onSignOut={handleSignOut}
        onSelectRole={role => setScreen(role)}
        onClose={() => setIsMenuOpen(false)}
      />
      {/* Main Content */}
      <div className="main-content">
        {screen === 'landing' && <LandingScreen />}
        {screen === 'dashboard' && <DashboardScreen />}
        {screen === 'owner' && <OwnerScreen />}
        {screen === 'renter' && <RenterScreen />}
        {showPayment && <PaymentPage amount={paymentAmount} onPay={handlePaymentComplete} />}
      </div>
    </div>
  );
}

export default App;